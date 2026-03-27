import type { UniversalMediaInput } from "./types.js";

function isImage(media: UniversalMediaInput): boolean {
  return media.kind === "image";
}

function isVideo(media: UniversalMediaInput): boolean {
  return media.kind === "video";
}

export function getVideoMedia(media: UniversalMediaInput[] = []): UniversalMediaInput | undefined {
  return media.find(isVideo);
}

export function getImageMedia(media: UniversalMediaInput[] = []): UniversalMediaInput[] {
  return media.filter(isImage);
}

export function getContentImages(media: UniversalMediaInput[] = []): UniversalMediaInput[] {
  const contentImages = media.filter((item) => isImage(item) && item.role !== "cover" && item.role !== "verticalCover");
  return contentImages.length > 0 ? contentImages : getImageMedia(media);
}

export function getCoverMedia(media: UniversalMediaInput[] = []): UniversalMediaInput | undefined {
  return media.find((item) => isImage(item) && item.role === "cover") || getImageMedia(media)[0];
}

export function getVerticalCoverMedia(media: UniversalMediaInput[] = []): UniversalMediaInput | undefined {
  return media.find((item) => isImage(item) && item.role === "verticalCover");
}

export function describeMediaSource(media: UniversalMediaInput): string {
  if (media.key) {
    return "已上传 key";
  }
  if (media.url) {
    return "远程 URL";
  }
  if (media.localPath) {
    return "本地文件";
  }
  return "未提供来源";
}
