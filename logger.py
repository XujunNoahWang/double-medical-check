"""
日志配置模块
提供统一的日志记录功能
"""

import logging
import os
from datetime import datetime
from config import Config

def setup_logger():
    """设置应用日志"""
    
    # 创建logs目录
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # 配置日志格式
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # 配置根日志记录器
    logging.basicConfig(
        level=logging.INFO if not Config.DEBUG else logging.DEBUG,
        format=log_format,
        handlers=[
            # 控制台输出
            logging.StreamHandler(),
            # 文件输出
            logging.FileHandler(
                f'logs/app_{datetime.now().strftime("%Y%m%d")}.log',
                encoding='utf-8'
            )
        ]
    )
    
    # 创建应用专用日志记录器
    logger = logging.getLogger(Config.APP_NAME)
    
    return logger

def get_logger():
    """获取日志记录器"""
    return logging.getLogger(Config.APP_NAME)

# 初始化日志
app_logger = setup_logger()