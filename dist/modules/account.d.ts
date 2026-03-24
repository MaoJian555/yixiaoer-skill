import type { ListAccountsParams, SkillResult } from '../types.js';
export declare function listAccounts(params: ListAccountsParams): Promise<SkillResult>;
export declare function getPublishPreset(params: {
    platformAccountId: string;
}): Promise<SkillResult>;
