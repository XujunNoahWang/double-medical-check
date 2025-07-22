# Double Medical Check

版本：0.1.0

一个基于AI的医疗检测报告分析应用，可以识别医疗报告图片并提供详细的数据整理和诊断建议，支持与医生诊断进行对比分析。

## 功能特点

- 🏥 **多图片上传**: 支持拖拽上传多张医疗检测报告截图
- 🤖 **智能去重**: AI自动识别并合并重复的检测项目
- 📊 **数据整理**: 提取检测项目、数值、单位、参考范围等信息
- 🏷️ **状态标签**: 使用直观的Tag标签显示检测结果状态（正常/偏高/偏低等）
- 💡 **AI诊断**: 基于检测结果提供可能的诊断建议和紧急程度评估
- ⚖️ **对比分析**: 将AI诊断与医生实际诊断进行详细对比分析
- 📱 **现代化UI**: 响应式设计，支持暗色/亮色主题切换
- 📄 **报告导出**: 支持导出分析结果为文本文件

## 技术栈

- **后端**: Python Flask
- **AI模型**: Google Gemini 1.5 Flash
- **前端**: HTML5, CSS3, JavaScript (Vanilla)
- **图片处理**: Pillow (PIL)

## 安装说明

### 环境要求

- Python 3.8+
- Google Gemini API Key

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/XujunNoahWang/double-medical-check.git
cd double-medical-check
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 配置环境变量
```bash
# 编辑 .env 文件并添加你的 Google API Key
GOOGLE_API_KEY=your_google_api_key_here
```

## 使用方法

### 快速启动

使用一键启动脚本：
```bash
python start_app.py
```

应用将自动启动并打开浏览器。

### 手动启动

1. 启动后端服务
```bash
python app.py
```

2. 启动前端服务（可选）
```bash
cd static
python -m http.server 8080
```

3. 访问应用
- 前端: http://localhost:8080
- 后端API: http://localhost:5000

## 项目结构

```
double-medical-check/
├── app.py                 # Flask后端应用
├── start_app.py           # 一键启动脚本
├── requirements.txt       # Python依赖
├── .env                   # 环境变量配置
├── static/                # 前端静态文件
│   ├── index.html         # 主页面
│   ├── script.js          # JavaScript逻辑
│   └── style.css          # 样式文件
└── README.md              # 项目文档
```

## API接口

### POST /analyze

分析上传的医疗检测报告图片

**请求参数:**
- `images`: 图片文件列表 (multipart/form-data)

**响应格式:**
```json
{
  "success": true,
  "analysis_data": {
    "report_summary": {
      "total_items": 15,
      "abnormal_items": 3,
      "report_date": "2024-01-15",
      "patient_info": "患者信息"
    },
    "test_categories": [
      {
        "category": "血常规",
        "items": [
          {
            "name": "白细胞计数",
            "value": "8.5",
            "unit": "×10⁹/L",
            "reference_range": "3.5-9.5",
            "status": "normal",
            "status_emoji": "🟢"
          }
        ]
      }
    ],
    "abnormal_findings": [
      {
        "item": "血糖",
        "value": "8.5",
        "reference": "3.9-6.1",
        "severity": "moderate",
        "description": "血糖偏高"
      }
    ],
    "ai_diagnosis": {
      "possible_conditions": ["糖尿病前期", "代谢综合征"],
      "recommendations": ["建议进一步检查", "控制饮食"],
      "urgency_level": "medium",
      "disclaimer": "此分析仅供参考，请以医生诊断为准"
    }
  },
  "images_processed": 3
}
```

### POST /compare

对比AI诊断和医生诊断

**请求参数:**
```json
{
  "ai_diagnosis": "AI诊断内容",
  "doctor_diagnosis": "医生诊断内容"
}
```

**响应格式:**
```json
{
  "success": true,
  "comparison_data": {
    "comparison_summary": {
      "agreement_level": "high",
      "agreement_percentage": 85,
      "main_differences": ["差异点1", "差异点2"]
    },
    "detailed_comparison": {
      "agreements": ["一致点1", "一致点2"],
      "differences": [
        {
          "aspect": "诊断方面",
          "ai_view": "AI的观点",
          "doctor_view": "医生的观点",
          "analysis": "差异分析"
        }
      ]
    },
    "insights": {
      "ai_strengths": ["AI诊断的优势"],
      "ai_limitations": ["AI诊断的局限"],
      "learning_points": ["学习要点"]
    },
    "conclusion": "总结性评价和建议"
  }
}
```

## 开发说明

### 环境配置

1. 获取Google Gemini API Key
   - 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 创建新的API Key

2. 配置环境变量
   - 编辑 `.env` 文件
   - 填入你的API Key

### 本地开发

1. 安装开发依赖
```bash
pip install -r requirements.txt
```

2. 启动开发服务器
```bash
python app.py
```

3. 访问 http://localhost:5000

## 使用流程

1. **上传报告**: 选择或拖拽多张医疗检测报告图片
2. **AI分析**: 系统自动识别检测项目并整理数据
3. **查看结果**: 浏览检测结果、异常发现和AI诊断建议
4. **输入医生诊断**: 在对比区域输入医生的实际诊断
5. **对比分析**: 查看AI诊断与医生诊断的详细对比
6. **导出报告**: 将分析结果导出为文本文件

## 注意事项

- 🔒 **隐私保护**: 应用不会存储用户上传的图片和个人信息
- ⚠️ **仅供参考**: AI分析结果仅供参考，不能替代专业医疗诊断
- 📷 **图片质量**: 请确保上传的图片清晰，文字可读
- 🌐 **网络要求**: 需要稳定的网络连接以调用Google AI服务

## 版本历史

- v0.1.0：初始版本，支持医疗报告分析和诊断对比功能

## 贡献指南

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License

## 免责声明

本应用提供的AI分析结果仅供参考，不能替代专业医疗诊断。请务必咨询专业医生获取准确的医疗建议。