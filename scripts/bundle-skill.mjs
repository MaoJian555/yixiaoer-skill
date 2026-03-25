/**
 * 打包脚本 - 将所有模块打包成单个文件
 * 
 * 使用 esbuild 将 src/index.ts 及其所有依赖打包成 dist/bundle/index.js
 * npm 依赖保留为外部依赖，不打入包内
 * 
 * 这样 AI 只能通过入口执行，无法直接 import 内部模块
 */

import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..');
const distDir = path.join(srcDir, 'dist');
const bundleDir = path.join(distDir, 'bundle');

// 确保目录存在
if (!fs.existsSync(bundleDir)) {
  fs.mkdirSync(bundleDir, { recursive: true });
}

// 需要 external 的 npm 包
const externalPackages = [
  'axios',
  'form-data', 
  'combined-stream',
  'delayed-stream',
  'mime-types',
  'mime-db',
  'asynckit',
  'follow-redirects',
  'combined-stream',
  'queue-microtask',
  'process-nextick-args',
  'string_decoder',
  'util-deprecate',
  'stream-browserify',
  'pako',
  'decompress',
  'is-stream',
  'webpack',
  'fluent-ffmpeg',
  'ffmpeg-static',
  '@sinclair/typebox',
];

// Node.js 内置模块
const nodeBuiltins = [
  'fs', 'path', 'os', 'util', 'stream', 'events', 'buffer',
  'crypto', 'http', 'https', 'url', 'querystring', 'zlib',
  'net', 'tls', 'child_process', 'cluster', 'module',
  'domain', 'constants', 'timers', 'console', 'tty',
  'dns', 'dgram', 'fs/promises', 'stream/promises', 'process',
  'sys', 'v8', 'module', 'esm', 'wasi', 'worker_threads',
  'diagnostics_channel', 'trace_events', 'perf_hooks', 'async_hooks',
  'natives', 'repl', 'readline', 'pm', 'install', 'ace', 'globals'
];

// 组合所有需要 external 的模块
const allExternals = [
  ...nodeBuiltins,
  ...externalPackages,
  ...nodeBuiltins.map(m => `node:${m}`) // 带 node: 前缀的
];

const buildOptions = {
  entryPoints: [path.join(srcDir, 'src', 'index.ts')],
  bundle: true,
  outfile: path.join(bundleDir, 'index.js'),
  format: 'esm',                    // ESM 格式
  platform: 'node',
  target: 'node18',
  sourcemap: false,
  minify: false,
  external: allExternals,
  banner: {
    js: `/**
 * 蚁小二多平台发布 Skill - 打包版本 (v1.1.0)
 * 
 * ⚠️ 此文件已打包，AI 只能通过 registerTool() 注册的工具执行
 * ⚠️ 禁止直接 import 此文件内部的任何模块
 * 
 * 依赖说明:
 * - npm 包依赖保持为外部引用，需要与 node_modules 一起使用
 * - 打包后的文件导入项目后，需要安装以下依赖:
 *   axios, fluent-ffmpeg, ffmpeg-static, @sinclair/typebox
 */
`
  },
  logLevel: 'info',
  logOverride: {
    'unsupported-platform': 'silent',
    'ignored-binary-only': 'silent',
  }
};

console.log('📦 开始打包 skill...');
console.log('平台: Node.js');
console.log('格式: ESM (外部依赖)');
console.log(`External 模块数: ${allExternals.length}`);

esbuild.build(buildOptions)
  .then(result => {
    console.log('\n✅ 打包完成!');
    console.log('输出文件:', path.join(bundleDir, 'index.js'));
    
    // 验证打包结果
    const outputSize = fs.statSync(path.join(bundleDir, 'index.js')).size;
    console.log('文件大小:', (outputSize / 1024).toFixed(2), 'KB');
    
    console.log('\n📝 使用说明:');
    console.log('1. 打包文件需要与 node_modules 一起使用');
    console.log('2. 确保安装了必要的依赖: npm install axios fluent-ffmpeg ffmpeg-static @sinclair/typebox');
    console.log('3. 在 OpenClaw 中使用此 skill 时，需要配置好依赖路径');
  })
  .catch(error => {
    console.error('❌ 打包失败:', error);
    process.exit(1);
  });
