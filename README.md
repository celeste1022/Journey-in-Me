# Journey in Me

## 2. 连接设备

**[打开连接设备 Demo](https://celeste1022.github.io/Journey-in-Me/connect-device/)**

开始绑定、扫描音箱、页内展开 Wi-Fi、配网、固件更新到 Home 的完整交互。演示情景支持扫描超时、配网失败、更新失败和断电恢复，支持手机浏览与等待快进。蓝牙、Wi-Fi 和固件过程均为模拟，请使用任意演示密码。

源文件、流程说明与校验：[Speaker-Connection](Speaker-Connection/)。

## Share V4

**[打开 Share Demo](https://celeste1022.github.io/Journey-in-Me/share/)**

Practice wish list、Public/Private、左滑删除、好友全屏浏览、团体练习与 Sound Bazaar。所有内容为本地演示，数据保存在浏览器中。

源文件：[Share-V4/index.html](Share-V4/index.html)。

## Create V1

Journey in Me 的 Paper Zen 风格交互 Demo。当前版本为 **Create V1**，完整代码、预览素材、音频、许可文件和校验测试保存在 [Create-V1](Create-V1/) 中。

**[打开 Create V1 Demo](https://celeste1022.github.io/Journey-in-Me/)**

包含 Memory、自定义主题与子主题、Gift 三条路径、单卡编辑器、Sound of The Moment、Album、My Creativity、Explore、礼物开箱动画和必填项校验。

### 本地打开

```sh
cd Create-V1
python3 -m http.server 4173 --directory dist
```

然后访问 `http://localhost:4173/`。静态页面无需安装依赖或构建。作品和录音仅保存在当前浏览器。

### 校验

```sh
cd Create-V1
node --test tests/card-validation.test.mjs
```

### GitHub Pages

已准备 `Publish Journey in Me Demos` 工作流，将 `Create-V1/dist` 发布到根目录，将 Share、Practice、My Friends、Home、连接设备分别发布到 `/share/`、`/practice/`、`/my-friend/`、`/home/`、`/connect-device/`。

`main` 分支保存 Create、Share 和连接设备；`My-friend` 分支保存 Practice、My Friends 和 Home。两套发布工作流均需组装全部 Demo，避免发布其他功能时遗漏已有页面。

本仓库为公开仓库，Create V1 已通过 GitHub Pages 发布，无需登录即可打开。

更新网站：推送代码后，在 Actions → Publish Journey in Me Demos → Run workflow 中运行发布。发布成功后，以上 Demo 地址会更新。

### Demo 范围

付款、连接音箱与写卡为模拟流程；声音列表使用演示音频。分享链接依赖当前浏览器的数据，尚未接入公开音频存储服务。
