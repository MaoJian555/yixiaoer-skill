import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";

export type OpenClawPluginAPI = Pick<
  OpenClawPluginApi,
  "registerTool" | "pluginConfig" | "config" | "logger"
>;
