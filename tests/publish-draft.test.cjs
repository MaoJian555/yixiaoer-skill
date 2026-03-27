const fs = require("fs");
const os = require("os");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const tempRoot = path.resolve(__dirname, ".compiled-publish-draft");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function compileTypeScriptTree(entryFile) {
  ensureDir(tempRoot);
  fs.writeFileSync(path.join(tempRoot, "package.json"), JSON.stringify({ type: "commonjs" }));
  const visited = new Set();

  function compileFile(sourceFile) {
    const normalizedSource = path.resolve(sourceFile);
    if (visited.has(normalizedSource)) {
      return;
    }
    visited.add(normalizedSource);

    const sourceText = fs.readFileSync(normalizedSource, "utf8");
    const importMatches = sourceText.matchAll(/from\s+["'](\.[^"']+)["']|import\(\s*["'](\.[^"']+)["']\s*\)/g);

    for (const match of importMatches) {
      const specifier = match[1] || match[2];
      if (!specifier || !specifier.endsWith(".js")) {
        continue;
      }

      const tsTarget = path.resolve(path.dirname(normalizedSource), specifier.replace(/\.js$/, ".ts"));
      if (fs.existsSync(tsTarget)) {
        compileFile(tsTarget);
      }
    }

    const transpiled = ts.transpileModule(sourceText, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: normalizedSource,
    });

    const relativePath = path.relative(path.resolve(__dirname, "../src"), normalizedSource);
    const outputPath = path.join(tempRoot, relativePath).replace(/\.ts$/, ".js");
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, transpiled.outputText);
  }

  compileFile(entryFile);
  return path.join(tempRoot, path.relative(path.resolve(__dirname, "../src"), entryFile)).replace(/\.ts$/, ".js");
}

async function loadDraftModule() {
  const compiledEntry = compileTypeScriptTree(path.resolve(__dirname, "../src/publish/drafts.ts"));
  const compiledCode = fs.readFileSync(compiledEntry, "utf8");
  const tempModule = new Module.Module(compiledEntry, module);
  tempModule.filename = compiledEntry;
  tempModule.paths = [
    ...Module._nodeModulePaths(path.dirname(compiledEntry)),
    ...Module._nodeModulePaths(path.resolve(__dirname, "..")),
  ];
  tempModule._compile(compiledCode, compiledEntry);
  return tempModule.exports;
}

