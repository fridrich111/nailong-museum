# fridrich-of-ntu 奶龙美术馆

奶龙艺术鉴赏互动网站 - 通过奶龙改编的世界名画，让用户猜测原画名称，寓教于乐。

## 功能特性

- 🐉 23道世界名画选择题
- 🎬 答对/答错触发不同奶龙反应视频
- 💬 沉思奶龙气泡弹窗讲解
- 🌌 星月夜主题背景
- 🎵 舒缓背景音乐
- 📱 响应式设计（手机/电脑）
- ⛶ 全屏模式支持

## 部署到 GitHub Pages

### 步骤1：创建GitHub仓库

1. 打开 https://github.com/new
2. 仓库名称：`fridrich-of-ntu`
3. 选择 **Public**
4. **不要**勾选 README、.gitignore、License
5. 点击 **Create repository**

### 步骤2：推送代码

打开新的终端（CMD或PowerShell），执行以下命令：

```bash
cd e:\黑客松\fridrich-of-ntu
git init
git add .
git commit -m "Initial commit: 奶龙美术馆"
git branch -M main
git remote add origin https://github.com/你的用户名/fridrich-of-ntu.git
git push -u origin main
```

> ⚠️ 将 `你的用户名` 替换为你的GitHub用户名

### 步骤3：开启GitHub Pages

1. 打开仓库页面 https://github.com/你的用户名/fridrich-of-ntu
2. 点击 **Settings** → **Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **main**，文件夹选 **/ (root)**
5. 点击 **Save**

等待1-2分钟后，你的网站就可以通过以下地址访问：

```
https://你的用户名.github.io/fridrich-of-ntu/
```

### 步骤4：绑定自定义域名（可选）

如果你购买了 `fridrich-nailong-ntu.com` 域名：

1. 在域名注册商处添加CNAME记录：
   - 主机记录：`www`
   - 记录类型：`CNAME`
   - 记录值：`你的用户名.github.io`

2. 在仓库 Settings → Pages → Custom domain 中填入 `www.fridrich-nailong-ntu.com`

3. 勾选 **Enforce HTTPS**

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- 响应式设计
- localStorage 进度保存
