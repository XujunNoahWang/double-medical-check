# Double Medical Check

---

# English

## Project Introduction
Double Medical Check is an intelligent medical report analysis and comparison system based on Flask. It supports image upload, AI result organization, doctor diagnosis comparison, and features a separated frontend and backend for easy deployment and extension.

## Key Features
- Upload and parse medical report images
- AI automatically organizes test results and provides diagnostic recommendations
- Doctor diagnosis input and intelligent comparison analysis
- Frontend-backend separation, static resources served independently
- **Supports Chinese-English bilingual interface switching**
- Detailed logging and exception handling for easy debugging
- Clear code structure, follows Python best practices

## Internationalization (Chinese-English Switch)
- The language can be switched between English and Chinese in the upper right corner, and all interface and interaction content will switch automatically.
- Supports session memory and local storage, auto-refresh after switching.

## Test Images
- The `test_files/` folder in the project root contains 3 test medical report images for users to experience upload and analysis features.

## Installation & Run
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourname/double-medical-check.git
   cd double-medical-check
   ```
2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment variables (optional)**
   - You can configure API Key and other sensitive info in the `.env` file.
4. **Start the app**
   ```bash
   python start_app.py
   ```
   - The browser will automatically open the frontend page after startup.

## File Structure
```
double-medical-check/
├── app.py              # Flask backend main program
├── config.py           # Configuration file
├── logger.py           # Logger utility
├── prompts.py          # AI prompt templates
├── requirements.txt    # Python dependencies
├── start_app.py        # One-click startup script
├── static/             # Frontend static resources
│   ├── index.html
│   ├── script.js
│   └── style.css
├── test_files/         # Test images
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
└── utils.py            # Utility functions
```

## Best Practices
- Use port detection to ensure reliable startup of backend/frontend services
- Process management and exception handling are sound, supporting one-click shutdown
- Unified English comments for internationalization and collaboration
- Avoid terminal incompatibilities, ensure cross-platform stability
- Clear structure for easy maintenance and secondary development

## FAQ
- **Q: What if startup fails?**
  - Check if Python dependencies are installed
  - Check if ports are occupied
  - Check detailed error info in terminal output
- **Q: How to customize the frontend?**
  - Modify files in the `static/` directory
- **Q: How to extend AI capabilities?**
  - Modify `prompts.py` or integrate more model APIs
- **Q: How to test upload?**
  - Use images in `test_files/` for upload testing

## License
- Current version: 0.1.3
MIT License

---

# 中文版

## 项目简介
Double Medical Check 是一个基于 Flask 的医疗检测报告智能分析与对比系统，支持图片上传、AI 结果整理、医生诊断对比等功能，前后端分离，易于部署和扩展。

## 主要特性
- 医疗检测报告图片上传与解析
- AI 自动整理检测结果与诊断建议
- 医生诊断输入与智能对比分析
- 前后端分离，静态资源独立服务
- **支持中英文国际化界面切换**
- 详细日志与异常处理，易于调试
- 代码结构清晰，符合 Python 最佳实践

## 国际化（中英文切换）
- 页面右上角可选择 English 或 中文，所有界面和交互内容会自动切换。
- 支持 session 记忆和本地存储，切换后自动刷新。

## 测试图片
- 项目根目录下 `test_files/` 文件夹内，已包含 3 张测试用医疗报告图片，供用户体验上传与分析功能。

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
├── test_files/         # 测试图片
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
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
- **Q: 如何体验上传？**
  - 直接使用 `test_files/` 目录下的图片进行上传测试

## 许可证
- 当前版本：0.1.3
MIT License