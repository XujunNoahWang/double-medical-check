# Vercel 部署指南

## 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: add Vercel deployment configuration"
   git push origin deploy
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 从 GitHub 导入你的仓库
   - 选择 `deploy` 分支

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   - `GOOGLE_API_KEY`: 你的 Google Gemini API 密钥

4. **部署**
   - Vercel 会自动检测到 `vercel.json` 配置
   - 自动构建和部署应用

## 文件说明

- `vercel.json`: Vercel 部署配置
- `api/index.py`: Vercel 函数入口点
- `.vercelignore`: 部署时忽略的文件
- `requirements.txt`: Python 依赖（已优化为 Vercel 兼容版本）

## 注意事项

1. **API 密钥安全**: 确保在 Vercel 环境变量中设置 `GOOGLE_API_KEY`，不要在代码中硬编码
2. **静态文件**: 静态文件会自动通过 Vercel CDN 提供服务
3. **函数限制**: Vercel 免费版有函数执行时间限制（10秒），付费版可达 60 秒

## 测试部署

部署完成后，访问 Vercel 提供的 URL 测试以下功能：
- [ ] 首页加载
- [ ] 图片上传
- [ ] AI 分析
- [ ] 诊断对比
- [ ] 语言切换

## 故障排除

如果遇到问题，检查：
1. Vercel 函数日志
2. 环境变量是否正确设置
3. API 密钥是否有效
4. 网络连接是否正常
## 
部署状态更新
- 环境变量已配置 ✅
- Deploy Hook 已设置 ✅
- 正在触发首次部署...