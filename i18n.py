"""
国际化支持模块
支持中英双语切换
"""

import json
import os
from flask import request, session

class I18n:
    """国际化类"""
    
    def __init__(self):
        self.languages = {}
        self.default_language = 'zh'
        self.supported_languages = ['zh', 'en']
        self.load_languages()
    
    def load_languages(self):
        """加载语言文件"""
        for lang in self.supported_languages:
            lang_file = f'locales/{lang}.json'
            if os.path.exists(lang_file):
                with open(lang_file, 'r', encoding='utf-8') as f:
                    self.languages[lang] = json.load(f)
            else:
                print(f"警告: 语言文件 {lang_file} 不存在")
                self.languages[lang] = {}
    
    def get_language(self):
        """获取当前语言"""
        # 优先级: URL参数 > Session > Accept-Language > 默认语言
        lang = request.args.get('lang')
        if not lang:
            lang = session.get('language')
        if not lang:
            lang = request.headers.get('Accept-Language', '').split(',')[0].split('-')[0]
        if lang not in self.supported_languages:
            lang = self.default_language
        return lang
    
    def set_language(self, lang):
        """设置当前语言"""
        if lang in self.supported_languages:
            session['language'] = lang
            return True
        return False
    
    def t(self, key, lang=None, **kwargs):
        """翻译函数"""
        if lang is None:
            lang = self.get_language()
        
        if lang not in self.languages:
            lang = self.default_language
        
        # 支持嵌套键，如 'errors.file_not_found'
        keys = key.split('.')
        text = self.languages[lang]
        
        try:
            for k in keys:
                text = text[k]
        except (KeyError, TypeError):
            # 如果找不到翻译，尝试使用默认语言
            if lang != self.default_language:
                return self.t(key, self.default_language, **kwargs)
            return key  # 返回原始键作为后备
        
        # 支持参数替换
        if kwargs:
            try:
                text = text.format(**kwargs)
            except (KeyError, ValueError):
                pass
        
        return text
    
    def get_all_translations(self, lang=None):
        """获取所有翻译"""
        if lang is None:
            lang = self.get_language()
        return self.languages.get(lang, {})

# 全局实例
i18n = I18n()

def init_i18n(app):
    """初始化Flask应用的国际化支持"""
    app.secret_key = app.config.get('SECRET_KEY', 'your-secret-key-here')
    
    @app.context_processor
    def inject_i18n():
        return {
            't': i18n.t,
            'current_language': i18n.get_language(),
            'supported_languages': i18n.supported_languages
        }
    
    return i18n