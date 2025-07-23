"""
Vercel 部署入口文件
"""

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 设置环境变量
os.environ['FLASK_ENV'] = 'production'

from app import app

# 导出应用供 Vercel 使用
app = app