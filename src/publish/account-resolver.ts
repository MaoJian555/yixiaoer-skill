import { resolvePlatformCode, resolvePlatformName } from "./platforms.js";
import type { PlatformAccountIdInput, ResolvedPlatformAccount } from "./types.js";

export interface AccountResolutionResult {
  targets: ResolvedPlatformAccount[];
  blockers: string[];
  warnings: string[];
}

function normalizeAccountIds(value: PlatformAccountIdInput | undefined): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function buildTargetKey(platformCode: string, platformAccountId: string): string {
  return `${platformCode}:${platformAccountId}`;
}

function getExplicitAccountIds(
  mapping: Record<string, PlatformAccountIdInput> | undefined,
  platformInput: string,
  platformCode: string,
  platformName: string,
): string[] {
  if (!mapping) {
    return [];
  }

  return normalizeAccountIds(
    mapping[platformInput] || mapping[platformCode] || mapping[platformName],
  );
}

export async function resolvePlatformAccounts(
  platforms: string[],
  platformAccountIds?: Record<string, PlatformAccountIdInput>,
): Promise<AccountResolutionResult> {
  const result: AccountResolutionResult = {
    targets: [],
    blockers: [],
    warnings: [],
  };
  const seenTargetKeys = new Set<string>();

  for (const platformInput of platforms) {
    const platformCode = resolvePlatformCode(platformInput);
    const platformName = resolvePlatformName(platformInput);

    if (!platformCode || !platformName) {
      result.blockers.push(`不支持的平台: ${platformInput}`);
      continue;
    }

    const explicitAccountIds = getExplicitAccountIds(
      platformAccountIds,
      platformInput,
      platformCode,
      platformName,
    );

    if (explicitAccountIds.length === 0) {
      result.blockers.push(
        `${platformName} 缺少 platformAccountId；当前项目没有账号列表查询接口，请通过 platformAccountIds 显式传入账号 ID`,
      );
      continue;
    }

    for (const explicitAccountId of explicitAccountIds) {
      const targetKey = buildTargetKey(platformCode, explicitAccountId);
      if (seenTargetKeys.has(targetKey)) {
        continue;
      }
      seenTargetKeys.add(targetKey);

      result.targets.push({
        targetKey,
        platformInput,
        platformCode,
        platformName,
        platformAccountId: explicitAccountId,
        platformAccountName: explicitAccountId,
      });
    }
  }

  return result;
}
