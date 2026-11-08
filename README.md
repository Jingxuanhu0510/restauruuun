# Restauruuun
### 菜单会改变，你的选择也是。 / The menu changes. So do your choices.

[**进入互动餐厅 · Experience the restaurant →**](https://jingxuanhu0510.github.io/restauruuun/)

Restauruuun 是一件以高级餐厅点单界面为入口的互动网页作品。浏览、点单、查看分析，再开始下一轮：每一次选择都会参与塑造接下来出现的菜单。它邀请你思考：当系统越来越懂你的偏好，你还能注意到哪些选项正在消失吗？

Restauruuun is an interactive web artwork presented as a fine-dining ordering experience. Browse, order, review your choices, and return for another session. Each selection helps shape the next menu, asking: as a system learns your preferences, do you notice which alternatives disappear?

![Restauruuun 入口展示 / Welcome screen](docs/images/01-welcome.png)

> **关于展示图 / About the images**  
> 以下四张图片由项目作者提供，用于展示项目视觉与体验方向。它们与本仓库当前上线原型存在差异：Chef’s Special 分类、数量加减、纸质小票式报告、风味分析及 PNG 下载等截图细节，尚未在当前 HTML 中实现。实际功能以在线演示为准。  
> These four images were supplied by the project author to illustrate its visual and experiential direction. They differ from the currently deployed prototype: the Chef’s Special category, quantity controls, receipt-style report, flavor analysis, and PNG download shown in the images are not implemented in the current HTML. The live demo reflects the available functionality.

## 01 · 浏览与选择 / Browse & choose

当前原型从 **126 道菜品**开始，涵盖餐前小点、前菜、汤、主菜、甜品和饮品六类，另有全部菜单视图。点击 ORDER 将菜品加入托盘；系统会根据点单次数、偏好的分类及算法生成标记调整排序。

The prototype starts with **126 dishes** across six categories: amuse-bouche, appetizers, soups, mains, desserts, and beverages, plus an all-menu view. Select ORDER to add a dish to your tray. Ordering frequency, category preferences, and generated-item status influence the menu ranking.

![菜品卡片与分类导航 / Menu cards and category navigation](docs/images/02-menu.png)

## 02 · 组成你的托盘 / Build your tray

打开右上角的购物袋查看选择，并移除不想要的条目。同一道菜可以重复加入。当前版本会统计托盘中的真实菜品与算法菜品，选择完成后点击 **Start Analysis（开始分析）**。

Open the shopping bag in the upper-right corner to review your selections and remove individual entries. A dish can be added more than once. The current prototype counts real and algorithmic items in the tray; select **Start Analysis** when ready.

![托盘体验展示 / Tray experience](docs/images/03-tray.png)

## 03 · 看见选择的结果 / See what your choices produce

当前分析页使用环形图展示真实菜品与算法菜品的比例，并计算“现实完整度”。这是作品内部的互动指标，不是营养、健康或心理评估。

The current analysis screen visualizes the proportion of real and algorithmic dishes in a doughnut chart and calculates a “Reality Score.” This is an artistic interaction metric, not a nutritional, health, or psychological assessment.

**现实完整度 = 100 − 算法菜品占比（四舍五入为整数百分比）**  
**Reality Score = 100 − the rounded percentage of algorithmic items**

报告展示后，系统在约 10 秒后自动开始下一轮，也可以点击 **Next Session**。下一轮会根据刚才点过的分类，用算法菜品替换其中最多三道未在本轮点选、且累计点单较少的菜品。

After the report, a new session begins automatically after about 10 seconds, or immediately via **Next Session**. In each ordered category, the next session replaces up to three less-ordered dishes that were not selected in the last tray with algorithmic dishes.

![小票式报告视觉展示 / Receipt-style report concept](docs/images/04-report.png)

## 04 · 为什么菜单会“跑掉”？ / Why does the menu “run away”?

作品把推荐系统的反馈循环变成一次可操作的餐厅体验：选择影响排序，排序影响可见性，后续轮次再改变可选菜品。算法菜名通过浏览器中的规则与随机组合生成；当前版本没有调用大语言模型来生成菜单或分析文本。

The work turns a recommendation feedback loop into a restaurant experience: choices affect ranking, ranking affects visibility, and later sessions change the available dishes. Algorithmic dish names are assembled using browser-side rules and random combinations; the current version does not call a large language model to generate menus or analysis text.

可以尝试连续几轮只点同一分类，再观察菜单的变化。  
Try choosing from the same category for several rounds and observe how the menu changes.

## 本地运行 / Run locally

下载仓库后，用浏览器打开 `index.html` 即可，无需安装依赖或执行构建。需要联网加载运行库、字体及菜品图片。

Download the repository and open `index.html` in a browser. No installation or build step is required. An internet connection is needed for libraries, fonts, and dish images.

- **页面 / Interface:** React 18、Tailwind CSS、浏览器端 Babel / Babel in the browser.
- **图表 / Charts:** Chart.js.
- **字体 / Fonts:** Google Fonts.
- **菜品图片 / Dish images:** Pollinations 外部图片服务 / external image service.
- **部署 / Hosting:** GitHub Pages，`main` 分支根目录 / root of the `main` branch.

菜单演化与点单状态保存在当前页面内存中，刷新页面会重置。外部服务的可用性与网络状况会影响图片、字体及页面加载。

Menu evolution and ordering state live in page memory and reset on refresh. External service availability and network conditions affect image, font, and page loading.

## 文件结构 / Files

```text
restauruuun/
├── index.html          # 互动网页 / Interactive website
├── README.md           # 项目介绍 / Project guide
└── docs/images/        # 作者提供的展示图 / Author-supplied images
```
