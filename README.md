# 🩺 Double Medical Check

一个基于 AI 的医疗检测报告分析应用，使用 Google Gemini AI 帮助用户理解和分析医疗检测结果。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XujunNoahWang/double-medical-check&branch=deploy)

## ✨ 功能特性

### 🤖 AI 智能分析
- **多模态 AI**: 使用 Google Gemini 2.5 Flash 模型进行图像识别和文本分析
- **智能去重**: 自动识别并合并多张图片中的重复检测项目
- **结构化输出**: 将检测结果按类别整理（血常规、生化检查、免疫检查等）
- **异常标识**: 自动标识超出正常范围的检测项目

### 📊 报告分析
- **多图片支持**: 一次上传多张报告图片，AI 自动整合分析
- **数据提取**: 精确提取检测项目名称、数值、单位、参考范围
- **诊断建议**: 基于异常指标提供可能的诊断建议和注意事项
- **对比分析**: 支持 AI 诊断与医生诊断的对比分析

### 🌐 用户体验
- **双语支持**: 完整的中英文界面切换
- **响应式设计**: 适配桌面端和移动端设备
- **现代 UI**: 采用 Apple 风格的现代化界面设计
- **可点击标题**: 点击应用标题快速返回主页
- **主题切换**: 支持明暗主题切换

### 🚀 部署方案
- **本地开发**: 支持本地快速启动和调试
- **Vercel 部署**: 一键部署到 Vercel，支持全球 CDN 加速
- **无服务器**: 基于 Serverless 架构，自动扩展

## 🛠️ 技术栈

### 后端技术
- **框架**: Python Flask 2.3.3
- **AI 模型**: Google Gemini 2.5 Flash Lite Preview
- **图像处理**: Pillow 10.0.1
- **跨域支持**: Flask-CORS 4.0.0
- **环境管理**: python-dotenv 1.0.0

### 前端技术
- **核心**: HTML5 + CSS3 + Vanilla JavaScript
- **样式**: CSS 变量 + 现代 CSS 特性
- **图标**: Font Awesome 6.4.0
- **字体**: SF Pro Display

### 部署技术
- **平台**: Vercel Serverless Functions
- **配置**: vercel.json + Python Runtime
- **静态资源**: Vercel CDN

## 🚀 快速开始

