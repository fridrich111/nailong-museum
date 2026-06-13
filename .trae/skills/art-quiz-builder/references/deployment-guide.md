# 部署指南

## GitHub Pages
1. 创建 GitHub 仓库
2. git push 到 main 分支
3. Settings → Pages → Source: main, / (root)
4. 保存，等待部署

## 自定义域名
1. 根目录创建 CNAME 文件写入域名
2. DNS 添加 CNAME 指向 {username}.github.io
3. Settings → Pages → Custom domain → Enforce HTTPS

## Vercel（备选）
1. vercel.com 导入 GitHub 仓库
2. 框架选择 Other → Deploy
