# Vercel部署指南

## 项目部署步骤

1. 在GitHub上创建仓库并推送代码
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git remote add origin <你的GitHub仓库URL>
   git push -u origin main
   ```

2. 在Vercel上创建新项目
   - 访问 [Vercel](https://vercel.com/)
   - 登录账户
   - 点击 "New Project"
   - 导入你的GitHub仓库
   - 点击 "Import"

3. 配置项目
   - 在项目设置中，添加以下环境变量:
     - `PORT`: 3005
     - `NODE_ENV`: production
   
   - 确保构建命令设置为 `npm run vercel-build`
   - 输出目录应设置为 `build`

4. 部署项目
   - 点击 "Deploy"

## 更新部署

GitHub仓库更新后，Vercel会自动重新部署网站。

## 调试问题

如果部署失败:
1. 检查Vercel构建日志
2. 确认所有环境变量已正确设置
3. 验证vercel.json配置正确 