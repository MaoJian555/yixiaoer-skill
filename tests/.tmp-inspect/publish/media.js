"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMediaAsset = uploadMediaAsset;
exports.toVideoPublishAsset = toVideoPublishAsset;
exports.toImagePublishAsset = toImagePublishAsset;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const client_js_1 = require("../api/client.js");
function assertUploadedDraftMedia(media, label) {
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
function guessContentType(fileName, provided) {
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
function inferFileName(media) {
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
        }
        catch {
            // Ignore malformed url here and fall back to generated name.
        }
    }
    return media.kind === "video" ? `asset-${Date.now()}.mp4` : `asset-${Date.now()}.jpg`;
}
async function uploadBuffer(buffer, fileName, contentType) {
    const client = (0, client_js_1.getClient)();
    const uploadResult = await client.getUploadUrl(fileName, buffer.length, contentType);
    await axios_1.default.put(uploadResult.uploadUrl, buffer, {
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
async function uploadLocalFile(media) {
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
async function uploadRemoteFile(media) {
    if (!media.url) {
        throw new Error("缺少 url，无法上传远程文件");
    }
    const response = await axios_1.default.get(media.url, {
        responseType: "arraybuffer",
        timeout: 120000,
        maxRedirects: 5,
    });
    const fileName = inferFileName(media);
    const contentType = guessContentType(fileName, media.mimeType || response.headers["content-type"]);
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
async function uploadMediaAsset(media) {
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
async function toVideoPublishAsset(media) {
    assertUploadedDraftMedia(media, "视频素材");
    return {
        key: media.key,
        width: media.width || 1080,
        height: media.height || 1920,
        size: media.size || 0,
        duration: media.duration || 0,
    };
}
async function toImagePublishAsset(media, mode) {
    assertUploadedDraftMedia(media, mode === "cover" ? "封面素材" : "图片素材");
    return {
        key: media.key,
        width: media.width || 1080,
        height: media.height || 1920,
        size: media.size || 0,
    };
}
