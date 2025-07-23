"""
应用配置文件
包含应用的各种配置参数
"""

import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    """应用配置类"""
    
    # API配置
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL = "gemini-2.5-flash-lite-preview-06-17"
    
    # 服务器配置
    HOST = "0.0.0.0"
    PORT = 5000
    DEBUG = True
    
    # Flask session 密钥
    SECRET_KEY = os.getenv("SECRET_KEY", "double-medical-check-secret")
    
    # 前端服务器配置
    FRONTEND_PORT = 8080
    
    # 图片处理配置
    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    IMAGE_QUALITY = 85
    IMAGE_FORMAT = 'WEBP'
    
    # 应用信息
    APP_NAME = "Double Medical Check"
    VERSION = "0.1.3"
    
    @staticmethod
    def validate_config():
        """验证配置是否完整"""
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        return True

# 开发环境配置
class DevelopmentConfig(Config):
    DEBUG = True

# 生产环境配置
class ProductionConfig(Config):
    DEBUG = False
    HOST = "0.0.0.0"

# 根据环境变量选择配置
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """获取当前配置"""
    env = os.getenv('FLASK_ENV', 'default')
    return config.get(env, config['default'])