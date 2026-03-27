import { getClient } from "../api/client.js";
import { resolvePlatformCode, resolvePlatformName } from "./platforms.js";
import type { ResolvedPlatformAccount } from "./types.js";

interface AccountRecord {
  id?: string;
  accountId?: string;
  platformName: string;
  platformAccountName: string;
}

export interface AccountResolutionResult {
  targets: ResolvedPlatformAccount[];
  blockers: string[];
  warnings: string[];
}

function matchesPlatform(account: AccountRecord, platformInput: string, platformName: string): boolean {
  return (
    account.platformName.includes(platformInput) ||
    platformInput.includes(account.platformName) ||
    account.platformName.includes(platformName) ||
    platformName.includes(account.platformName)
  );
}

function getExplicitAccountId(
  mapping: Record<string, string> | undefined,
  platformInput: string,
  platformCode: string,
  platformName: string,
): string | undefined {
  if (!mapping) {
    return undefined;
  }

  return mapping[platformInput] || mapping[platformCode] || mapping[platformName];
}

export async function resolvePlatformAccounts(
  platforms: string[],
  platformAccountIds?: Record<string, string>,
): Promise<AccountResolutionResult> {
  const client = getClient();
  const accountsResponse = await client.getAccounts({ page: 1, size: 200, loginStatus: 1 });
  const accounts = accountsResponse.data || [];

  const result: AccountResolutionResult = {
    targets: [],
    blockers: [],
    warnings: [],
  };

  for (const platformInput of platforms) {
    const platformCode = resolvePlatformCode(platformInput);
    const platformName = resolvePlatformName(platformInput);

    if (!platformCode || !platformName) {
      result.blockers.push(`不支持的平台: ${platformInput}`);
      continue;
    }

    const explicitAccountId = getExplicitAccountId(
      platformAccountIds,
      platformInput,
      platformCode,
      platformName,
    );

    if (explicitAccountId) {
      const explicitAccount = accounts.find((account) => {
        const accountId = account.id || account.accountId;
        return accountId === explicitAccountId;
      });

      if (!explicitAccount) {
        result.blockers.push(
          `${platformName} 指定的 platformAccountId=${explicitAccountId} 不存在或未登录`,
        );
        continue;
      }

      if (!matchesPlatform(explicitAccount, platformInput, platformName)) {
        result.blockers.push(
          `${platformName} 指定的账号 ${explicitAccountId} 不属于当前平台`,
        );
        continue;
      }

      result.targets.push({
        platformInput,
        platformCode,
        platformName,
        platformAccountId: explicitAccount.id || explicitAccount.accountId || explicitAccountId,
        platformAccountName: explicitAccount.platformAccountName,
      });
      continue;
    }

    const matches = accounts.filter((account) =>
      matchesPlatform(account, platformInput, platformName),
    );

    if (matches.length === 0) {
      result.blockers.push(
        `${platformName} 没有可用的已登录账号，请先在蚁小二绑定并登录账号`,
      );
      continue;
    }

    if (matches.length > 1) {
      const options = matches
        .map(
          (account) =>
            `${account.platformAccountName}(${account.id || account.accountId})`,
        )
        .join("、");
      result.blockers.push(
        `${platformName} 匹配到多个账号，请通过 platformAccountIds 明确指定：${options}`,
      );
      continue;
    }

    const onlyAccount = matches[0];
    result.targets.push({
      platformInput,
      platformCode,
      platformName,
      platformAccountId: onlyAccount.id || onlyAccount.accountId || "",
      platformAccountName: onlyAccount.platformAccountName,
    });
  }

  return result;
}
