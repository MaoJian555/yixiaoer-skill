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

  test("creates a draft and exposes preset-backed requirements", async () => {
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
        videoCategory: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
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
        videoCategory: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
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
        videoCategory: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
        videoTopics: [],
      }),
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
        videoCategory: [{ yixiaoerId: "1", yixiaoerName: "游戏" }],
        videoTopics: [],
      }),
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
