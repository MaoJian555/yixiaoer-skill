import type {
  CascadingPlatformDataItem,
  PlatformAccountCategoryItem,
} from "../../types.d.ts";

export interface PublishCategoryValueItem {
  yixiaoerId: string;
  yixiaoerName: string;
  raw: unknown;
}

function toPublishCategoryValueItem(
  item: PlatformAccountCategoryItem,
): PublishCategoryValueItem {
  return {
    yixiaoerId: item.yixiaoerId,
    yixiaoerName: item.yixiaoerName,
    raw: item.raw,
  };
}

function getCategoryChildren(
  item: PlatformAccountCategoryItem,
): PlatformAccountCategoryItem[] {
  return Array.isArray(item.child) ? item.child : [];
}

export function buildPublishCategoryValues(
  categories: PlatformAccountCategoryItem[],
  parentPath: PublishCategoryValueItem[] = [],
): PublishCategoryValueItem[][] {
  const result: PublishCategoryValueItem[][] = [];

  for (const category of categories) {
    const currentPath = [...parentPath, toPublishCategoryValueItem(category)];
    const children = getCategoryChildren(category);

    if (children.length === 0) {
      result.push(currentPath);
      continue;
    }

    result.push(...buildPublishCategoryValues(children, currentPath));
  }

  return result;
}

export function toCascadingCategoryItems(
  categories: PlatformAccountCategoryItem[],
): CascadingPlatformDataItem[] {
  return categories.map((item) => {
    const children = getCategoryChildren(item);

    return {
      id: item.yixiaoerId,
      text: item.yixiaoerName,
      raw: item.raw,
      children: children.length > 0 ? toCascadingCategoryItems(children) : undefined,
    };
  });
}
