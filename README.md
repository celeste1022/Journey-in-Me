# Journey in Me

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

已准备 `Publish Create V1` 工作流，仅发布 `Create-V1/dist`，不会发布测试、说明文档或其他版本。

本仓库为公开仓库，Create V1 已通过 GitHub Pages 发布，无需登录即可打开。

更新网站：推送代码后，在 Actions → Publish Create V1 → Run workflow 中运行发布。发布成功后，以上 Demo 地址会更新。

### Demo 范围

付款、连接音箱与写卡为模拟流程；声音列表使用演示音频。分享链接依赖当前浏览器的数据，尚未接入公开音频存储服务。
