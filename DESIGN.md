# 设计说明（DESIGN.md）

本手册网站使用本地 **frontend-design** 技能（`references/tokens.css` + `references/components.css`）。
设计语言：Apple / iOS 风格的浅灰底 + 纸面卡片 + 玻璃胶囊 + 双色光晕；亮暗双主题；系统字体；无第三方 UI 库。

## 1. 设计令牌

| 类别 | 取值 / 说明 |
|---|---|
| 页面底色 | `--bg: #f5f5f7`（亮）/ `#161617`（暗），正文放在白色纸面 `.page` 上 |
| 文字 | 三级：`--ink` / `--ink-2` / `--ink-3`（说明文字 12–13px，AA ≥4.5:1） |
| 品牌主色 | `--accent: #0066cc`（亮）/ `#4db8e8`（暗），站点用于链接、焦点、主按钮 |
| 分区色 `--tone-*` | 四门课各一色：101 = tone-1 蓝；104 = tone-2 靛；202 = tone-3 绿；105 = tone-4 暖橙 |
| --- | --- |
| 圆角 | 四档：`--r-s 8` / `--r-m 12` / `--r-l 16` / `--r-xl 22`，胶囊 `999px` |
| 阴影 | 两级双层软影：`--shadow-1` / `--shadow-2`（另有 `--shadow-soft` 用于胶囊与图版） |
| 动效 | 统一 `--press-ease: cubic-bezier(.25,.1,.25,1)`；hover 抬升 1–2px、active `scale(.97)`、140–180ms |
| 玻璃 | `blur(20px) saturate(180%)`，只用于顶栏胶囊 / 侧栏 / 覆盖层，正文纸面不用玻璃 |
| 字体 | 系统字体栈（`-apple-system` / `Segoe UI` / `PingFang SC` / `Microsoft YaHei`），零网络字体 |

## 2. 页面范式

- **首页（Hub）**：全屏 Hero（`100svh` 内自适应）+ 统计条 + 2×2 课程卡 + 推荐学习路径 + 使用说明。骨架见 `handbook/index.html`。
- **课程总览（Hub 变体）**：课程抬头（`GAMESxxx · COURSE`）+ 三枚统计 chip + 讲次卡片网格。见 `handbook/GAMES101/index.html`。
- **章节页（Article）**：玻璃胶囊顶栏 + 288px 侧栏（本讲目录 + 全部讲次）+ `.page` 纸面正文。正文由 `work/chapters/*.json` 生成。
- **打印**：`@media print` 隐藏顶栏/侧栏/搜索/灯箱/分页器，纸面去阴影，`.keybox/.callout/.quiz/.fig-wrap/.tbl-scroll` 避免跨页截断；打印版 PDF 由 `print/` 单独构建（不进入网站仓库）。

## 3. 组件清单

| 组件 | 位置 / 类名 | 说明 |
|---|---|---|
| 玻璃胶囊顶栏 | `.topbar` + `.nav-pill` | 品牌、面包屑、课程分段胶囊、搜索/主题/打印/菜单，各自独立胶囊 |
| 侧栏 | `.sidebar.material` | 玻璃一层；「本讲目录」（scrollspy）+「全部讲次」；移动端抽屉 + scrim |
| 纸面正文 | `.page > .article` | 圆角 22px、细边框、软阴影；版心 `--measure` 880px |
| 章节头 | `.ch-head` / `.ch-course` / `.ch-title` / `.ch-meta` | 课程徽标、大标题、导语、统计 chip |
| 目标 / 速记 | `.callout.key` / `.keybox` | 语义色条 + 编号列表 |
| 提示块 | `.callout.warn` / `.callout.tip` / `.callout.key` | 常见坑 / UE·Unity 落地 / 补充说明，形状区分语义（菱形/圆点/条） |
| 公式 | KaTeX（本地 `assets/katex/`） | 行内 `\(...\)`、独立 `\[...\]`；构建时内联渲染 |
| 课件图 | `.fig-wrap` + `.fig` + `.fig-cap` | WebP 课件原图（802 张），图注标注课件页码 |
| 表格 | `.tbl-scroll` + `.tbl` | 术语双语表 / 引擎对照表；窄屏横向滚动 |
| 练习 | `.quiz` + `<details>` | 折叠答案，保留「先自测再看答案」 |
| 分页 / 页脚 | `.pager` / `.page-foot` | 上一讲/下一讲胶囊、版权与返回入口 |
| 搜索 | `.search-overlay` + `.search-panel` | `/` 或 Ctrl/⌘K 打开，键盘 ↑↓/Enter/Esc；索引含小节、结论、术语、练习 |
| 灯箱 | `.lightbox` | 点击课件图放大，Esc/点击关闭 |
| 阅读进度 | `.reading-bar` | 顶部 3px 细条 |

## 4. 文件结构（网站部分）

```
handbook/
├─ index.html                 首页
├─ GAMES101/ GAMES104/ GAMES202/ GAMES105/   课程总览 + 各讲章节页
├─ assets/
│  ├─ tokens.css components.css site.css     设计系统 + 站点样式
│  ├─ app.js search-index.js                 交互与搜索索引
│  ├─ katex/                                 本地 KaTeX（离线可用）
│  └─ img/<课程>/<讲>/pXXXX.webp             课件原图
├─ README.md
└─ DESIGN.md                  本文件
```

构建：`python work/build_site.py`（读取 `work/chapters/*.json` 与 `work/lectures.json` 重新生成全站）。

## 5. 可扩展点

- **换品牌色**：只改 `tokens.css` 里的 `--accent` / `--tone-*` / `--aura-*`，不要改组件。
- **加课程**：在 `work/build_site.py` 的 `COURSES` 增加一项（code/prefix/name/tone/intro/stage），生成对应 `work/text`、`work/chapters` 后重跑构建。
- **调整章节模块顺序**：改 `render_chapter()`；内容来自 JSON，无需手改 HTML。
- **主题切换**：`html[data-theme]` + `localStorage.theme`；首帧脚本在 `<head>` 内联，避免暗色闪白。

## 6. 质量门记录

- 断链：0（构建后脚本检查全部相对链接）。
- 对比度：亮/暗主题均使用技能包令牌（`--ink-3` 12–13px ≥4.5:1）。
- 响应式：1020px 以下侧栏变抽屉；700px 以下顶栏精简、卡片单列；五档宽度无横向滚动（截图验证 1600 / 390）。
- 可访问性：焦点描边、`aria-label`、`aria-current`、`prefers-reduced-motion / reduced-transparency` 均已响应。
- 图片：课件图统一 WebP（q88，≤1400px），体积从 200MB 降至约 45MB。
- 无网络字体、无 CDN、无 UI 组件库；KaTeX 本地化。

## 7. 已知取舍

- 课件原图为白底幻灯片，`.fig` 在暗色主题下保留白色内底（`#fff`），这是有意的「照片纸」处理。
- 为控制仓库体积，网站仓库不包含 `pdf/`、`print/` 与原始 PNG；PDF 仍保留在本地工作区。
