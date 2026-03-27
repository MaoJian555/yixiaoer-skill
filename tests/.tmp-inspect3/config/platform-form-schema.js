"use strict";
/**
 * platform-form-schema.ts
 *
 * ⚠️ 此文件由脚本自动生成，请勿手动修改！
 * 生成命令：node scripts/generate-platform-form-schema.mjs
 * 生成时间：2026/3/26 15:39:12
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_FORM_SCHEMA = void 0;
exports.PLATFORM_FORM_SCHEMA = {
    "AcFun": {
        "platformCode": "AcFun",
        "platformTitle": "AcFun",
        "forms": [
            {
                "formName": "AcFunVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "type",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "内容类型 - 视频的内容类型，1:原创 0:非原创",
                        "valueRange": "1=原创, 0=非原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 0,
                                "label": "非原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "AcFunArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "desc",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "文章描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "contentSourceUrl",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "原文链接，当创作类型为转载时必须填写",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "category",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "type",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 0:不申明 1:申明原创",
                        "valueRange": "0=不申明, 1=申明原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不申明"
                            },
                            {
                                "value": 1,
                                "label": "申明原创"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "AiQiYi": {
        "platformCode": "AiQiYi",
        "platformTitle": "AiQiYi",
        "forms": [
            {
                "formName": "AiQiYiVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "type",
                        "rawType": "1",
                        "valueType": "number",
                        "required": true,
                        "description": "内容类型 0:草稿 1:直接发布",
                        "valueRange": "0=草稿, 1=直接发布",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "草稿"
                            },
                            {
                                "value": 1,
                                "label": "直接发布"
                            }
                        ],
                        "example": "1"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'声明字段0:无需申明 1:内容由AI生成 2:虚构演绎仅供娱乐 3:取材网络",
                        "valueRange": "0=无需申明, 1=内容由AI生成, 2=虚构演绎仅供娱乐, 3=取材网络",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "无需申明"
                            },
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "虚构演绎仅供娱乐"
                            },
                            {
                                "value": 3,
                                "label": "取材网络"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时任务",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "AiQiYiArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    }
                ]
            }
        ]
    },
    "BaiJiaHao": {
        "platformCode": "BaiJiaHao",
        "platformTitle": "BaiJiaHao",
        "forms": [
            {
                "formName": "BaiJiaHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "描述字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "声明字段，百家号申明 - 0:不声明 1:内容由AI生成",
                        "valueRange": "0=不声明, 1=内容由AI生成",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不声明"
                            },
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段，选填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段，选填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "activity",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "活动",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "BaiJiaHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "category",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "内容声明 - 0:不声明 1:内容由AI生成",
                        "valueRange": "0=不声明, 1=内容由AI生成",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不声明"
                            },
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "activity",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "征文活动数据，来源于获取活动接口",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "BaiJiaHaoDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "cover",
                        "rawType": "OldCover",
                        "valueType": "object",
                        "required": true,
                        "description": "封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "创作声明 - 0:不声明 1:内容由AI生成",
                        "valueRange": "0=不声明, 1=内容由AI生成",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不声明"
                            },
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "BiLiBiLi": {
        "platformCode": "BiLiBiLi",
        "platformTitle": "BiLiBiLi",
        "forms": [
            {
                "formName": "BilibiliVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "描述字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "分类字段，必填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "'创作者申明 - 0:不申明 1:该视频使用人工智能合成技术 2:视频内含有危险行为",
                        "valueRange": "0=不申明, 1=该视频使用人工智能合成技术, 2=视频内含有危险行为",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不申明"
                            },
                            {
                                "value": 1,
                                "label": "该视频使用人工智能合成技术"
                            },
                            {
                                "value": 2,
                                "label": "视频内含有危险行为"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "类型字段1:自制 2:转载",
                        "valueRange": "1=自制, 2=转载",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "自制"
                            },
                            {
                                "value": 2,
                                "label": "转载"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段，选填",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "contentSourceUrl",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "'原文url链接",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "BiLiBiLiArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "原创类型1:非原创或2:原创",
                        "valueRange": "1=非原创或, 2=原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "非原创或"
                            },
                            {
                                "value": 2,
                                "label": "原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "category",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "CSDN": {
        "platformCode": "CSDN",
        "platformTitle": "CSDN",
        "forms": [
            {
                "formName": "CSDNArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "desc",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "type",
                        "rawType": "1",
                        "valueType": "number",
                        "required": true,
                        "description": "'创作类型",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1"
                    },
                    {
                        "name": "contentSourceUrl",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "原文链接，当创作类型为转载时必须填写",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'0:无声明 - 1:不分内容由AI辅助生成 2:内容来源网络",
                        "valueRange": "0=无声明 , 1=不分内容由AI辅助生成, 2=内容来源网络",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "无声明 "
                            },
                            {
                                "value": 1,
                                "label": "不分内容由AI辅助生成"
                            },
                            {
                                "value": 2,
                                "label": "内容来源网络"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "Chejiahao": {
        "platformCode": "Chejiahao",
        "platformTitle": "Chejiahao",
        "forms": [
            {
                "formName": "ChejiahaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "type",
                        "rawType": "1",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 1:原创 3:首发 13:原创首发",
                        "valueRange": "1=原创, 3=首发, 13=原创首发",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 3,
                                "label": "首发"
                            },
                            {
                                "value": 13,
                                "label": "原创首发"
                            }
                        ],
                        "example": "1"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "ChejiahaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "verticalCovers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章竖版封面图",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "type",
                        "rawType": "1",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 1:原创 3:首发 13:原创首发",
                        "valueRange": "1=原创, 3=首发, 13=原创首发",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 3,
                                "label": "首发"
                            },
                            {
                                "value": 13,
                                "label": "原创首发"
                            }
                        ],
                        "example": "1"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "DaYuHao": {
        "platformCode": "DaYuHao",
        "platformTitle": "DaYuHao",
        "forms": [
            {
                "formName": "DaYuHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "type",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 1:原创 0:非原创",
                        "valueRange": "1=原创, 0=非原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 0,
                                "label": "非原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "DaYuHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "verticalCovers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章竖版封面图",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "DeWu": {
        "platformCode": "DeWu",
        "platformTitle": "DeWu",
        "forms": [
            {
                "formName": "DeWuVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "'创作者申明 - 0:不添加自主声明 1:内容由AI生成 2:内容不含营销推广属性 3:内容涉及专业运动 4:剧情演绎",
                        "valueRange": "0=不添加自主声明, 1=内容由AI生成, 2=内容不含营销推广属性, 3=内容涉及专业运动, 4=剧情演绎",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不添加自主声明"
                            },
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "内容不含营销推广属性"
                            },
                            {
                                "value": 3,
                                "label": "内容涉及专业运动"
                            },
                            {
                                "value": 4,
                                "label": "剧情演绎"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "DouBan": {
        "platformCode": "DouBan",
        "platformTitle": "DouBan",
        "forms": [
            {
                "formName": "DouBanArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "type",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 0:不申明 1:申明原创",
                        "valueRange": "0=不申明, 1=申明原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不申明"
                            },
                            {
                                "value": 1,
                                "label": "申明原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    }
                ]
            }
        ]
    },
    "DouYin": {
        "platformCode": "DouYin",
        "platformTitle": "DouYin",
        "forms": [
            {
                "formName": "DouYinVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "抖音视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "抖音视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "horizontalCover",
                        "rawType": "OldCover",
                        "valueType": "object",
                        "required": true,
                        "description": "抖音视频横板封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"key\":\"oss-key\",\"width\":1280,\"height\":720,\"size\":12345}"
                    },
                    {
                        "name": "statement",
                        "rawType": "StatementType",
                        "valueType": "number",
                        "required": false,
                        "description": "抖音视频声明 3:内容由AI生成 4:可能引人不适 5:虚构演绎，仅供娱乐 6:危险行为，请勿模仿",
                        "valueRange": "3=内容由AI生成, 4=可能引人不适, 5=虚构演绎，仅供娱乐, 6=危险行为，请勿模仿",
                        "enumValues": [
                            {
                                "value": 3,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 4,
                                "label": "可能引人不适"
                            },
                            {
                                "value": 5,
                                "label": "虚构演绎，仅供娱乐"
                            },
                            {
                                "value": 6,
                                "label": "危险行为，请勿模仿"
                            }
                        ],
                        "example": "3"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "抖音视频位置",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "抖音视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "shoppingCart",
                        "rawType": "ShoppingCartDTO[]",
                        "valueType": "array",
                        "required": false,
                        "description": "购物车列表",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "groupShopping",
                        "rawType": "GroupShoppingDTO",
                        "valueType": "object",
                        "required": false,
                        "description": "团购信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "sub_collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集选集",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "sync_apps",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "同时发布到的应用",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "hot_event",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "热点事件",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "challenge",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "挑战",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "allow_save",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'保存权限",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "0"
                    },
                    {
                        "name": "mini_app",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "挂载小程序 购物车和小程序互斥",
                        "valueRange": "存在互斥约束",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "music",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "音乐",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "cooperation_info",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "共创信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "game",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "游戏",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "film",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "影视演绎",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "DouYinDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "抖音标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "抖音地址/带货地址，来源于获取地址接口列表选项可选发布位置地址 / 带货地址（注意权限）-来源于地址搜索接口选项和用户输入地理位置、购物车、团购、小程序等互斥",
                        "valueRange": "存在互斥约束",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "musice",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "图文发布的音乐 - 来自音乐搜索接口列表选项",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "抖音定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "sub_collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集选集",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "DouyinArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "正文",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "headImage",
                        "rawType": "OldCover",
                        "valueType": "object",
                        "required": false,
                        "description": "文章头图",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "music",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "音乐",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "topics",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "话题列表，最多5个",
                        "valueRange": "最多 5 个",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "visibleType",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "可见性 0:公开 1:私密 3:好友可见",
                        "valueRange": "0=公开, 1=私密, 3=好友可见",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "公开"
                            },
                            {
                                "value": 1,
                                "label": "私密"
                            },
                            {
                                "value": 3,
                                "label": "好友可见"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "DuoDuoShiPin": {
        "platformCode": "DuoDuoShiPin",
        "platformTitle": "DuoDuoShiPin",
        "forms": [
            {
                "formName": "DuoDuoShiPinVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "多多视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "多多视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "shopping_cart",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "多多视频关联商品",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            }
        ]
    },
    "FengWang": {
        "platformCode": "FengWang",
        "platformTitle": "FengWang",
        "forms": [
            {
                "formName": "FengWangVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "JianShu": {
        "platformCode": "JianShu",
        "platformTitle": "JianShu",
        "forms": [
            {
                "formName": "JianShuArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    }
                ]
            }
        ]
    },
    "KuaiChuanHao": {
        "platformCode": "KuaiChuanHao",
        "platformTitle": "KuaiChuanHao",
        "forms": [
            {
                "formName": "KuaiChuanHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "type",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "创作类型类型 - 0:不申明 1:申明原创",
                        "valueRange": "0=不申明, 1=申明原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不申明"
                            },
                            {
                                "value": 1,
                                "label": "申明原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "KuaiShou": {
        "platformCode": "KuaiShou",
        "platformTitle": "KuaiShou",
        "forms": [
            {
                "formName": "KuaiShouVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "快手标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "快手描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'快手视频声明 内容为ai生成 -1:内容为ai生成 2:演绎情节",
                        "valueRange": "1=内容为ai生成, 2=演绎情节",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "内容为ai生成"
                            },
                            {
                                "value": 2,
                                "label": "演绎情节"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "快手视频位置",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "visibleType",
                        "rawType": "0",
                        "valueType": "number",
                        "required": false,
                        "description": "可见类型0:公开1:私密3:好友可见",
                        "valueRange": "0=公开, 1=私密, 3=好友可见",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "公开"
                            },
                            {
                                "value": 1,
                                "label": "私密"
                            },
                            {
                                "value": 3,
                                "label": "好友可见"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "快手视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "shopping_cart",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "关联商品",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "mini_app",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "挂载小程序 购物车和小程序互斥",
                        "valueRange": "存在互斥约束",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "nearby_show",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "'是否同城展示",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "allow_same_frame",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "'是否允许同框",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "allow_download",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "'是否允许下载",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "KuaiShouDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "快手位置",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "music",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "快手音乐",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "快手定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "Category",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "visibleType",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "可见类型0:公开1:私密3:好友可见",
                        "valueRange": "0=公开, 1=私密, 3=好友可见",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "公开"
                            },
                            {
                                "value": 1,
                                "label": "私密"
                            },
                            {
                                "value": 3,
                                "label": "好友可见"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "MeiPai": {
        "platformCode": "MeiPai",
        "platformTitle": "MeiPai",
        "forms": [
            {
                "formName": "MeiPaiVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": false,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "MeiYou": {
        "platformCode": "MeiYou",
        "platformTitle": "MeiYou",
        "forms": [
            {
                "formName": "MeiYouVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "PiPiXia": {
        "platformCode": "PiPiXia",
        "platformTitle": "PiPiXia",
        "forms": [
            {
                "formName": "PiPiXiaVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    }
                ]
            }
        ]
    },
    "QiEHao": {
        "platformCode": "QiEHao",
        "platformTitle": "QiEHao",
        "forms": [
            {
                "formName": "QiEHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频创作申明 0:暂不申明 1:该内容由AI生成 2:个人观点，仅供参考 3:剧情演绎，仅供娱乐 4:取材网络，谨慎甄别 5:旧闻",
                        "valueRange": "0=暂不申明, 1=该内容由AI生成, 2=个人观点，仅供参考, 3=剧情演绎，仅供娱乐, 4=取材网络，谨慎甄别, 5=旧闻",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "暂不申明"
                            },
                            {
                                "value": 1,
                                "label": "该内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "个人观点，仅供参考"
                            },
                            {
                                "value": 3,
                                "label": "剧情演绎，仅供娱乐"
                            },
                            {
                                "value": 4,
                                "label": "取材网络，谨慎甄别"
                            },
                            {
                                "value": 5,
                                "label": "旧闻"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "QiEHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "创作申明 0:暂不申明 1:该内容由AI生成 2:个人观点，仅供参考 3:剧情演绎，仅供娱乐 4:取材网络，谨慎甄别 5:旧闻",
                        "valueRange": "0=暂不申明, 1=该内容由AI生成, 2=个人观点，仅供参考, 3=剧情演绎，仅供娱乐, 4=取材网络，谨慎甄别, 5=旧闻",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "暂不申明"
                            },
                            {
                                "value": 1,
                                "label": "该内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "个人观点，仅供参考"
                            },
                            {
                                "value": 3,
                                "label": "剧情演绎，仅供娱乐"
                            },
                            {
                                "value": 4,
                                "label": "取材网络，谨慎甄别"
                            },
                            {
                                "value": 5,
                                "label": "旧闻"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "ShiPinHao": {
        "platformCode": "ShiPinHao",
        "platformTitle": "ShiPinHao",
        "forms": [
            {
                "formName": "ShiPingHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "short_title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频短标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "视频位置",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "视频原创类型1:非原创或2:原创",
                        "valueRange": "1=非原创或, 2=原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "非原创或"
                            },
                            {
                                "value": 2,
                                "label": "原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "shoppingCart",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "关联商品",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "horizontalCover",
                        "rawType": "OldCover",
                        "valueType": "object",
                        "required": false,
                        "description": "视频横版封面封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"key\":\"oss-key\",\"width\":1280,\"height\":720,\"size\":12345}"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "activity",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "活动",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "createType",
                        "rawType": "1",
                        "valueType": "number",
                        "required": true,
                        "description": "创建类型 1:草稿 2:直接发布",
                        "valueRange": "1=草稿, 2=直接发布",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "草稿"
                            },
                            {
                                "value": 2,
                                "label": "直接发布"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "pubType",
                        "rawType": "0",
                        "valueType": "number",
                        "required": false,
                        "description": "发布类型 0:草稿 1:直接发布",
                        "valueRange": "0=草稿, 1=直接发布",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "草稿"
                            },
                            {
                                "value": 1,
                                "label": "直接发布"
                            }
                        ],
                        "example": "1"
                    }
                ]
            },
            {
                "formName": "ShiPingHaoDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "music",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "音乐",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "pubType",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "发布类型 0:草稿 1:直接发布",
                        "valueRange": "0=草稿, 1=直接发布",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "草稿"
                            },
                            {
                                "value": 1,
                                "label": "直接发布"
                            }
                        ],
                        "example": "1"
                    }
                ]
            }
        ]
    },
    "SouHuHao": {
        "platformCode": "SouHuHao",
        "platformTitle": "SouHuHao",
        "forms": [
            {
                "formName": "SouHuHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "视频原创类型信息来源 - 0:无特别声明 1引用申明2自行拍摄3包含AI创作内容4包含虚构创作",
                        "valueRange": "0=无特别声明 1引用申明2自行拍摄3包含AI创作内容4包含虚构创作",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "无特别声明 1引用申明2自行拍摄3包含AI创作内容4包含虚构创作"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "SouHuHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "desc",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "SouHuShiPin": {
        "platformCode": "SouHuShiPin",
        "platformTitle": "SouHuShiPin",
        "forms": [
            {
                "formName": "SouHuShiPinVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "搜狐视频申明 - 0:无需申明 3:AI生成 4:虚构演绎 5:AI数字人生成",
                        "valueRange": "0=无需申明, 3=AI生成, 4=虚构演绎, 5=AI数字人生成",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "无需申明"
                            },
                            {
                                "value": 3,
                                "label": "AI生成"
                            },
                            {
                                "value": 4,
                                "label": "虚构演绎"
                            },
                            {
                                "value": 5,
                                "label": "AI数字人生成"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "TengXunShiPin": {
        "platformCode": "TengXunShiPin",
        "platformTitle": "TengXunShiPin",
        "forms": [
            {
                "formName": "TengXunShiPinVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": false,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "'视频原创类型腾讯视频申明 - 1:内容由AI生成2:剧情演绎",
                        "valueRange": "1=内容由AI生成, 2=剧情演绎",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "剧情演绎"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "TengXunWeiShi": {
        "platformCode": "TengXunWeiShi",
        "platformTitle": "TengXunWeiShi",
        "forms": [
            {
                "formName": "TengXunWeiShiVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "TouTiaoHao": {
        "platformCode": "TouTiaoHao",
        "platformTitle": "TouTiaoHao",
        "forms": [
            {
                "formName": "TouTiaoHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'视频原创类型1:自行拍摄2:取自站外3:AI生成6:虚构演绎",
                        "valueRange": "1=自行拍摄, 2=取自站外, 3=AI生成, 6=虚构演绎",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "自行拍摄"
                            },
                            {
                                "value": 2,
                                "label": "取自站外"
                            },
                            {
                                "value": 3,
                                "label": "AI生成"
                            },
                            {
                                "value": 6,
                                "label": "虚构演绎"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "TouTiaoHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "isFirst",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "头条首发 - 是否在头条首发，可选字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "advertisement",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "广告投放赚取收益",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "0"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'创作类型1:自行拍摄2:取自站外3:AI生成6:虚构演绎",
                        "valueRange": "1=自行拍摄, 2=取自站外, 3=AI生成, 6=虚构演绎",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "自行拍摄"
                            },
                            {
                                "value": 2,
                                "label": "取自站外"
                            },
                            {
                                "value": 3,
                                "label": "AI生成"
                            },
                            {
                                "value": 6,
                                "label": "虚构演绎"
                            }
                        ],
                        "example": "0"
                    }
                ]
            },
            {
                "formName": "TouTiaoHaoDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'创作类型 1:自行拍摄 2:取自站外 3:AI生成 6:虚构演绎",
                        "valueRange": "1=自行拍摄, 2=取自站外, 3=AI生成, 6=虚构演绎",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "自行拍摄"
                            },
                            {
                                "value": 2,
                                "label": "取自站外"
                            },
                            {
                                "value": 3,
                                "label": "AI生成"
                            },
                            {
                                "value": 6,
                                "label": "虚构演绎"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "pubType",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "发布类型 0:草稿 1:直接发布",
                        "valueRange": "0=草稿, 1=直接发布",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "草稿"
                            },
                            {
                                "value": 1,
                                "label": "直接发布"
                            }
                        ],
                        "example": "1"
                    }
                ]
            }
        ]
    },
    "WangYiHao": {
        "platformCode": "WangYiHao",
        "platformTitle": "WangYiHao",
        "forms": [
            {
                "formName": "WangYiHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频声明",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "原创 - 默认不勾选0:不勾选1:勾选原创",
                        "valueRange": "0=不勾选, 1=勾选原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不勾选"
                            },
                            {
                                "value": 1,
                                "label": "勾选原创"
                            }
                        ],
                        "example": "0"
                    }
                ]
            },
            {
                "formName": "WangYiHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'创作申明 - 1:内容由AI生成2:个人原创",
                        "valueRange": "1=内容由AI生成, 2=个人原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 2,
                                "label": "个人原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "原创 - 默认不勾选0:不勾选1:勾选原创",
                        "valueRange": "0=不勾选, 1=勾选原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不勾选"
                            },
                            {
                                "value": 1,
                                "label": "勾选原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "WeiXinGongZhongHao": {
        "platformCode": "WeiXinGongZhongHao",
        "platformTitle": "WeiXinGongZhongHao",
        "forms": [
            {
                "formName": "WxGongZhongHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "notifySubscribers",
                        "rawType": "0",
                        "valueType": "number",
                        "required": true,
                        "description": "是否群发 - 0:不群发 1:群发",
                        "valueRange": "0=不群发, 1=群发",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不群发"
                            },
                            {
                                "value": 1,
                                "label": "群发"
                            }
                        ],
                        "example": "1"
                    },
                    {
                        "name": "sex",
                        "rawType": "0",
                        "valueType": "number",
                        "required": false,
                        "description": "'群发性别",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "0"
                    },
                    {
                        "name": "country",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "群发地区-国家名称，默认全部",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "province",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "群发地区-省份名称",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "city",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "群发地区-城市名称",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例值\""
                    },
                    {
                        "name": "contentList",
                        "rawType": "WxGongZhongHaoContentFrom[]",
                        "valueType": "array",
                        "required": false,
                        "description": "消息中的文章列表",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    }
                ]
            }
        ]
    },
    "WiFiWanNeng": {
        "platformCode": "WiFiWanNeng",
        "platformTitle": "WiFiWanNeng",
        "forms": [
            {
                "formName": "WifiWanNengArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "category",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "文章分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    }
                ]
            }
        ]
    },
    "XiaoHongShu": {
        "platformCode": "XiaoHongShu",
        "platformTitle": "XiaoHongShu",
        "forms": [
            {
                "formName": "XiaoHongShuVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "'内容类型申明 - 1:虚构演绎",
                        "valueRange": "1=虚构演绎",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "虚构演绎"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "类型字段申明创作类型 1:原创 0:不申明",
                        "valueRange": "1=原创, 0=不申明",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 0,
                                "label": "不申明"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "group",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "群聊信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "bind_live_info",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "直播预告信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "shopping_cart",
                        "rawType": "object[]",
                        "valueType": "array",
                        "required": false,
                        "description": "商品信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "visibleType",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "可见类型0：公开1：私密3：好友可见",
                        "valueRange": "0=公开, 1=私密, 3=好友可见",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "公开"
                            },
                            {
                                "value": 1,
                                "label": "私密"
                            },
                            {
                                "value": 3,
                                "label": "好友可见"
                            }
                        ],
                        "example": "0"
                    }
                ]
            },
            {
                "formName": "XiaoHongShuDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": false,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "music",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "音乐",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"music-1\",\"name\":\"背景音乐\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集信息",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "visibleType",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "可见类型0：公开1：私密3：好友可见",
                        "valueRange": "0=公开, 1=私密, 3=好友可见",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "公开"
                            },
                            {
                                "value": 1,
                                "label": "私密"
                            },
                            {
                                "value": 3,
                                "label": "好友可见"
                            }
                        ],
                        "example": "0"
                    }
                ]
            }
        ]
    },
    "XiaoHongShuShop": {
        "platformCode": "XiaoHongShuShop",
        "platformTitle": "XiaoHongShuShop",
        "forms": [
            {
                "formName": "XiaoHongShuShopVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "小红书视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "小红书视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "小红书视频位置",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "小红书视频定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "shoppingCart",
                        "rawType": "object[]",
                        "valueType": "array",
                        "required": false,
                        "description": "关联商品",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    }
                ]
            }
        ]
    },
    "XinLangWeiBo": {
        "platformCode": "XinLangWeiBo",
        "platformTitle": "XinLangWeiBo",
        "forms": [
            {
                "formName": "XinLangWeiBoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "类型字段 1原创 3二次创作内容 2转载内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "0"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "collection",
                        "rawType": "object",
                        "valueType": "object",
                        "required": false,
                        "description": "合集字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            },
            {
                "formName": "XinLangWeiBoDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "location",
                        "rawType": "PlatformDataItem",
                        "valueType": "object",
                        "required": false,
                        "description": "位置字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "{\"id\":\"loc-1\",\"name\":\"北京\"}"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "XinLangWeiBoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "XueQiuHao": {
        "platformCode": "XueQiuHao",
        "platformTitle": "XueQiuHao",
        "forms": [
            {
                "formName": "XueQiuHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "YiCheHao": {
        "platformCode": "YiCheHao",
        "platformTitle": "YiCheHao",
        "forms": [
            {
                "formName": "YiCheHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "YiCheHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "verticalCovers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章竖版封面图",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "创作申明 - 0:不申明 1:个人观点，仅供参考 2:内容来源于网络 3:AI生成 4:引用站内",
                        "valueRange": "0=不申明, 1=个人观点，仅供参考, 2=内容来源于网络, 3=AI生成, 4=引用站内",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不申明"
                            },
                            {
                                "value": 1,
                                "label": "个人观点，仅供参考"
                            },
                            {
                                "value": 2,
                                "label": "内容来源于网络"
                            },
                            {
                                "value": 3,
                                "label": "AI生成"
                            },
                            {
                                "value": 4,
                                "label": "引用站内"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "allowForward",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "允许转发",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    },
                    {
                        "name": "allowAbstract",
                        "rawType": "boolean",
                        "valueType": "boolean",
                        "required": false,
                        "description": "允许生成摘要",
                        "valueRange": "",
                        "enumValues": [],
                        "example": ""
                    }
                ]
            }
        ]
    },
    "YiDianHao": {
        "platformCode": "YiDianHao",
        "platformTitle": "YiDianHao",
        "forms": [
            {
                "formName": "YiDianHaoVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "tags",
                        "rawType": "string[]",
                        "valueType": "array",
                        "required": true,
                        "description": "标签",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[\"标签1\", \"标签2\"]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "声明 3:内容取材网络4:内容由AI生成5:虚构情节内容",
                        "valueRange": "3=内容取材网络, 4=内容由AI生成, 5=虚构情节内容",
                        "enumValues": [
                            {
                                "value": 3,
                                "label": "内容取材网络"
                            },
                            {
                                "value": 4,
                                "label": "内容由AI生成"
                            },
                            {
                                "value": 5,
                                "label": "虚构情节内容"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": true,
                        "description": "视频原创类型0:非原创或1:原创",
                        "valueRange": "0=非原创或, 1=原创",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "非原创或"
                            },
                            {
                                "value": 1,
                                "label": "原创"
                            }
                        ],
                        "example": "0"
                    }
                ]
            },
            {
                "formName": "YiDianHaoArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            }
        ]
    },
    "ZhiHu": {
        "platformCode": "ZhiHu",
        "platformTitle": "ZhiHu",
        "forms": [
            {
                "formName": "ZhiHuVideoForm",
                "formLabel": "视频",
                "publishType": "video",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "description",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "视频描述",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例描述\""
                    },
                    {
                        "name": "topics",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "话题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "category",
                        "rawType": "CascadingPlatformDataItem[]",
                        "valueType": "array",
                        "required": true,
                        "description": "视频分类",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"yixiaoerId\":\"1\",\"yixiaoerName\":\"分类\"}]"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频创作申明 0:不声明 2:图片/视频由AI生成",
                        "valueRange": "0=不声明, 2=图片/视频由AI生成",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "不声明"
                            },
                            {
                                "value": 2,
                                "label": "图片/视频由AI生成"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "type",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "视频类型 1:原创 2:非原创",
                        "valueRange": "1=原创, 2=非原创",
                        "enumValues": [
                            {
                                "value": 1,
                                "label": "原创"
                            },
                            {
                                "value": 2,
                                "label": "非原创"
                            }
                        ],
                        "example": "0"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布字段",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    }
                ]
            },
            {
                "formName": "ZhiHuArticleForm",
                "formLabel": "文章",
                "publishType": "article",
                "fields": [
                    {
                        "name": "covers",
                        "rawType": "OldCover[]",
                        "valueType": "array",
                        "required": true,
                        "description": "文章封面",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    },
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "content",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "文章内容",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"<p>正文内容</p>\""
                    },
                    {
                        "name": "topics",
                        "rawType": "Category[]",
                        "valueType": "array",
                        "required": false,
                        "description": "话题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[]"
                    },
                    {
                        "name": "scheduledTime",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "定时发布时间",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "1704067200000"
                    },
                    {
                        "name": "declaration",
                        "rawType": "number",
                        "valueType": "number",
                        "required": false,
                        "description": "创作申明 0:无申明 1:包含剧透 2:包含医疗建议 3:虚构创作 4:包含理财内容 5:包含AI辅助创作",
                        "valueRange": "0=无申明, 1=包含剧透, 2=包含医疗建议, 3=虚构创作, 4=包含理财内容, 5=包含AI辅助创作",
                        "enumValues": [
                            {
                                "value": 0,
                                "label": "无申明"
                            },
                            {
                                "value": 1,
                                "label": "包含剧透"
                            },
                            {
                                "value": 2,
                                "label": "包含医疗建议"
                            },
                            {
                                "value": 3,
                                "label": "虚构创作"
                            },
                            {
                                "value": 4,
                                "label": "包含理财内容"
                            },
                            {
                                "value": 5,
                                "label": "包含AI辅助创作"
                            }
                        ],
                        "example": "0"
                    }
                ]
            },
            {
                "formName": "ZhiHuDynamicForm",
                "formLabel": "图文/动态",
                "publishType": "imageText",
                "fields": [
                    {
                        "name": "title",
                        "rawType": "string",
                        "valueType": "string",
                        "required": true,
                        "description": "标题",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "\"示例标题\""
                    },
                    {
                        "name": "images",
                        "rawType": "OldImage[]",
                        "valueType": "array",
                        "required": true,
                        "description": "图片",
                        "valueRange": "",
                        "enumValues": [],
                        "example": "[{\"key\":\"oss-key\",\"width\":1080,\"height\":1920,\"size\":12345}]"
                    }
                ]
            }
        ]
    }
};
