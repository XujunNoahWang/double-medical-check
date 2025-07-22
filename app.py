import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv
import base64

# 加载环境变量
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# 获取 API Key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("错误：未找到 GOOGLE_API_KEY 环境变量")
    print("请在 .env 文件中设置 GOOGLE_API_KEY")
else:
    print(f"成功加载 API Key：{api_key[:10]}...")

genai.configure(api_key=api_key)
# 使用 Gemini 1.5 Flash 模型
model = genai.GenerativeModel('gemini-2.5-flash-lite-preview-06-17')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_medical_reports():
    """分析医疗检测报告"""
    if 'images' not in request.files:
        return jsonify({"error": "No image files provided"}), 400

    image_files = request.files.getlist('images')
    if not image_files or all(file.filename == '' for file in image_files):
        return jsonify({"error": "No selected image files"}), 400

    try:
        # 处理多张图片
        processed_images = []
        for i, image_file in enumerate(image_files):
            if image_file and image_file.filename != '':
                image_bytes = image_file.read()
                img = Image.open(io.BytesIO(image_bytes))
                
                # 优化图片
                optimized_bytes = io.BytesIO()
                img = img.convert('RGB')
                img.save(optimized_bytes, format='WEBP', quality=85, method=6)
                optimized_bytes.seek(0)
                optimized_img = Image.open(optimized_bytes)
                
                processed_images.append({
                    'image': optimized_img,
                    'index': i + 1
                })

        if not processed_images:
            return jsonify({"error": "No valid images provided"}), 400

        # 构建分析提示词
        prompt_text = """
请分析这些医疗检测报告图片，并按照以下要求处理：

1. **去重合并**：多张图片可能包含重复的检测项目，请识别并合并相同的检测项目，避免重复
2. **数据提取**：提取所有检测项目的名称、数值、单位、参考范围
3. **异常标识**：标识出超出正常范围的检测项目
4. **分类整理**：将检测项目按类别分组（如血常规、生化检查、免疫检查等）
5. **诊断建议**：基于异常指标提供可能的诊断建议和注意事项

请严格按照以下JSON格式返回数据：

{
  "report_summary": {
    "total_items": 检测项目总数,
    "abnormal_items": 异常项目数量,
    "report_date": "检测日期（如果能识别到）",
    "patient_info": "患者信息（如果能识别到，注意隐私保护）"
  },
  "test_categories": [
    {
      "category": "检查类别名称",
      "items": [
        {
          "name": "检测项目名称",
          "value": "检测值",
          "unit": "单位",
          "reference_range": "参考范围",
          "status": "normal/high/low",
          "status_emoji": "🟢/🔴/🟡"
        }
      ]
    }
  ],
  "abnormal_findings": [
    {
      "item": "异常项目名称",
      "value": "异常值",
      "reference": "参考范围",
      "severity": "mild/moderate/severe",
      "description": "异常描述"
    }
  ],
  "ai_diagnosis": {
    "possible_conditions": [
      "可能的疾病或状况1",
      "可能的疾病或状况2"
    ],
    "recommendations": [
      "建议1：如需要进一步检查",
      "建议2：生活方式调整",
      "建议3：复查时间建议"
    ],
    "urgency_level": "low/medium/high",
    "disclaimer": "此分析仅供参考，请以医生诊断为准"
  }
}

重要提醒：
- 如果多张图片包含相同的检测项目，请合并为一条记录
- 对于无法确定的数值，请标注为"无法识别"
- 严格遵循医疗伦理，不提供确定性诊断，只提供参考建议
- 请只返回JSON数据，不要包含其他文字

现在开始分析以下医疗检测报告图片：
"""

        # 准备发送给AI的内容
        content_parts = [prompt_text]
        for img_data in processed_images:
            content_parts.append(img_data['image'])

        # 调用AI分析
        response = model.generate_content(content_parts)
        response_text = response.text.strip()
        
        # 解析JSON响应
        try:
            # 清理响应文本
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            analysis_data = json.loads(response_text)
            
            return jsonify({
                "success": True,
                "analysis_data": analysis_data,
                "images_processed": len(processed_images)
            })
            
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {e}")
            print(f"原始响应: {response_text}")
            
            # 备用响应
            fallback_data = {
                "report_summary": {
                    "total_items": 0,
                    "abnormal_items": 0,
                    "report_date": "无法识别",
                    "patient_info": "无法识别"
                },
                "test_categories": [],
                "abnormal_findings": [],
                "ai_diagnosis": {
                    "possible_conditions": ["AI响应格式异常，无法解析"],
                    "recommendations": ["请重新上传清晰的检测报告图片"],
                    "urgency_level": "medium",
                    "disclaimer": "此分析仅供参考，请以医生诊断为准"
                }
            }
            
            return jsonify({
                "success": True,
                "analysis_data": fallback_data,
                "images_processed": len(processed_images),
                "warning": "AI响应解析异常，显示备用数据"
            })
            
    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/compare', methods=['POST'])
def compare_diagnosis():
    """对比AI诊断和医生诊断"""
    try:
        data = request.get_json()
        ai_diagnosis = data.get('ai_diagnosis', '')
        doctor_diagnosis = data.get('doctor_diagnosis', '')
        
        if not ai_diagnosis or not doctor_diagnosis:
            return jsonify({"error": "请提供AI诊断和医生诊断内容"}), 400
        
        # 构建对比分析提示词
        prompt_text = f"""
请对比分析以下AI诊断建议和医生实际诊断，并提供详细的对比分析：

**AI诊断建议：**
{ai_diagnosis}

**医生实际诊断：**
{doctor_diagnosis}

请按照以下JSON格式返回对比分析结果：

{{
  "comparison_summary": {{
    "agreement_level": "high/medium/low",
    "agreement_percentage": 85,
    "main_differences": ["差异点1", "差异点2"]
  }},
  "detailed_comparison": {{
    "agreements": [
      "一致点1：具体描述",
      "一致点2：具体描述"
    ],
    "differences": [
      {{
        "aspect": "诊断方面",
        "ai_view": "AI的观点",
        "doctor_view": "医生的观点",
        "analysis": "差异分析"
      }}
    ]
  }},
  "insights": {{
    "ai_strengths": ["AI诊断的优势1", "AI诊断的优势2"],
    "ai_limitations": ["AI诊断的局限1", "AI诊断的局限2"],
    "learning_points": ["学习要点1", "学习要点2"]
  }},
  "conclusion": "总结性评价和建议"
}}

请只返回JSON数据，不要包含其他文字。
"""
        
        response = model.generate_content(prompt_text)
        response_text = response.text.strip()
        
        # 解析JSON响应
        try:
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            comparison_data = json.loads(response_text)
            
            return jsonify({
                "success": True,
                "comparison_data": comparison_data
            })
            
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {e}")
            return jsonify({"error": "对比分析响应格式异常"}), 500
            
    except Exception as e:
        print(f"Error during comparison: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)