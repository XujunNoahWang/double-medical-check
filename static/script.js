document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPage = document.getElementById('uploadPage');
    const analysisPage = document.getElementById('analysisPage');
    const startAnalysisBtn = document.getElementById('startAnalysisBtn');
    const loadingState = document.getElementById('loadingState');
    const analysisResults = document.getElementById('analysisResults');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    const exportBtn = document.getElementById('exportBtn');
    const retryBtn = document.getElementById('retryBtn');
    const compareBtn = document.getElementById('compareBtn');
    const doctorDiagnosis = document.getElementById('doctorDiagnosis');
    const comparisonResults = document.getElementById('comparisonResults');

    let selectedFilesList = [];
    let analyzeTimerInterval = null;
    let analyzeTimerStart = null;
    let currentAnalysisData = null;

    // 初始化
    initEventListeners();
    initTheme();

    function initEventListeners() {
        // 主题切换
        themeToggle.addEventListener('click', toggleTheme);
        
        // 文件上传
        imageUpload.addEventListener('change', handleFileSelect);
        
        // 拖拽上传
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        // 操作按钮
        startAnalysisBtn.addEventListener('click', startAnalysis);
        newAnalysisBtn.addEventListener('click', resetToUpload);
        exportBtn.addEventListener('click', exportReport);
        retryBtn.addEventListener('click', analyzeReports);
        compareBtn.addEventListener('click', compareDiagnosis);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newFiles = files.filter(file => file.type.startsWith('image/'));
            // 添加到现有文件列表中，避免重复
            newFiles.forEach(file => {
                const isDuplicate = selectedFilesList.some(existingFile => 
                    existingFile.name === file.name && existingFile.size === file.size
                );
                if (!isDuplicate) {
                    selectedFilesList.push(file);
                }
            });
            displayImagePreviews();
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.classList.add('dragover');
    }

    function handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        // 只有当离开整个上传区域时才移除样式
        if (!uploadArea.contains(event.relatedTarget)) {
            uploadArea.classList.remove('dragover');
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = Array.from(event.dataTransfer.files);
        const newFiles = files.filter(file => file.type.startsWith('image/'));
        // 添加到现有文件列表中，避免重复
        newFiles.forEach(file => {
            const isDuplicate = selectedFilesList.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            );
            if (!isDuplicate) {
                selectedFilesList.push(file);
            }
        });
        displayImagePreviews();
    }

    function displayImagePreviews() {
        const uploadEmptyState = document.getElementById('uploadEmptyState');
        const uploadPreviewGrid = document.getElementById('uploadPreviewGrid');
        const uploadActions = document.getElementById('uploadActions');
        
        if (selectedFilesList.length === 0) {
            uploadEmptyState.style.display = 'block';
            uploadPreviewGrid.style.display = 'none';
            uploadActions.style.display = 'none';
            return;
        }

        uploadEmptyState.style.display = 'none';
        uploadPreviewGrid.style.display = 'grid';
        uploadActions.style.display = 'block';
        
        // 清空现有预览
        uploadPreviewGrid.innerHTML = '';
        
        selectedFilesList.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'upload-preview-item';
                previewItem.innerHTML = `
                    <div class="upload-preview-wrapper">
                        <img src="${e.target.result}" alt="${file.name}" class="upload-preview-image">
                        <button class="remove-upload-image-btn" onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="upload-image-info">
                        <span class="upload-image-name">${file.name}</span>
                        <span class="upload-image-size">${formatFileSize(file.size)}</span>
                    </div>
                `;
                uploadPreviewGrid.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
        
        // 更新开始分析按钮状态
        startAnalysisBtn.disabled = selectedFilesList.length === 0;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 全局函数，供HTML调用
    window.removeFile = function(index) {
        selectedFilesList.splice(index, 1);
        displayImagePreviews();
    };

    function startAnalysis() {
        if (selectedFilesList.length > 0) {
            showAnalysisPage();
            analyzeReports();
        } else {
            showNotification('请先选择医疗报告图片', 'warning');
        }
    }

    function showAnalysisPage() {
        uploadPage.style.display = 'none';
        analysisPage.style.display = 'block';
        showLoadingState();
    }

    function showLoadingState() {
        loadingState.style.display = 'flex';
        analysisResults.style.display = 'none';
        errorState.style.display = 'none';
        
        // 启动计时器
        const timerEl = document.getElementById('analyzeTimer');
        const tipEl = document.getElementById('analyzeTip');
        if (timerEl) {
            timerEl.style.display = '';
            timerEl.textContent = '用时：0.0秒';
            analyzeTimerStart = Date.now();
            if (analyzeTimerInterval) clearInterval(analyzeTimerInterval);
            analyzeTimerInterval = setInterval(() => {
                const elapsed = ((Date.now() - analyzeTimerStart) / 1000).toFixed(1);
                timerEl.textContent = `用时：${elapsed}秒`;
            }, 100);
        }
        if (tipEl) tipEl.style.display = '';
    }

    function showResults() {
        loadingState.style.display = 'none';
        analysisResults.style.display = 'block';
        errorState.style.display = 'none';
        
        // 停止计时器
        const timerEl = document.getElementById('analyzeTimer');
        const tipEl = document.getElementById('analyzeTip');
        if (timerEl) {
            timerEl.style.display = 'none';
            if (analyzeTimerInterval) clearInterval(analyzeTimerInterval);
        }
        if (tipEl) tipEl.style.display = 'none';
    }

    function showError(message) {
        loadingState.style.display = 'none';
        analysisResults.style.display = 'none';
        errorState.style.display = 'flex';
        errorMessage.innerHTML = message;
        
        // 停止计时器
        const timerEl = document.getElementById('analyzeTimer');
        const tipEl = document.getElementById('analyzeTip');
        if (timerEl) {
            timerEl.style.display = 'none';
            if (analyzeTimerInterval) clearInterval(analyzeTimerInterval);
        }
        if (tipEl) tipEl.style.display = 'none';
    }

    async function analyzeReports() {
        if (selectedFilesList.length === 0) {
            showError('请先选择医疗报告图片');
            return;
        }

        const formData = new FormData();
        selectedFilesList.forEach(file => {
            formData.append('images', file);
        });

        const backendHost = window.location.hostname;
        const backendUrl = `http://${backendHost}:5000/analyze`;

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP错误: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.analysis_data) {
                currentAnalysisData = data.analysis_data;
                renderResults(data.analysis_data);
                showResults();
            } else {
                throw new Error(data.error || '分析失败');
            }

        } catch (error) {
            showError(`分析失败: ${error.message}`);
            console.error('分析错误:', error);
        }
    }

    function renderResults(analysisData) {
        renderReportOverview(analysisData.report_summary);
        renderTestCategories(analysisData.test_categories);
        renderAIDiagnosis(analysisData.ai_diagnosis);
    }

    function renderReportOverview(summary) {
        const overviewStats = document.getElementById('overviewStats');
        overviewStats.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${summary.total_items || 0}</div>
                <div class="stat-label">检测项目</div>
            </div>
            <div class="stat-card abnormal">
                <div class="stat-number">${summary.abnormal_items || 0}</div>
                <div class="stat-label">异常项目</div>
            </div>
            <div class="stat-card">
                <div class="stat-text">${summary.report_date || '未识别'}</div>
                <div class="stat-label">检测日期</div>
            </div>
        `;
    }

    function renderTestCategories(categories) {
        const testCategories = document.getElementById('testCategories');
        
        if (!categories || categories.length === 0) {
            testCategories.innerHTML = '<p class="no-data">未识别到检测数据</p>';
            return;
        }

        const categoriesHTML = categories.map(category => `
            <div class="test-category">
                <h4 class="category-title">${category.category}</h4>
                <div class="test-items">
                    ${category.items.map(item => `
                        <div class="test-item ${item.status}">
                            <div class="item-name">${item.name}</div>
                            <div class="value-group">
                                <span class="status-tag ${item.status}">${getStatusText(item.status)}</span>
                                <span class="value">${item.value}</span>
                                <span class="unit">${item.unit}</span>
                            </div>
                            <div class="reference-group">
                                <span class="reference-label">参考:</span>
                                <span class="reference-range">${item.reference_range}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        testCategories.innerHTML = categoriesHTML;
    }



    function renderAIDiagnosis(diagnosis) {
        const diagnosisContent = document.getElementById('diagnosisContent');
        
        const urgencyClass = diagnosis.urgency_level || 'medium';
        const urgencyText = getUrgencyText(diagnosis.urgency_level);
        
        diagnosisContent.innerHTML = `
            <div class="diagnosis-urgency ${urgencyClass}">
                <i class="fas fa-exclamation-circle"></i>
                <span>紧急程度: ${urgencyText}</span>
            </div>
            
            <div class="diagnosis-section">
                <h4><i class="fas fa-search"></i> 可能的疾病或状况</h4>
                <ul class="diagnosis-list">
                    ${(diagnosis.possible_conditions || []).map(condition => 
                        `<li>${condition}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="diagnosis-section">
                <h4><i class="fas fa-clipboard-list"></i> 建议</h4>
                <ul class="recommendations-list">
                    ${(diagnosis.recommendations || []).map(recommendation => 
                        `<li>${recommendation}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="diagnosis-disclaimer">
                <i class="fas fa-info-circle"></i>
                ${diagnosis.disclaimer || '此分析仅供参考，请以医生诊断为准'}
            </div>
        `;
    }

    async function compareDiagnosis() {
        const doctorDiagnosisText = doctorDiagnosis.value.trim();
        
        if (!doctorDiagnosisText) {
            showNotification('请输入医生的诊断内容', 'warning');
            return;
        }

        if (!currentAnalysisData || !currentAnalysisData.ai_diagnosis) {
            showNotification('请先完成AI分析', 'warning');
            return;
        }

        compareBtn.disabled = true;
        compareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 对比分析中...';

        try {
            const aiDiagnosisText = JSON.stringify(currentAnalysisData.ai_diagnosis, null, 2);
            
            const response = await fetch(`http://${window.location.hostname}:5000/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ai_diagnosis: aiDiagnosisText,
                    doctor_diagnosis: doctorDiagnosisText
                })
            });

            if (!response.ok) {
                throw new Error('对比分析请求失败');
            }

            const data = await response.json();
            
            if (data.success) {
                renderComparisonResults(data.comparison_data);
                comparisonResults.style.display = 'block';
                showNotification('对比分析完成', 'success');
            } else {
                throw new Error(data.error || '对比分析失败');
            }

        } catch (error) {
            showNotification(`对比分析失败: ${error.message}`, 'error');
            console.error('对比分析错误:', error);
        } finally {
            compareBtn.disabled = false;
            compareBtn.innerHTML = '<i class="fas fa-search"></i> 开始对比分析';
        }
    }

    function renderComparisonResults(comparisonData) {
        const agreementLevel = comparisonData.comparison_summary.agreement_level;
        const agreementPercentage = comparisonData.comparison_summary.agreement_percentage;
        
        comparisonResults.innerHTML = `
            <div class="comparison-header">
                <h4><i class="fas fa-chart-pie"></i> 对比分析结果</h4>
                <div class="agreement-indicator ${agreementLevel}">
                    <span class="agreement-percentage">${agreementPercentage}%</span>
                    <span class="agreement-level">${getAgreementText(agreementLevel)}</span>
                </div>
            </div>
            
            <div class="comparison-details">
                <div class="comparison-section">
                    <h5><i class="fas fa-check-circle"></i> 一致点</h5>
                    <ul class="agreement-list">
                        ${(comparisonData.detailed_comparison.agreements || []).map(agreement => 
                            `<li>${agreement}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> 差异点</h5>
                    <div class="differences-list">
                        ${(comparisonData.detailed_comparison.differences || []).map(diff => `
                            <div class="difference-item">
                                <div class="diff-aspect">${diff.aspect}</div>
                                <div class="diff-views">
                                    <div class="diff-view ai">
                                        <strong>AI观点:</strong> ${diff.ai_view}
                                    </div>
                                    <div class="diff-view doctor">
                                        <strong>医生观点:</strong> ${diff.doctor_view}
                                    </div>
                                </div>
                                <div class="diff-analysis">${diff.analysis}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="comparison-insights">
                    <div class="insights-section">
                        <h5><i class="fas fa-thumbs-up"></i> AI诊断优势</h5>
                        <ul>
                            ${(comparisonData.insights.ai_strengths || []).map(strength => 
                                `<li>${strength}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="insights-section">
                        <h5><i class="fas fa-exclamation-circle"></i> AI诊断局限</h5>
                        <ul>
                            ${(comparisonData.insights.ai_limitations || []).map(limitation => 
                                `<li>${limitation}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="comparison-conclusion">
                    <h5><i class="fas fa-lightbulb"></i> 总结</h5>
                    <p>${comparisonData.conclusion}</p>
                </div>
            </div>
        `;
    }

    function resetToUpload() {
        selectedFilesList = [];
        imageUpload.value = '';
        currentAnalysisData = null;
        uploadPage.style.display = 'flex';
        analysisPage.style.display = 'none';
        displayImagePreviews(); // 重置预览状态
        doctorDiagnosis.value = '';
        comparisonResults.style.display = 'none';
    }

    function exportReport() {
        if (!currentAnalysisData) {
            showNotification('没有可导出的报告数据', 'warning');
            return;
        }

        // 创建导出内容
        const exportContent = generateExportContent(currentAnalysisData);
        
        // 创建并下载文件
        const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `医疗报告分析_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('报告已导出', 'success');
    }

    function generateExportContent(analysisData) {
        const summary = analysisData.report_summary;
        const diagnosis = analysisData.ai_diagnosis;
        
        return `
Double Medical Check - 医疗报告分析结果
=====================================

报告概览:
- 检测项目总数: ${summary.total_items || 0}
- 异常项目数量: ${summary.abnormal_items || 0}
- 检测日期: ${summary.report_date || '未识别'}

AI诊断建议:
可能的疾病或状况:
${(diagnosis.possible_conditions || []).map(c => `- ${c}`).join('\n')}

建议:
${(diagnosis.recommendations || []).map(r => `- ${r}`).join('\n')}

紧急程度: ${getUrgencyText(diagnosis.urgency_level)}

免责声明: ${diagnosis.disclaimer || '此分析仅供参考，请以医生诊断为准'}

导出时间: ${new Date().toLocaleString()}
        `.trim();
    }

    // 辅助函数
    function getSeverityText(severity) {
        const map = {
            'mild': '轻度',
            'moderate': '中度',
            'severe': '重度'
        };
        return map[severity] || '未知';
    }

    function getStatusText(status) {
        const map = {
            'normal': '正常',
            'high': '偏高',
            'low': '偏低',
            'mild': '轻度',
            'moderate': '中度',
            'severe': '重度'
        };
        return map[status] || '正常';
    }

    function getUrgencyText(urgency) {
        const map = {
            'low': '低',
            'medium': '中等',
            'high': '高'
        };
        return map[urgency] || '中等';
    }

    function getAgreementText(level) {
        const map = {
            'high': '高度一致',
            'medium': '部分一致',
            'low': '差异较大'
        };
        return map[level] || '部分一致';
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});