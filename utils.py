"""
工具函数模块
包含图片处理、响应处理等通用功能
"""

import json
import io
from PIL import Image
from flask import jsonify
from config import Config

def process_image(image_file, index=0):
    """
    处理上传的图片文件
    
    Args:
        image_file: 上传的图片文件
        index: 图片索引
        
    Returns:
        dict: 包含处理后的图片和索引信息
    """
    try:
        image_bytes = image_file.read()
        
        # 检查文件大小
        if len(image_bytes) > Config.MAX_IMAGE_SIZE:
            raise ValueError(f"图片文件过大，最大支持 {Config.MAX_IMAGE_SIZE // (1024*1024)}MB")
        
        img = Image.open(io.BytesIO(image_bytes))
        
        # 优化图片
        optimized_bytes = io.BytesIO()
        img = img.convert('RGB')
        img.save(
            optimized_bytes, 
            format=Config.IMAGE_FORMAT, 
            quality=Config.IMAGE_QUALITY, 
            method=6
        )
        optimized_bytes.seek(0)
        optimized_img = Image.open(optimized_bytes)
        
        return {
            'image': optimized_img,
            'index': index + 1,
            'original_name': image_file.filename
        }
        
    except Exception as e:
        raise ValueError(f"图片处理失败: {str(e)}")

def validate_image_file(filename):
    """
    验证图片文件扩展名
    
    Args:
        filename: 文件名
        
    Returns:
        bool: 是否为允许的图片格式
    """
    if not filename:
        return False
    
    extension = filename.rsplit('.', 1)[-1].lower()
    return extension in Config.ALLOWED_EXTENSIONS

def clean_json_response(response_text):
    """
    清理AI响应文本，提取JSON内容
    
    Args:
        response_text: AI原始响应文本
        
    Returns:
        str: 清理后的JSON字符串
    """
    # 移除可能的markdown代码块标记
    if response_text.startswith('```json'):
        response_text = response_text[7:]
    if response_text.endswith('```'):
        response_text = response_text[:-3]
    
    return response_text.strip()

def create_error_response(message, status_code=500):
    """
    创建错误响应
    
    Args:
        message: 错误消息
        status_code: HTTP状态码
        
    Returns:
        tuple: (响应对象, 状态码)
    """
    return jsonify({"success": False, "error": message}), status_code

def create_success_response(data):
    """
    创建成功响应
    
    Args:
        data: 响应数据
        
    Returns:
        dict: 成功响应对象
    """
    return jsonify({"success": True, **data})

def create_fallback_analysis_data():
    """
    创建备用分析数据（当AI响应解析失败时使用）
    
    Returns:
        dict: 备用分析数据
    """
    return {
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

def log_error(error_message, context=None):
    """
    记录错误日志
    
    Args:
        error_message: 错误消息
        context: 错误上下文信息
    """
    print(f"ERROR: {error_message}")
    if context:
        print(f"CONTEXT: {context}")

def format_file_size(size_bytes):
    """
    格式化文件大小显示
    
    Args:
        size_bytes: 文件大小（字节）
        
    Returns:
        str: 格式化后的文件大小
    """
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"