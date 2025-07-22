# Double Medical Check

## 项目简介
Double Medical Check 是一个基于 Flask 的医疗检测报告智能分析与对比系统，支持图片上传、AI 结果整理、医生诊断对比等功能，前后端分离，易于部署和扩展。

## 主要特性
- 医疗检测报告图片上传与解析
- AI 自动整理检测结果与诊断建议
- 医生诊断输入与智能对比分析
- 前后端分离，静态资源独立服务
- 详细日志与异常处理，易于调试
- 代码结构清晰，符合 Python 最佳实践

## 安装与运行
1. **克隆仓库**
   ```bash
   git clone https://github.com/yourname/double-medical-check.git
   cd double-medical-check
   ```
2. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```
3. **配置环境变量（可选）**
   - 可在 `.env` 文件中配置 API Key 等敏感信息。
4. **启动应用**
   ```bash
   python start_app.py
   ```
   - 启动后浏览器会自动打开前端页面。

## 文件结构
```
double-medical-check/
├── app.py              # Flask 后端主程序
├── config.py           # 配置文件
├── logger.py           # 日志工具
├── prompts.py          # AI 提示词模板
├── requirements.txt    # Python 依赖
├── start_app.py        # 一键启动脚本
├── static/             # 前端静态资源
│   ├── index.html
│   ├── script.js
│   └── style.css
└── utils.py            # 工具函数
```

## 最佳实践说明
- 采用端口检测法确保后端/前端服务可靠启动
- 进程管理与异常处理健全，支持一键关闭
- 代码注释统一英文，便于国际化与协作
- 避免终端不兼容字符，保证跨平台稳定
- 结构分明，便于维护和二次开发

## 常见问题 FAQ
- **Q: 启动失败怎么办？**
  - 检查 Python 依赖是否安装齐全
  - 检查端口是否被占用
  - 查看终端输出的详细错误信息
- **Q: 如何自定义前端页面？**
  - 修改 `static/` 目录下的 HTML/CSS/JS 文件即可
- **Q: 如何扩展 AI 能力？**
  - 修改 `prompts.py` 或集成更多模型接口

## 许可证
MIT License