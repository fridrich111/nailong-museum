# 奶龙美术馆 - GitHub Pages 部署指南

## 域名信息
- **域名**: fridrichntunailong.com
- **托管**: GitHub Pages
- **项目**: fridrich-of-ntu-integrated

---

## 部署步骤

### 第一步：购买域名
1. 访问 https://wanwang.aliyun.com 或 https://dnspod.cloud.tencent.com
2. 搜索并购买域名: `fridrichntunailong.com`
3. 完成实名认证（国内注册商需要）

### 第二步：创建GitHub仓库
1. 登录 https://github.com
2. 点击右上角 **+** → **New repository**
3. 仓库名称: `fridrich-of-ntu-integrated`
4. 选择 **Public**
5. 点击 **Create repository**

### 第三步：推送代码到GitHub

打开新的CMD或PowerShell窗口，执行:

```bash
cd e:\黑客松\fridrich-of-ntu-integrated
git init
git add .
git commit -m "Initial commit: 奶龙美术馆"
git branch -M main
git remote add origin https://github.com/你的用户名/fridrich-of-ntu-integrated.git
git push -u origin main
```

> 将 `你的用户名` 替换为你的GitHub用户名

### 第四步：开启GitHub Pages
1. 打开仓库页面
2. 点击 **Settings** → **Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **main**，文件夹选 **/ (root)**
5. 点击 **Save**

等待1-2分钟，网站将部署到:
```
https://你的用户名.github.io/fridrich-of-ntu-integrated/
```

### 第五步：绑定自定义域名

#### 5.1 在GitHub配置域名
1. 在仓库 Settings → Pages → Custom domain
2. 填入: `fridrichntunailong.com`
3. 点击 **Save**
4. 勾选 **Enforce HTTPS**（等待证书生成，约5分钟）

#### 5.2 在域名注册商配置DNS

**阿里云DNS配置:**
| 主机记录 | 记录类型 | 记录值 |
|---------|---------|--------|
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | 你的用户名.github.io |

**或腾讯云DNS配置:**
相同配置，在DNSPod中添加以上记录

### 第六步：验证部署

等待DNS生效（通常10分钟-24小时），然后访问:
```
https://fridrichntunailong.com
```

---

## 文件说明

| 文件 | 作用 |
|------|------|
| `CNAME` | GitHub Pages自定义域名配置文件 |
| `index.html` | 网站主页面（单页面应用） |
| `css/style.css` | 样式文件 |
| `js/paintings-data.js` | 23幅名画数据 |
| `assets/images/` | 图片资源 |
| `assets/videos/` | 视频资源 |

---

## 常见问题

### Q: 网站显示404
A: 检查GitHub Pages是否已开启，仓库是否为Public

### Q: 域名无法访问
A: 检查DNS记录是否正确，等待DNS生效（最长24小时）

### Q: HTTPS证书错误
A: 取消勾选Enforce HTTPS，等待5分钟后重新勾选

### Q: 视频无法播放
A: 检查视频文件是否已推送到GitHub，文件名是否正确

---

## 重新部署

如果修改了代码，重新部署:

```bash
cd e:\黑客松\fridrich-of-ntu-integrated
git add .
git commit -m "更新描述"
git push origin main
```

GitHub Pages会自动重新部署。
