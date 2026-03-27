const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const tempRoot = path.resolve(__dirname, ".compiled-openclaw-tools");

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

async function loadOpenClawToolsModule() {
  const compiledEntry = compileTypeScriptTree(path.resolve(__dirname, "../src/openclaw-tools/index.ts"));
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

describe("OpenClaw tool registration", () => {
  let openClawTools;

  beforeAll(async () => {
    openClawTools = await loadOpenClawToolsModule();
  });

  afterAll(() => {
    if (fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test("registers the draft workflow tools and category lookup", async () => {
    const registered = [];
    const logMessages = [];

    await openClawTools.registerOpenClawTools({
      registerTool(tool, opts) {
        registered.push({ ...tool, optional: Boolean(opts?.optional) });
      },
      logger: {
        info(message) {
          logMessages.push(message);
        },
      },
    });

    expect(registered.map((tool) => tool.name)).toEqual([
      "get_platform_account_categories",
      "create_publish_draft",
      "update_publish_draft",
      "get_publish_requirements",
      "submit_publish_answers",
      "preview_publish_draft",
      "publish_draft",
      "upload_media",
    ]);

    expect(registered.some((tool) => tool.name === "publish_video")).toBe(false);
    expect(registered.some((tool) => tool.name === "multi_platform_publish")).toBe(false);
    expect(registered.every((tool) => typeof tool.execute === "function")).toBe(true);
    expect(registered.every((tool) => tool.optional)).toBe(true);
    expect(logMessages[0]).toContain("categories");
  });
});
