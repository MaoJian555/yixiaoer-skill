const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const tempRoot = path.resolve(__dirname, ".compiled-platform-field-validation");

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

function loadCompiledModule(relativePath) {
  const entryFile = path.resolve(__dirname, "..", "src", relativePath);
  const compiledEntry = compileTypeScriptTree(entryFile);
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

function hasProvidedValue(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return false;
}

describe("platform field validation coverage", () => {
  let rules;
  let platforms;
  let mapper;
  let validator;

  beforeAll(() => {
    rules = loadCompiledModule("config/platform-rules.ts");
    platforms = loadCompiledModule("publish/platforms.ts");
    mapper = loadCompiledModule("publish/mapper.ts");
    validator = loadCompiledModule("publish/validator.ts");
  });

  afterAll(() => {
    if (fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test("auto-populated required fields are recognized as already provided across schemas", () => {
    const sampleInput = {
      title: "测试标题",
      body: "测试正文",
      tags: ["测试标签"],
      scheduleAt: 1743062400000,
      platforms: ["unused"],
      media: [
        { kind: "video", key: "video-key", duration: 12, width: 1080, height: 1920, size: 1024 },
        { kind: "image", role: "cover", key: "cover-key", width: 1080, height: 1920, size: 256 },
        { kind: "image", role: "verticalCover", key: "vertical-cover-key", width: 1080, height: 1920, size: 256 },
        { kind: "image", role: "content", key: "content-key", width: 1080, height: 1920, size: 256 },
      ],
    };

    const leakedRequiredFields = [];

    for (const [platformCode, rule] of Object.entries(rules.PLATFORM_RULES)) {
      for (const publishType of rule.supportedTypes) {
        const target = {
          platformInput: platformCode,
          platformCode,
          platformName: rule.name,
          platformAccountId: "acc-1",
          platformAccountName: "主账号",
        };
        const { contentPublishForm } = mapper.buildPlatformContentForm(sampleInput, target, publishType);
        const providedFields = validator.collectProvidedFields(sampleInput, publishType, contentPublishForm);
        const autoProvidedFields = new Set(
          Object.entries(contentPublishForm)
            .filter(([key, value]) => key !== "formType" && hasProvidedValue(value))
            .map(([key]) => key),
        );
        const requiredFields = new Map();

        for (const form of platforms.getFormsForPublishType(platformCode, publishType)) {
          for (const field of form.fields) {
            if (field.required) {
              requiredFields.set(field.name, field);
            }
          }
        }

        for (const fieldName of requiredFields.keys()) {
          if (autoProvidedFields.has(fieldName) && !providedFields.has(fieldName)) {
            leakedRequiredFields.push(`${platformCode}:${publishType}:${fieldName}`);
          }
        }
      }
    }

    expect(leakedRequiredFields).toEqual([]);
  });
});
