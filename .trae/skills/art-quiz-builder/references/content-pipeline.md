# 内容管理工作流

## 概述
admin.html 是纯前端管理面板，在任意浏览器中独立运行。
通过 Supabase JS SDK 直接读写数据库，无需重新部署。

## 机制
admin.html 写入 paintings 表 → paintings-data.js 自动加载 → 网站更新

## 功能
- 投稿审核：查看/通过/拒绝 pending 投稿
- 题库管理：查看/编辑/删除题目
- 添加题目：手动添加新题
- 数据统计：汇总数据

## 管理员配置
```javascript
var ADMIN_EMAILS = ['admin@example.com'];
```

## Tabbit 妙招
配合 Tabbit 智能代理妙招实现全自动化审核（见 tabbit-guide.md）