### 环境要求
- Python 3.8+
- Google Gemini API Key ([获取地址](https://makersuite.google.com/app/apikey))

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/XujunNoahWang/double-medical-check.git
cd double-medical-check
```

2. **安装依赖**
```bash
pip install -r requirements.txt
```

3. **配置环境变量**
创建 `.env` 文件：
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

4. **启动应用**
```bash
python start_app.py
```

5. **访问应用**
- 前端: http://localhost:8080
- 后端: http://localhost:5000

### Vercel 部署

1. **Fork 项目** 到你的 GitHub 账户

2. **导入到 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 选择 "Import Git Repository"
   - 选择 `deploy` 分支

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **部署完成**
   Vercel 会自动构建和部署应用

## 📖 使用指南

### 基本流程
1. **上传报告**: 点击上传按钮或拖拽图片到上传区域
2. **开始分析**: 点击"开始分析"按钮，AI 开始处理报告
3. **查看结果**: 查看结构化的分析结果和诊断建议
4. **导出报告**: 可导出分析结果为文本格式
5. **对比诊断**: 可选择输入医生诊断进行 AI 对比分析

### 支持的报告类型
- ✅ **血常规检查**: 白细胞、红细胞、血小板等
- ✅ **生化检查**: 肝功能、肾功能、血糖、血脂等
- ✅ **免疫检查**: 各类抗体、免疫球蛋白等
- ✅ **内分泌检查**: 甲状腺功能、激素水平等
- 🔄 **影像学检查**: X光、CT、MRI、超声（即将支持）

### 上传建议
- 📸 确保图片清晰，文字可读
- 📄 支持 JPG、PNG、WEBP 等格式
- 📊 可上传多张图片，AI 会自动整合
- 🔒 注意保护个人隐私信息

## 📁 项目结构

```
double-medical-check/
├── 📄 app.py                 # Flask 主应用
├── ⚙️ config.py              # 应用配置
├── 🛠️ utils.py               # 工具函数
├── 🌐 i18n.py                # 国际化支持
├── 🤖 promptsZH.py           # AI 提示词模板
├── 📁 static/                # 前端静态文件
│   ├── 🏠 index.html         # 主页面
│   ├── 🎨 style.css          # 样式文件
│   └── ⚡ script.js          # 前端脚本
├── 📁 locales/               # 多语言文件
│   ├── 🇨🇳 zh.json           # 中文翻译
│   └── 🇺🇸 en.json           # 英文翻译
├── 📁 api/                   # Vercel 函数
│   └── 🚀 index.py           # Vercel 入口
├── ⚙️ vercel.json            # Vercel 配置
├── 📋 requirements.txt       # Python 依赖
├── 🚀 start_app.py           # 本地启动脚本
└── 📚 VERCEL_DEPLOY.md       # 部署指南
```

## 🔧 API 接口

### 分析报告
```http
POST /analyze
Content-Type: multipart/form-data

# 上传多张图片文件
images: File[]
```

### 对比诊断
```http
POST /compare
Content-Type: application/json

{
  "ai_diagnosis": "AI诊断结果",
  "doctor_diagnosis": "医生诊断结果"
}
```

### 语言设置
```http
POST /set-language
Content-Type: application/json

{
  "language": "en" | "zh"
}
```

## ⚠️ 重要声明

- 🩺 **医疗免责**: 本应用仅供参考，不能替代专业医疗诊断
- 🔒 **隐私保护**: 请勿上传包含敏感个人信息的报告
- 📊 **准确性**: AI 分析结果可能存在误差，请以医生诊断为准
- 🏥 **就医建议**: 如有健康问题，请及时就医咨询专业医生

## 🤝 贡献指南

欢迎贡献代码和建议！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [Google Gemini API](https://ai.google.dev/)
- [Vercel 部署文档](https://vercel.com/docs)
- [Flask 官方文档](https://flask.palletsprojects.com/)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star！**

Made with ❤️ by [XujunNoahWang](https://github.com/XujunNoahWang)

</div>
---

# 
🩺 Double Medical Check (English)

An AI-powered medical test report analysis application that uses Google Gemini AI to help users understand and analyze medical test results.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XujunNoahWang/double-medical-check&branch=deploy)

## ✨ Features

### 🤖 AI Intelligence
- **Multimodal AI**: Uses Google Gemini 2.5 Flash model for image recognition and text analysis
- **Smart Deduplication**: Automatically identifies and merges duplicate test items from multiple images
- **Structured Output**: Organizes test results by category (blood routine, biochemical tests, immunological tests, etc.)
- **Abnormal Detection**: Automatically identifies test items that exceed normal ranges

### 📊 Report Analysis
- **Multi-image Support**: Upload multiple report images at once, AI automatically integrates analysis
- **Data Extraction**: Precisely extracts test item names, values, units, and reference ranges
- **Diagnostic Suggestions**: Provides possible diagnostic suggestions and precautions based on abnormal indicators
- **Comparison Analysis**: Supports comparison between AI diagnosis and doctor's diagnosis

### 🌐 User Experience
- **Bilingual Support**: Complete Chinese-English interface switching
- **Responsive Design**: Adapts to desktop and mobile devices
- **Modern UI**: Apple-style modern interface design
- **Clickable Title**: Click app title to quickly return to homepage
- **Theme Toggle**: Supports light and dark theme switching

### 🚀 Deployment Options
- **Local Development**: Supports local quick start and debugging
- **Vercel Deployment**: One-click deployment to Vercel with global CDN acceleration
- **Serverless**: Based on Serverless architecture with automatic scaling

## 🛠️ Tech Stack

### Backend Technologies
- **Framework**: Python Flask 2.3.3
- **AI Model**: Google Gemini 2.5 Flash Lite Preview
- **Image Processing**: Pillow 10.0.1
- **CORS Support**: Flask-CORS 4.0.0
- **Environment Management**: python-dotenv 1.0.0

### Frontend Technologies
- **Core**: HTML5 + CSS3 + Vanilla JavaScript
- **Styling**: CSS Variables + Modern CSS Features
- **Icons**: Font Awesome 6.4.0
- **Fonts**: SF Pro Display

### Deployment Technologies
- **Platform**: Vercel Serverless Functions
- **Configuration**: vercel.json + Python Runtime
- **Static Assets**: Vercel CDN

## 🚀 Quick Start

### Requirements
- Python 3.8+
- Google Gemini API Key ([Get here](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone the project**
```bash
git clone https://github.com/XujunNoahWang/double-medical-check.git
cd double-medical-check
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**
Create `.env` file:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

4. **Start the application**
```bash
python start_app.py
```

5. **Access the application**
- Frontend: http://localhost:8080
- Backend: http://localhost:5000

### Vercel Deployment

1. **Fork the project** to your GitHub account

2. **Import to Vercel**
   - Visit [Vercel](https://vercel.com)
   - Select "Import Git Repository"
   - Choose the `deploy` branch

3. **Configure environment variables**
   Add in Vercel project settings:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Deployment complete**
   Vercel will automatically build and deploy the application

## 📖 Usage Guide

### Basic Workflow
1. **Upload Reports**: Click upload button or drag images to upload area
2. **Start Analysis**: Click "Start Analysis" button, AI begins processing reports
3. **View Results**: View structured analysis results and diagnostic suggestions
4. **Export Report**: Export analysis results in text format
5. **Compare Diagnosis**: Optionally input doctor's diagnosis for AI comparison analysis

### Supported Report Types
- ✅ **Blood Routine Tests**: White blood cells, red blood cells, platelets, etc.
- ✅ **Biochemical Tests**: Liver function, kidney function, blood sugar, blood lipids, etc.
- ✅ **Immunological Tests**: Various antibodies, immunoglobulins, etc.
- ✅ **Endocrine Tests**: Thyroid function, hormone levels, etc.
- 🔄 **Imaging Tests**: X-ray, CT, MRI, ultrasound (coming soon)

### Upload Recommendations
- 📸 Ensure images are clear with readable text
- 📄 Supports JPG, PNG, WEBP and other formats
- 📊 Can upload multiple images, AI will automatically integrate
- 🔒 Pay attention to protecting personal privacy information

## 📁 Project Structure

```
double-medical-check/
├── 📄 app.py                 # Flask main application
├── ⚙️ config.py              # Application configuration
├── 🛠️ utils.py               # Utility functions
├── 🌐 i18n.py                # Internationalization support
├── 🤖 promptsZH.py           # AI prompt templates
├── 📁 static/                # Frontend static files
│   ├── 🏠 index.html         # Main page
│   ├── 🎨 style.css          # Style file
│   └── ⚡ script.js          # Frontend script
├── 📁 locales/               # Multi-language files
│   ├── 🇨🇳 zh.json           # Chinese translations
│   └── 🇺🇸 en.json           # English translations
├── 📁 api/                   # Vercel functions
│   └── 🚀 index.py           # Vercel entry point
├── ⚙️ vercel.json            # Vercel configuration
├── 📋 requirements.txt       # Python dependencies
├── 🚀 start_app.py           # Local startup script
└── 📚 VERCEL_DEPLOY.md       # Deployment guide
```

## 🔧 API Endpoints

### Analyze Reports
```http
POST /analyze
Content-Type: multipart/form-data

# Upload multiple image files
images: File[]
```

### Compare Diagnosis
```http
POST /compare
Content-Type: application/json

{
  "ai_diagnosis": "AI diagnosis result",
  "doctor_diagnosis": "Doctor's diagnosis result"
}
```

### Language Settings
```http
POST /set-language
Content-Type: application/json

{
  "language": "en" | "zh"
}
```

## ⚠️ Important Disclaimers

- 🩺 **Medical Disclaimer**: This application is for reference only and cannot replace professional medical diagnosis
- 🔒 **Privacy Protection**: Do not upload reports containing sensitive personal information
- 📊 **Accuracy**: AI analysis results may contain errors, please refer to doctor's diagnosis
- 🏥 **Medical Advice**: If you have health problems, please seek medical attention and consult professional doctors promptly

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🔗 Related Links

- [Google Gemini API](https://ai.google.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ❤️ by [XujunNoahWang](https://github.com/XujunNoahWang)

</div>