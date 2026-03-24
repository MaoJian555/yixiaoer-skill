import type { SkillResult, OpenClawApi } from './types.js';
export default function plugin(api?: OpenClawApi): ((action: string, params: any) => Promise<SkillResult>) | void;
