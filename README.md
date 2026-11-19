# GAMES 课程精讲学习手册（网站版）

> 基于 GAMES101 / GAMES104 / GAMES202 / GAMES105 四门课程课件整理的逐讲精讲中文手册。
> 在线版：GitHub Pages（见仓库 About / 下方链接）

## 打开方式

- **在线**：访问 GitHub Pages 地址（仓库 Settings → Pages 中的站点链接）。
- **本地**：直接双击 `index.html`，或在本目录起一个静态服务器：

```bash
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 内容

- **69 讲**逐讲精讲：101（22）· 104（20）· 202（14）· 105（13）
- 每讲包含：核心结论速记 / 精讲正文（公式 KaTeX）/ 课件原图 / 常见坑 / UE·Unity 对照 / 术语双语表 / 课后练习与折叠答案 / 伪代码
- 全站可搜索（知识点、术语、练习），支持深色/浅色主题与打印
- 课件图 802 张、术语 673 条、练习 341 道

## 目录结构

```
index.html                 首页（课程总览 + 学习路径）
GAMES101/ GAMES104/ GAMES202/ GAMES105/   课程总览与各讲章节
assets/                    设计系统（tokens/components/site）+ KaTeX + 课件图
DESIGN.md                  设计说明（令牌、组件、扩展点）
```

## 说明

- 手册基于 GAMES 课程公开课件的公开内容整理、翻译与二次写作，仅供个人学习使用；课件版权归原作者与课程组所有。
- 公式与图示以课件原页为准；正文中的讲法、类比、工程对照是为帮助理解而写的二次组织。
- 本仓库只包含网站（HTML/CSS/JS/WebP 图片），不包含 PDF 与原始 PNG。

## 设计

网站使用本地 **frontend-design** 设计系统（Apple/iOS 风格）：浅灰底 + 纸面卡片 + 玻璃胶囊 + 双色光晕，亮暗双主题。详见 [DESIGN.md](DESIGN.md)。
