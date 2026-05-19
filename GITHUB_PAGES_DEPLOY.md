# 奶龙美术馆 - GitHub Pages 免费部署指南

## 免费域名
部署后自动获得: `https://你的用户名.github.io/fridrich-of-ntu`

---

## 部署步骤（5分钟完成）

### 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称: `fridrich-of-ntu`
3. 选择 **Public**
4. 点击 **Create repository**

### 第二步：推送代码到 GitHub

打开新的 CMD 或 PowerShell:

```bash
cd e:\黑客松\fridrich-of-ntu-integrated
git init
git add .
git commit -m "Initial commit: 奶龙美术馆"
git branch -M main
git remote add origin https://github.com/你的用户名/fridrich-of-ntu.git
git push -u origin main
```

> 将 `你的用户名` 替换为你的GitHub用户名

### 第三步：开启 GitHub Pages

1. 打开仓库页面: `https://github.com/你的用户名/fridrich-of-ntu`
2. 点击 **Settings** → **Pages**（左侧菜单）
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **main**，文件夹选 **/ (root)**
5. 点击 **Save**

### 第四步：访问网站

等待1-2分钟，然后访问:
```
https://你的用户名.github.io/fridrich-of-ntu
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

GitHub Pages 会自动重新部署（约1-2分钟）。

---

## 优势

✅ 完全免费  
✅ 自动 HTTPS  
✅ 无需额外注册（用现有GitHub账号）  
✅ 每次推送自动部署  

---

## 注意事项

⚠️ 国内访问速度一般（比Vercel慢）  
⚠️ 视频文件建议控制在50MB以内  

---

## 常见问题

### Q: 网站显示404？
A: 检查Settings → Pages中Branch是否选中了main，等待2分钟后刷新

### Q: 视频无法播放？
A: 检查视频文件是否已推送到GitHub，文件名是否正确

### Q: 想绑定自定义域名？
A: 可以购买域名后在Settings → Pages → Custom domain中配置
