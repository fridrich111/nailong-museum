# 奶龙美术馆 - Vercel 免费部署指南

## 免费域名
部署后自动获得: `https://fridrich-of-ntu.vercel.app`

---

## 部署步骤（5分钟完成）

### 第一步：注册 Vercel 账号（用QQ邮箱）

1. 访问 https://vercel.com/signup
2. 选择 **Continue with Email**
3. 输入你的 **QQ邮箱**（如 `123456789@qq.com`）
4. 点击 **Continue**
5. 查收邮箱中的验证码，输入完成验证
6. 设置密码，点击 **Create Account**

### 第二步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称: `fridrich-of-ntu`
3. 选择 **Public**
4. 点击 **Create repository**

### 第三步：推送代码到 GitHub

打开新的 CMD 或 PowerShell:

```bash
cd e:\黑客松\fridrich-of-ntu-integrated
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/fridrich-of-ntu.git
git push -u origin main
```

> 将 `你的用户名` 替换为你的GitHub用户名

### 第四步：部署到 Vercel

1. 访问 https://vercel.com/new
2. 登录后，点击 **Import Git Repository**
3. 找到你的仓库 `fridrich-of-ntu`，点击 **Import**
4. Framework Preset 选择 **Other**
5. 点击 **Deploy**
6. 等待约30秒，部署完成！

### 第五步：访问网站

部署成功后，网站地址为:
```
https://fridrich-of-ntu.vercel.app
```

---

## 重新部署

修改代码后，在本地执行:

```bash
cd e:\黑客松\fridrich-of-ntu-integrated
git add .
git commit -m "更新描述"
git push origin main
```

Vercel 会自动检测到推送并重新部署（约30秒）。

---

## 优势

✅ 完全免费  
✅ 全球 CDN 加速（国内访问比 GitHub Pages 快）  
✅ 自动 HTTPS  
✅ 每次推送自动部署  
✅ 支持大文件（视频）

---

## 常见问题

### Q: GitHub仓库在哪里找？
A: 在 Vercel 导入页面点击 "Import Third-Party Git Repository" → "Configure GitHub App" → 授权后刷新页面

### Q: 部署失败怎么办？
A: 检查视频文件是否过大（Vercel免费版单文件限制100MB）

### Q: 想换域名？
A: 以后可以在 Vercel Dashboard → 项目 → Settings → Domains 添加自定义域名
