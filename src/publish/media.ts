import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { getClient } from "../api/client.js";
import type { UniversalMediaInput } from "./types.js";

export interface UploadedMediaDescriptor {
  key: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  duration: number;
}

export interface PublishMediaDescriptor {
  key?: string;
  path?: string;
  width: number;
  height: number;
  size: number;
  duration?: number;
}

function assertUploadedDraftMedia(
  media: UniversalMediaInput,
  label: string,
): asserts media is UniversalMediaInput & { key: string } {
  if (!media.key?.trim()) {
    throw new Error(`${label} 尚未上传，请先调用 upload_media 并将返回的 key 写入发布草稿`);
  }

  if (media.localPath) {
    throw new Error(`${label} 不能直接使用 localPath，请先调用 upload_media 并改用返回的 key`);
  }

  if (media.url) {
    throw new Error(`${label} 不能直接使用 url，请先调用 upload_media 并改用返回的 key`);
  }
}

function guessContentType(fileName: string, provided?: string): string {
  if (provided) {
    return provided;
  }

  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function inferFileName(media: UniversalMediaInput): string {
  if (media.localPath) {
    return path.basename(media.localPath);
  }

  if (media.url) {
    try {
      const url = new URL(media.url);
      const fromPath = path.basename(url.pathname);
      if (fromPath) {
        return fromPath;
      }
    } catch {
      // Ignore malformed url here and fall back to generated name.
    }
  }

  return media.kind === "video" ? `asset-${Date.now()}.mp4` : `asset-${Date.now()}.jpg`;
}

async function uploadBuffer(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<{ key: string; size: number }> {
  const client = getClient();
  const uploadResult = await client.getUploadUrl(fileName, buffer.length, contentType);

  await axios.put(uploadResult.uploadUrl, buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return {
    key: uploadResult.fileKey,
    size: buffer.length,
  };
}

async function uploadLocalFile(
  media: UniversalMediaInput,
): Promise<UploadedMediaDescriptor> {
  if (!media.localPath) {
    throw new Error("缺少 localPath，无法上传本地文件");
  }

  const fileName = inferFileName(media);
  const contentType = guessContentType(fileName, media.mimeType);
  const fileBuffer = fs.readFileSync(media.localPath);
  const result = await uploadBuffer(fileBuffer, fileName, contentType);

  return {
    key: result.key,
    mimeType: contentType,
    size: media.size || result.size,
    width: media.width || 1080,
    height: media.height || 1920,
    duration: media.duration || 0,
  };
}

async function uploadRemoteFile(
  media: UniversalMediaInput,
): Promise<UploadedMediaDescriptor> {
  if (!media.url) {
    throw new Error("缺少 url，无法上传远程文件");
  }

  const response = await axios.get<ArrayBuffer>(media.url, {
    responseType: "arraybuffer",
    timeout: 120000,
    maxRedirects: 5,
  });

  const fileName = inferFileName(media);
  const contentType = guessContentType(
    fileName,
    media.mimeType || response.headers["content-type"],
  );
  const buffer = Buffer.from(response.data);
  const result = await uploadBuffer(buffer, fileName, contentType);

  return {
    key: result.key,
    mimeType: contentType,
    size: media.size || result.size,
    width: media.width || 1080,
    height: media.height || 1920,
    duration: media.duration || 0,
  };
}

export async function uploadMediaAsset(
  media: UniversalMediaInput,
): Promise<UploadedMediaDescriptor> {
  if (media.key) {
    return {
      key: media.key,
      mimeType: media.mimeType || "",
      size: media.size || 0,
      width: media.width || 1080,
      height: media.height || 1920,
      duration: media.duration || 0,
    };
  }

  if (media.localPath) {
    return uploadLocalFile(media);
  }

  if (media.url) {
    return uploadRemoteFile(media);
  }

  throw new Error("媒体资源缺少 key、url 或 localPath");
}

export async function toVideoPublishAsset(
  media: UniversalMediaInput,
): Promise<PublishMediaDescriptor> {
  assertUploadedDraftMedia(media, "视频素材");
  return {
    key: media.key,
    width: media.width || 1080,
    height: media.height || 1920,
    size: media.size || 0,
    duration: media.duration || 0,
  };
}

export async function toImagePublishAsset(
  media: UniversalMediaInput,
  mode: "cover" | "content",
): Promise<PublishMediaDescriptor> {
  assertUploadedDraftMedia(media, mode === "cover" ? "封面素材" : "图片素材");
  return {
    key: media.key,
    width: media.width || 1080,
    height: media.height || 1920,
    size: media.size || 0,
  };
}
