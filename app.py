"""
Double Medical Check - 医疗检测报告AI分析应用
主应用文件
"""

import json
from flask import Flask, request
from flask_cors import CORS
import google.generativeai as genai

# 导入自定义模块
from config import get_config, Config
from prompts import get_medical_analysis_prompt, get_diagnosis_comparison_prompt
from utils import (
    process_image, validate_image_file, clean_json_response,
    create_error_response, create_success_response, 
    create_fallback_analysis_data, log_error
)

# 初始化应用
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# 加载配置
config = get_config()
app.config.from_object(config)

# 验证配置
try:
    Config.validate_config()
    print(f"成功加载配置 - {Config.APP_NAME} v{Config.VERSION}")
    print(f"API Key已配置：{Config.GOOGLE_API_KEY[:10]}...")
except ValueError as e:
    print(f"配置错误：{e}")
    exit(1)

# 初始化Gemini AI
genai.configure(api_key=Config.GOOGLE_API_KEY)
model = genai.GenerativeModel(Config.GEMINI_MODEL)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_medical_reports():
    """分析医疗检测报告"""
    # 验证请求
    if 'images' not in request.files:
        return create_error_response("No image files provided", 400)

    image_files = request.files.getlist('images')
    if not image_files or all(file.filename == '' for file in image_files):
        return create_error_response("No selected image files", 400)

    try:
        # 处理多张图片
        processed_images = []
        for i, image_file in enumerate(image_files):
            if image_file and image_file.filename != '':
                # 验证文件类型
                if not validate_image_file(image_file.filename):
                    return create_error_response(f"不支持的文件格式: {image_file.filename}", 400)
                
                try:
                    processed_img = process_image(image_file, i)
                    processed_images.append(processed_img)
                except ValueError as e:
                    return create_error_response(str(e), 400)

        if not processed_images:
            return create_error_response("No valid images provided", 400)

        # 获取分析提示词
        prompt_text = get_medical_analysis_prompt()

        # 准备发送给AI的内容
        content_parts = [prompt_text]
        for img_data in processed_images:
            content_parts.append(img_data['image'])

        # 调用AI分析
        try:
            response = model.generate_content(content_parts)
            response_text = response.text.strip()
        except Exception as e:
            log_error(f"AI分析调用失败: {e}")
            return create_error_response("AI服务暂时不可用，请稍后重试", 503)
        
        # 解析JSON响应
        try:
            cleaned_response = clean_json_response(response_text)
            analysis_data = json.loads(cleaned_response)
            
            return create_success_response({
                "analysis_data": analysis_data,
                "images_processed": len(processed_images)
            })
            
        except json.JSONDecodeError as e:
            log_error(f"JSON解析错误: {e}", response_text)
            
            # 返回备用数据
            fallback_data = create_fallback_analysis_data()
            return create_success_response({
                "analysis_data": fallback_data,
                "images_processed": len(processed_images),
                "warning": "AI响应解析异常，显示备用数据"
            })
            
    except Exception as e:
        log_error(f"分析过程中发生错误: {e}")
        return create_error_response("分析过程中发生错误，请重试", 500)

@app.route('/compare', methods=['POST'])
def compare_diagnosis():
    """对比AI诊断和医生诊断"""
    try:
        # 获取请求数据
        data = request.get_json()
        if not data:
            return create_error_response("请求数据格式错误", 400)
            
        ai_diagnosis = data.get('ai_diagnosis', '').strip()
        doctor_diagnosis = data.get('doctor_diagnosis', '').strip()
        
        # 验证输入
        if not ai_diagnosis or not doctor_diagnosis:
            return create_error_response("请提供AI诊断和医生诊断内容", 400)
        
        # 获取对比分析提示词
        prompt_text = get_diagnosis_comparison_prompt(ai_diagnosis, doctor_diagnosis)
        
        # 调用AI进行对比分析
        try:
            response = model.generate_content(prompt_text)
            response_text = response.text.strip()
        except Exception as e:
            log_error(f"AI对比分析调用失败: {e}")
            return create_error_response("AI服务暂时不可用，请稍后重试", 503)
        
        # 解析JSON响应
        try:
            cleaned_response = clean_json_response(response_text)
            comparison_data = json.loads(cleaned_response)
            
            return create_success_response({
                "comparison_data": comparison_data
            })
            
        except json.JSONDecodeError as e:
            log_error(f"对比分析JSON解析错误: {e}", response_text)
            return create_error_response("对比分析响应格式异常", 500)
            
    except Exception as e:
        log_error(f"对比分析过程中发生错误: {e}")
        return create_error_response("对比分析失败，请重试", 500)

@app.errorhandler(404)
def not_found(error):
    """处理404错误"""
    return create_error_response("页面未找到", 404)

@app.errorhandler(500)
def internal_error(error):
    """处理500错误"""
    log_error(f"内部服务器错误: {error}")
    return create_error_response("内部服务器错误", 500)

@app.route('/health')
def health_check():
    """健康检查接口"""
    return create_success_response({
        "status": "healthy",
        "app_name": Config.APP_NAME,
        "version": Config.VERSION
    })

if __name__ == '__main__':
    print(f"启动 {Config.APP_NAME} v{Config.VERSION}")
    print(f"访问地址: http://{Config.HOST}:{Config.PORT}")
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        use_reloader=False
    )