describe("publish draft workflow", () => {
  let drafts;

  beforeAll(async () => {
    drafts = await loadDraftModule();
  });

  afterAll(() => {
    if (fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    drafts.clearPublishDraftStore();
    drafts.__resetDraftTestDependencies();
  });

  test("rejects raw media sources during draft creation", async () => {
    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", localPath: path.join(os.tmpdir(), "demo.mp4") },
        { kind: "image", role: "cover", url: "https://example.com/cover.jpg" },
      ],
    });

    expect(created.success).toBe(false);
    expect(created.message).toContain("upload_media");
    expect(created.message).toContain("localPath");
    expect(created.message).toContain("url");
  });

  test("requires explicit platformAccountIds when account listing is unavailable", async () => {
    const created = await drafts.createPublishDraft({
      title: "简书文章",
      body: "这是一个文章草稿",
      platforms: ["简书"],
      media: [
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(false);
    expect(created.message).toContain("platformAccountId");
    expect(created.message).toContain("账号列表查询接口");
  });

  test("uses explicit platformAccountIds without querying account list", async () => {
    const created = await drafts.createPublishDraft({
      title: "简书文章",
      body: "这是一个文章草稿",
      platforms: ["简书"],
      platformAccountIds: {
        简书: "account-42",
      },
      media: [
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);
    expect(created.data.targets).toEqual([
      expect.objectContaining({
        platformCode: "JianShu",
        targetKey: "JianShu:account-42",
        platformAccountId: "account-42",
        platformAccountName: "account-42",
      }),
    ]);
  });

  test("expands array-based platformAccountIds into multiple targets across same and different platforms", async () => {
    const created = await drafts.createPublishDraft({
      title: "多账号文章",
      body: "这是一个多账号文章草稿",
      platforms: ["简书", "微博"],
      platformAccountIds: {
        简书: ["account-1", "account-2"],
        微博: "weibo-1",
      },
      media: [
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);
    expect(created.data.targets.map((target) => target.targetKey)).toEqual([
      "JianShu:account-1",
      "JianShu:account-2",
      "XinLangWeiBo:weibo-1",
    ]);
  });

  test("creates a draft and exposes account-backed category requirements", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPlatformAccountCategories: async () => [
        { yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } },
      ],
      getPublishPreset: async () => ({
        videoTopics: [{ yixiaoerId: "2", yixiaoerName: "攻略" }],
      }),
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);
    expect(created.data.id).toMatch(/^publish_draft_/);

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    expect(requirements.data.requirements).toHaveLength(1);

    const acfun = requirements.data.requirements[0];
    expect(acfun.platformCode).toBe("AcFun");
    expect(acfun.fields.some((field) => field.name === "category" && field.source === "preset")).toBe(true);
    expect(acfun.fields.find((field) => field.name === "category").options).toEqual([
      [{ yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } }],
    ]);
  });

  test("flattens nested category trees into publish-ready category arrays", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPlatformAccountCategories: async () => [
        {
          yixiaoerId: "parent-1",
          yixiaoerName: "游戏",
          raw: "parent-raw",
          child: [
            {
              yixiaoerId: "child-1",
              yixiaoerName: "单机游戏",
              raw: "child-raw",
            },
          ],
        },
      ],
      getPublishPreset: async () => ({
        videoTopics: [],
      }),
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    const categoryField = requirements.data.requirements[0].fields.find((field) => field.name === "category");

    expect(categoryField.options).toEqual([
      [
        { yixiaoerId: "parent-1", yixiaoerName: "游戏", raw: "parent-raw" },
        { yixiaoerId: "child-1", yixiaoerName: "单机游戏", raw: "child-raw" },
      ],
    ]);
  });

  test("does not expose required fields that the content form already auto-populates", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "百家号",
            platformCode: "BaiJiaHao",
            platformName: "百家号",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoCategory: [],
        videoTopics: [],
      }),
      getPlatformAccountCategories: async () => [],
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["百家号"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    const baiJiaHao = requirements.data.requirements[0];

    expect(baiJiaHao.platformCode).toBe("BaiJiaHao");
    expect(baiJiaHao.fields.some((field) => field.name === "declaration")).toBe(false);
  });

  test("rejects invalid answers and preview reports blockers", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoTopics: [],
      }),
      getPlatformAccountCategories: async () => [
        { yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } },
      ],
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    const answered = await drafts.submitPublishAnswers({
      draftId: created.data.id,
      answers: {
        AcFun: {
          category: "not-an-array",
          unknownField: 1,
        },
      },
    });

    expect(answered.success).toBe(false);
    expect(answered.message).toContain("阻塞项");

    const preview = await drafts.previewPublishDraft({ draftId: created.data.id });
    expect(preview.success).toBe(false);
    expect(preview.message).toContain("缺失字段");
    expect(preview.data.preview.blockers.join(" ")).toContain("category");
  });

  test("marks unsupported resolver fields in requirements", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "抖音",
            platformCode: "DouYin",
            platformName: "抖音",
            platformAccountId: "acc-2",
            platformAccountName: "抖音号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoCategory: null,
        videoTopics: null,
      }),
      getPlatformAccountCategories: async () => [],
    });

    const created = await drafts.createPublishDraft({
      body: "抖音视频草稿",
      platforms: ["抖音"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    const douyin = requirements.data.requirements[0];
    const locationField = douyin.fields.find((field) => field.name === "location");

    expect(locationField).toBeTruthy();
    expect(locationField.availability).toBe("unsupported");
    expect(locationField.limitation).toContain("未接入");
  });

  test("marks group fields as unsupported when group APIs are unavailable", async () => {
    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "小红书",
            platformCode: "XiaoHongShu",
            platformName: "小红书",
            platformAccountId: "acc-3",
            platformAccountName: "小红书号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoTopics: null,
      }),
      getPlatformAccountCategories: async () => [],
    });

    const created = await drafts.createPublishDraft({
      body: "小红书视频草稿",
      platforms: ["小红书"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    const xiaohongshu = requirements.data.requirements[0];
    const groupField = xiaohongshu.fields.find((field) => field.name === "group");

    expect(groupField).toBeTruthy();
    expect(groupField.availability).toBe("unsupported");
    expect(groupField.limitation).toContain("分组接口");
  });

  test("publishes a validated draft through internal materialization", async () => {
    const publishCalls = [];

    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoTopics: [],
      }),
      getPlatformAccountCategories: async () => [
        { yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } },
      ],
      submitPublishTask: async (payload) => {
        publishCalls.push(payload);
        return {
          success: true,
          message: "mock publish ok",
          data: { taskId: "task-1" },
        };
      },
      toVideoPublishAsset: async () => ({
        key: "video-key",
        duration: 12,
        width: 1080,
        height: 1920,
        size: 1024,
      }),
      toImagePublishAsset: async () => ({
        key: "cover-key",
        width: 1080,
        height: 1920,
        size: 256,
      }),
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    const answered = await drafts.submitPublishAnswers({
      draftId: created.data.id,
      answers: {
        AcFun: {
          category: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
          type: 0,
        },
      },
    });

    expect(answered.success).toBe(true);

    const preview = await drafts.previewPublishDraft({ draftId: created.data.id });
    expect(preview.success).toBe(true);
    expect(preview.data.preview.previewItems).toHaveLength(1);

    const published = await drafts.publishDraft({ draftId: created.data.id });
    expect(published.success).toBe(true);
    expect(publishCalls).toHaveLength(1);
    expect(publishCalls[0].targets.map((target) => target.platformName)).toEqual(["AcFun"]);
    expect(publishCalls[0].accountForms[0].video.key).toBe("video-key");
    expect(publishCalls[0].accountForms[0].coverKey).toBe("cover-key");
  });

  test("supports multiple accounts on the same platform with target-scoped answers", async () => {
    const publishCalls = [];

    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            targetKey: "AcFun:acc-1",
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
          {
            targetKey: "AcFun:acc-2",
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-2",
            platformAccountName: "副账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoTopics: [],
      }),
      getPlatformAccountCategories: async () => [
        { yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } },
        { yixiaoerId: "2", yixiaoerName: "生活", raw: { id: "2", name: "生活" } },
      ],
      submitPublishTask: async (payload) => {
        publishCalls.push(payload);
        return {
          success: true,
          message: "mock publish ok",
          data: { taskId: "task-multi-1" },
        };
      },
      toVideoPublishAsset: async () => ({
        key: "video-key",
        duration: 12,
        width: 1080,
        height: 1920,
        size: 1024,
      }),
      toImagePublishAsset: async () => ({
        key: "cover-key",
        width: 1080,
        height: 1920,
        size: 256,
      }),
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个同平台多账号视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);

    const requirements = await drafts.getPublishRequirements({ draftId: created.data.id });
    expect(requirements.success).toBe(true);
    expect(requirements.data.requirements.map((item) => item.targetKey)).toEqual([
      "AcFun:acc-1",
      "AcFun:acc-2",
    ]);

    const ambiguous = await drafts.submitPublishAnswers({
      draftId: created.data.id,
      answers: {
        AcFun: {
          category: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
          type: 0,
        },
      },
    });

    expect(ambiguous.success).toBe(false);
    expect(ambiguous.message).toContain("多个账号");

    const answered = await drafts.submitPublishAnswers({
      draftId: created.data.id,
      answers: {
        "AcFun:acc-1": {
          category: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
          type: 0,
        },
        "acc-2": {
          category: [{ yixiaoerId: "2", yixiaoerName: "生活" }],
          type: 0,
        },
      },
    });

    expect(answered.success).toBe(true);

    const preview = await drafts.previewPublishDraft({ draftId: created.data.id });
    expect(preview.success).toBe(true);
    expect(preview.message).toContain("目标键: AcFun:acc-1");
    expect(preview.message).toContain("目标键: AcFun:acc-2");

    const published = await drafts.publishDraft({ draftId: created.data.id });
    expect(published.success).toBe(true);
    expect(publishCalls).toHaveLength(1);
    expect(publishCalls[0].accountForms).toHaveLength(2);
    expect(publishCalls[0].accountForms[0].platformAccountId).toBe("acc-1");
    expect(publishCalls[0].accountForms[1].platformAccountId).toBe("acc-2");
    expect(publishCalls[0].accountForms[0].contentPublishForm.category).toEqual([
      { yixiaoerId: "1", yixiaoerName: "游戏" },
    ]);
    expect(publishCalls[0].accountForms[1].contentPublishForm.category).toEqual([
      { yixiaoerId: "2", yixiaoerName: "生活" },
    ]);
    expect(publishCalls[0].targets.map((target) => target.platformAccountId)).toEqual(["acc-1", "acc-2"]);
  });

  test("does not implicitly upload or publish when draft media fall back to raw sources", async () => {
    const publishCalls = [];
    let videoConversions = 0;

    drafts.__setDraftTestDependencies({
      resolvePlatformAccounts: async () => ({
        targets: [
          {
            platformInput: "AcFun",
            platformCode: "AcFun",
            platformName: "AcFun",
            platformAccountId: "acc-1",
            platformAccountName: "主账号",
          },
        ],
        blockers: [],
        warnings: [],
      }),
      getPublishPreset: async () => ({
        videoTopics: [],
      }),
      getPlatformAccountCategories: async () => [
        { yixiaoerId: "1", yixiaoerName: "游戏", raw: { id: "1", name: "游戏" } },
      ],
      submitPublishTask: async (payload) => {
        publishCalls.push(payload);
        return {
          success: true,
          message: "mock publish ok",
          data: { taskId: "task-1" },
        };
      },
      toVideoPublishAsset: async () => {
        videoConversions += 1;
        return {
          key: "video-key",
          duration: 12,
          width: 1080,
          height: 1920,
          size: 1024,
        };
      },
      toImagePublishAsset: async () => ({
        key: "cover-key",
        width: 1080,
        height: 1920,
        size: 256,
      }),
    });

    const created = await drafts.createPublishDraft({
      body: "这是一个视频草稿",
      platforms: ["AcFun"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(created.success).toBe(true);

    const updated = await drafts.updatePublishDraft({
      draftId: created.data.id,
      media: [
        { kind: "video", localPath: path.join(os.tmpdir(), "demo.mp4") },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
      ],
    });

    expect(updated.success).toBe(false);
    expect(updated.message).toContain("upload_media");

    const published = await drafts.publishDraft({ draftId: created.data.id });
    expect(published.success).toBe(false);
    expect(published.message).toContain("upload_media");
    expect(videoConversions).toBe(0);
    expect(publishCalls).toHaveLength(0);
  });
});
