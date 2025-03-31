# 动漫占卜网站

这是一个基于React和Node.js构建的动漫主题占卜网站，用户可以获取每日运势和动漫推荐。

## 特点

- 每日动漫壁纸
- 多种风格的动漫图片
- 多API源配置，确保服务稳定性
- 缓存系统减少API调用
- 移动设备友好的用户界面

## 环境变量

在Vercel部署时，需要设置以下环境变量：

- `PORT`: 后端服务器端口
- `NODE_ENV`: 环境设置

## 本地开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

## 生产部署

该项目已配置为在Vercel上自动部署。

## 功能特点

- 每日运势：包含多个方面的运势预测
- 塔罗牌占卜：提供专业的塔罗牌解读
- 动漫和游戏元素：融入二次元文化的占卜体验
- 分享功能：支持将占卜结果分享给好友

## 开发相关

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 可用脚本

在项目目录中，你可以运行：

#### `npm start`

在开发模式下运行应用。\
打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

当你修改代码时，页面会自动重新加载。\
你还可以在控制台中看到任何 lint 错误。

#### `npm run build`

将应用构建到 `build` 文件夹中用于生产环境。\
它会在生产模式下正确打包 React 并优化构建以获得最佳性能。

构建后的文件会被压缩，文件名包含哈希值。\
你的应用已经准备好部署了！

## 了解更多

你可以在 [Create React App 文档](https://facebook.github.io/create-react-app/docs/getting-started) 中了解更多信息。

要学习 React，请查看 [React 文档](https://reactjs.org/)。
