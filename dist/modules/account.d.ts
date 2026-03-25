import type { ListAccountsParams, ListGroupsParams, SkillResult } from '../../types.d.ts';
export declare function listAccounts(params: ListAccountsParams): Promise<SkillResult>;
export declare function getPublishPreset(params: {
    platformAccountId: string;
}): Promise<SkillResult>;
export declare function listGroups(params: ListGroupsParams): Promise<SkillResult>;
//# sourceMappingURL=account.d.ts.map