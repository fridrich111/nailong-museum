---
name: "art-quiz-builder"
description: >
  根据自然语言描述生成"看图猜画"类答题网站。包含答题引擎、反馈讲解、
  原画对比、用户认证、投稿功能、独立管理面板 (admin.html)。管理面板
  可在任意浏览器中运行，通过 Supabase 直接管理内容，无需依赖 TRAE。
  Invoke when user asks to build an art quiz website, painting guessing
  game, or art exam review platform.
---

# Art Quiz Site Builder

## 概述

此 Skill 用于根据用户的自然语言描述，自动生成一个完整的"看图猜画"类答题网站。

## 生成策略：混合模式

| 层级 | 策略 | 说明 |
|------|------|------|
| 核心引擎 | 模板固化 | 直接复制 `templates/` 中的文件，替换 `{VARIABLE}` 占位符 |
| AI 生成层 | 按需生成 | 根据用户描述生成 index.html、admin.html、CSS、README |
| 基础设施 | 模板输出 | 输出 Supabase SQL 建表语句和部署指南 |

## 使用流程

### 1. 收集用户需求

第一轮（必问）：
- 网站主题名称？
- 目标用户群体？
- 题目数量（默认5-10道）？

第二轮（可选）：
- 是否需要投稿功能？
- 是否需要管理面板？
- 配色偏好？

### 2. 生成项目

**步骤 A：复制核心引擎模板**

从 `templates/` 复制以下文件到目标项目，替换 `{VARIABLE}` 占位符：

| 模板 | 目标 | 替换变量 |
|------|------|----------|
| quiz.html | {project}/quiz.html | {THEME_NAME}, {IMAGE_FOLDER}, {CORRECT_VIDEO}, {WRONG_VIDEO} |
| feedback.html | {project}/feedback.html | {SUCCESS_TEXT}, {CORRECT_VIDEO}, {WRONG_VIDEO} |
| complete.html | {project}/complete.html | {FINAL_MESSAGE}, {FINAL_QUOTE}, {PASS_VIDEO} |
| select-quiz.html | {project}/select-quiz.html | {THEME_NAME}, {TOTAL_QUESTIONS} |
| paintings-data.js | {project}/js/paintings-data.js | {DEFAULT_DATA}, {TABLE_NAME}, {CACHE_KEY} |
| auth.js | {project}/js/auth.js | {APP_NAME} |
| submission.js | {project}/js/submission.js | {BUCKET_NAME}, {STORAGE_PATH}, {TABLE_NAME} |
| progress.js | {project}/js/progress.js | {TABLE_NAME} |
| main.js | {project}/js/main.js | 无 |
| disclaimer.js | {project}/js/disclaimer.js | 无 |
| supabase-config.template.js | {project}/js/supabase-config.js | {SUPABASE_URL}, {SUPABASE_ANON_KEY} |
| sw.js | {project}/sw.js | {CACHE_NAME} |
| css/components.css | {project}/css/components.css | 无 |
| css/auth.css | {project}/css/auth.css | 无 |
| css/quiz.css | {project}/css/pages/quiz.css | 无 |
| css/feedback.css | {project}/css/pages/feedback.css | 无 |
| css/complete.css | {project}/css/pages/complete.css | 无 |

**步骤 B：AI 生成可变部分**

1. **index.html**（首页）
   - 必须包含：背景图、Hero 区域、标题、描述、开始按钮
   - 必须集成：登录弹窗(#auth-modal)、声明弹窗(#disclaimer-modal)、投稿弹窗(#submission-modal)
   - CSS 引用：base.css + components.css + auth.css + pages/home.css
   - JS 引用：supabase-config.js, auth.js, main.js, disclaimer.js, submission.js

2. **admin.html**（管理页）
   - 登录保护 + 4 个 Tab（投稿审核/题库管理/添加题目/数据统计）
   - DOM ID 规范（Tabbit Agent 依赖）：
     - #login-email, #login-password, #login-submit
     - #review-list, .btn-approve[data-id], .btn-reject[data-id]
     - #painting-image, #painting-title, #painting-artist, #painting-year
     - #option-a, #option-b, #option-c, #option-d
     - #painting-explanation, #original-painting-upload, #btn-publish
     - .dup-badge[data-id], #status-message

3. **CSS 样式**
   - css/base.css + css/pages/home.css（AI 按主题生成配色）

4. **README.md**

### 3. 生成默认题目

```javascript
var DEFAULT_PAINTINGS = [
    { id: 1, image: 'art1.jpg', title: '题目名称', artist: '作者', year: '年代', options: ['正确答案', '干扰项1', '干扰项2', '干扰项3'], explanation: '讲解...' },
];
```

## 生成约束

- JS ES5 语法（var/function/.then()），兼容夸克浏览器
- CSS 模块化引用
- 图片路径 assets/images/
- 视频复用默认视频文件

## 内容管理

admin.html 管理面板可在任意浏览器独立操作。配合 Tabbit 妙招实现全自动化审核流程（见 references/tabbit-guide.md）。

## 参考示例

完整示例项目：C:\Users\lenovo\nailong-museum\
