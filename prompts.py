"""
AI提示词配置文件
包含医疗报告分析和诊断对比的提示词模板
"""

# 医疗报告分析提示词
MEDICAL_REPORT_ANALYSIS_PROMPT = """
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

# 诊断对比分析提示词模板
DIAGNOSIS_COMPARISON_PROMPT = """
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

def get_medical_analysis_prompt():
    """获取医疗报告分析提示词"""
    return MEDICAL_REPORT_ANALYSIS_PROMPT

def get_diagnosis_comparison_prompt(ai_diagnosis, doctor_diagnosis):
    """获取诊断对比分析提示词"""
    return DIAGNOSIS_COMPARISON_PROMPT.format(
        ai_diagnosis=ai_diagnosis,
        doctor_diagnosis=doctor_diagnosis
    )