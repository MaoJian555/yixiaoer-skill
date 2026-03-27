"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoMedia = getVideoMedia;
exports.getImageMedia = getImageMedia;
exports.getContentImages = getContentImages;
exports.getCoverMedia = getCoverMedia;
exports.getVerticalCoverMedia = getVerticalCoverMedia;
exports.describeMediaSource = describeMediaSource;
function isImage(media) {
    return media.kind === "image";
}
function isVideo(media) {
    return media.kind === "video";
}
function getVideoMedia(media = []) {
    return media.find(isVideo);
}
function getImageMedia(media = []) {
    return media.filter(isImage);
}
function getContentImages(media = []) {
    const contentImages = media.filter((item) => isImage(item) && item.role !== "cover" && item.role !== "verticalCover");
    return contentImages.length > 0 ? contentImages : getImageMedia(media);
}
function getCoverMedia(media = []) {
    return media.find((item) => isImage(item) && item.role === "cover") || getImageMedia(media)[0];
}
function getVerticalCoverMedia(media = []) {
    return media.find((item) => isImage(item) && item.role === "verticalCover");
}
function describeMediaSource(media) {
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
