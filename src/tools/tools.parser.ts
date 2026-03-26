import * as fs from "fs";
import * as path from "path";

interface ToolDefinition {
  name: string;
  description: string;
  parameters: unknown;
  executeMethod: string;
}

const TOOLS_MD_PATH = path.resolve(process.cwd(), "skills/openclaw-yixiaoer/tools.md");

export function loadToolsFromMarkdown(): ToolDefinition[] {
  try {
    const content = fs.readFileSync(TOOLS_MD_PATH, "utf-8");
    const tools: ToolDefinition[] = [];

    const sections = content.split(/^### /m);

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split("\n");

      const name = lines[0].trim();
      if (!name) continue;

      let description = "";
      let paramsJson = "";
      let executeMethod = "";
      let inParams = false;

      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];

        if (line.includes("**描述**")) {
          const match = line.match(/\*\*描述\*\*[:：]\s*(.+)/);
          if (match) description = match[1].trim();
          continue;
        }

        if (line.includes("**执行方法**")) {
          const match = line.match(/\*\*执行方法\*\*[:：]\s*`?([^`\n]+)`?/);
          if (match) executeMethod = match[1].trim();
          continue;
        }

        if (line.includes("**参数**")) {
          inParams = true;
          continue;
        }

        if (inParams) {
          if (line.includes("```json")) {
            paramsJson = "";
            continue;
          }
          if (line.includes("```") && paramsJson) {
            inParams = false;
            continue;
          }
          if (line.trim()) {
            paramsJson += line + "\n";
          }
        }
      }

      if (name && description && executeMethod) {
        let parameters = {};
        try {
          const cleaned = paramsJson.replace(/^```json\n?/, "").replace(/```$/, "").trim();
          if (cleaned) {
            parameters = JSON.parse(cleaned);
          }
        } catch (e) {
          console.warn(`⚠️ 解析工具 ${name} 参数失败:`, (e as Error).message);
        }

        tools.push({ name, description, parameters, executeMethod });
      }
    }

    return tools;
  } catch (e) {
    console.error("❌ 加载 tools.md 失败:", (e as Error).message);
    return [];
  }
}

export function getToolExecuteMethod(toolName: string): string | null {
  const tools = loadToolsFromMarkdown();
  const tool = tools.find(t => t.name === toolName);
  return tool?.executeMethod || null;
}

export type { ToolDefinition };