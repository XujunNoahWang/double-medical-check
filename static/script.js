document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const languageSelector = document.getElementById('languageSelector');
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
    const appTitle = document.getElementById('appTitle');

    let selectedFilesList = [];
    let analyzeTimerInterval = null;
    let analyzeTimerStart = null;
    let currentAnalysisData = null;
    let currentLanguage = 'zh';
    let translations = {};

    // 初始化
    initEventListeners();
    initTheme();
    initI18n();

    function initEventListeners() {
        // 主题切换
        themeToggle.addEventListener('click', toggleTheme);
        
        // 语言切换
        languageSelector.addEventListener('change', changeLanguage);
        
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
        
        // 标题点击回到主页
        appTitle.addEventListener('click', goToHomePage);
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
            showNotification(t('messages.no_files'), 'warning');
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
            timerEl.textContent = t('analysis.loading_timer', { time: '0.0' });
            analyzeTimerStart = Date.now();
            if (analyzeTimerInterval) clearInterval(analyzeTimerInterval);
            analyzeTimerInterval = setInterval(() => {
                const elapsed = ((Date.now() - analyzeTimerStart) / 1000).toFixed(1);
                timerEl.textContent = t('analysis.loading_timer', { time: elapsed });
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
            showError(t('messages.no_files'));
            return;
        }

        const formData = new FormData();
        selectedFilesList.forEach(file => {
            formData.append('images', file);
        });

        // 检测是否在本地开发环境
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const backendUrl = isLocalDev ? `http://${window.location.hostname}:5000/analyze` : '/analyze';

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
                <div class="stat-label">${t('analysis.total_items')}</div>
            </div>
            <div class="stat-card abnormal">
                <div class="stat-number">${summary.abnormal_items || 0}</div>
                <div class="stat-label">${t('analysis.abnormal_items')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-text">${summary.report_date || t('analysis.not_identified')}</div>
                <div class="stat-label">${t('analysis.test_date')}</div>
            </div>
        `;
    }

    function renderTestCategories(categories) {
        const testCategories = document.getElementById('testCategories');
        
        if (!categories || categories.length === 0) {
            testCategories.innerHTML = `<p class="no-data">${t('analysis.no_data')}</p>`;
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
                                <span class="reference-label">${t('analysis.reference') || '参考:'}</span>
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
                <span>${t('diagnosis.urgency')}: ${urgencyText}</span>
            </div>
            
            <div class="diagnosis-section">
                <h4><i class="fas fa-search"></i> ${t('diagnosis.possible_conditions')}</h4>
                <ul class="diagnosis-list">
                    ${(diagnosis.possible_conditions || []).map(condition => 
                        `<li>${condition}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="diagnosis-section">
                <h4><i class="fas fa-clipboard-list"></i> ${t('diagnosis.recommendations')}</h4>
                <ul class="recommendations-list">
                    ${(diagnosis.recommendations || []).map(recommendation => 
                        `<li>${recommendation}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="diagnosis-disclaimer">
                <i class="fas fa-info-circle"></i>
                ${diagnosis.disclaimer || t('diagnosis.disclaimer')}
            </div>
        `;
    }

    async function compareDiagnosis() {
        const doctorDiagnosisText = doctorDiagnosis.value.trim();
        
        if (!doctorDiagnosisText) {
            showNotification(t('messages.enter_doctor_diagnosis'), 'warning');
            return;
        }

        if (!currentAnalysisData || !currentAnalysisData.ai_diagnosis) {
            showNotification(t('messages.complete_ai_analysis'), 'warning');
            return;
        }

        compareBtn.disabled = true;
        compareBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('comparison.comparing')}`;

        try {
            const aiDiagnosisText = JSON.stringify(currentAnalysisData.ai_diagnosis, null, 2);
            
            const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const compareUrl = isLocalDev ? `http://${window.location.hostname}:5000/compare` : '/compare';
            const response = await fetch(compareUrl, {
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
                throw new Error(t('errors.comparison_failed'));
            }

            const data = await response.json();
            
            if (data.success) {
                renderComparisonResults(data.comparison_data);
                comparisonResults.style.display = 'block';
                showNotification(t('messages.comparison_complete'), 'success');
            } else {
                throw new Error(data.error || t('errors.comparison_failed'));
            }

        } catch (error) {
            showNotification(`${t('errors.comparison_error', { error: error.message })}`, 'error');
            console.error('对比分析错误:', error);
        } finally {
            compareBtn.disabled = false;
            compareBtn.innerHTML = `<i class="fas fa-search"></i> ${t('comparison.compare_button')}`;
        }
    }

    function renderComparisonResults(comparisonData) {
        const agreementLevel = comparisonData.comparison_summary.agreement_level;
        const agreementPercentage = comparisonData.comparison_summary.agreement_percentage;
        
        comparisonResults.innerHTML = `
            <div class="comparison-header">
                <h4><i class="fas fa-chart-pie"></i> ${t('comparison.results_title')}</h4>
                <div class="agreement-indicator ${agreementLevel}">
                    <span class="agreement-percentage">${agreementPercentage}%</span>
                    <span class="agreement-level">${getAgreementText(agreementLevel)}</span>
                </div>
            </div>
            
            <div class="comparison-details">
                <div class="comparison-section">
                    <h5><i class="fas fa-check-circle"></i> ${t('comparison.agreements')}</h5>
                    <ul class="agreement-list">
                        ${(comparisonData.detailed_comparison.agreements || []).map(agreement => 
                            `<li>${agreement}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> ${t('comparison.differences')}</h5>
                    <div class="differences-list">
                        ${(comparisonData.detailed_comparison.differences || []).map(diff => `
                            <div class="difference-item">
                                <div class="diff-aspect">${diff.aspect}</div>
                                <div class="diff-views">
                                    <div class="diff-view ai">
                                        <strong>${t('comparison.ai_view')}:</strong> ${diff.ai_view}
                                    </div>
                                    <div class="diff-view doctor">
                                        <strong>${t('comparison.doctor_view')}:</strong> ${diff.doctor_view}
                                    </div>
                                </div>
                                <div class="diff-analysis">${diff.analysis}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="comparison-insights">
                    <div class="insights-section">
                        <h5><i class="fas fa-thumbs-up"></i> ${t('comparison.ai_strengths')}</h5>
                        <ul>
                            ${(comparisonData.insights.ai_strengths || []).map(strength => 
                                `<li>${strength}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="insights-section">
                        <h5><i class="fas fa-exclamation-circle"></i> ${t('comparison.ai_limitations')}</h5>
                        <ul>
                            ${(comparisonData.insights.ai_limitations || []).map(limitation => 
                                `<li>${limitation}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="comparison-conclusion">
                    <h5><i class="fas fa-lightbulb"></i> ${t('comparison.conclusion')}</h5>
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

    function goToHomePage() {
        // 回到主页，重置所有状态
        resetToUpload();
    }

    function exportReport() {
        if (!currentAnalysisData) {
            showNotification(t('messages.no_export_data'), 'warning');
            return;
        }

        // 创建导出内容
        const exportContent = generateExportContent(currentAnalysisData);
        
        // 创建并下载文件
        const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('export.title')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(t('messages.export_success'), 'success');
    }

    function generateExportContent(analysisData) {
        const summary = analysisData.report_summary;
        const diagnosis = analysisData.ai_diagnosis;
        return `
${t('export.title')}
=====================================

${t('export.overview')}:
- ${t('analysis.total_items')}: ${summary.total_items || 0}
- ${t('analysis.abnormal_items')}: ${summary.abnormal_items || 0}
- ${t('analysis.test_date')}: ${summary.report_date || t('analysis.not_identified')}

${t('export.ai_diagnosis')}:
${t('diagnosis.possible_conditions')}:
${(diagnosis.possible_conditions || []).map(c => `- ${c}`).join('\n')}

${t('diagnosis.recommendations')}:
${(diagnosis.recommendations || []).map(r => `- ${r}`).join('\n')}

${t('diagnosis.urgency')}: ${getUrgencyText(diagnosis.urgency_level)}

${t('diagnosis.disclaimer')}: ${diagnosis.disclaimer || t('diagnosis.disclaimer')}

${t('export.export_time')}: ${new Date().toLocaleString()}
        `.trim();
    }

    // 辅助函数
    function getSeverityText(severity) {
        const map = {
            'mild': t('status.mild'),
            'moderate': t('status.moderate'),
            'severe': t('status.severe')
        };
        return map[severity] || t('status.unknown') || '未知';
    }

    function getStatusText(status) {
        const map = {
            'normal': t('status.normal'),
            'high': t('status.high'),
            'low': t('status.low'),
            'mild': t('status.mild'),
            'moderate': t('status.moderate'),
            'severe': t('status.severe')
        };
        return map[status] || t('status.normal');
    }

    function getUrgencyText(urgency) {
        const map = {
            'low': t('diagnosis.urgency_levels.low'),
            'medium': t('diagnosis.urgency_levels.medium'),
            'high': t('diagnosis.urgency_levels.high')
        };
        return map[urgency] || t('diagnosis.urgency_levels.medium');
    }

    function getAgreementText(level) {
        const map = {
            'high': t('comparison.agreement_levels.high'),
            'medium': t('comparison.agreement_levels.medium'),
            'low': t('comparison.agreement_levels.low')
        };
        return map[level] || t('comparison.agreement_levels.medium');
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

    // 国际化相关函数
    async function initI18n() {
        // 从localStorage获取保存的语言设置
        const savedLanguage = localStorage.getItem('language') || 'zh';
        currentLanguage = savedLanguage;
        languageSelector.value = currentLanguage;
        
        // 加载翻译
        await loadTranslations();
        
        // 应用翻译
        applyTranslations();
        
        // 更新HTML lang属性
        document.getElementById('html-root').lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    }

    async function loadTranslations() {
        try {
            const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const translationsUrl = isLocalDev ? `http://${window.location.hostname}:5000/translations?lang=${currentLanguage}` : `/translations?lang=${currentLanguage}`;
            const response = await fetch(translationsUrl, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                translations = data.translations;
            }
        } catch (error) {
            console.error('加载翻译失败:', error);
        }
    }

    async function changeLanguage() {
        const newLanguage = languageSelector.value;
        if (newLanguage === currentLanguage) return;


        try {
            // 发送语言切换请求到后端
            const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const setLanguageUrl = isLocalDev ? `http://${window.location.hostname}:5000/set-language` : '/set-language';
            const response = await fetch(setLanguageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: newLanguage }),
                credentials: 'include'
            });

            if (response.ok) {
                currentLanguage = newLanguage;
                localStorage.setItem('language', currentLanguage);
                window.location.reload();
            }
        } catch (error) {
            console.error('语言切换失败:', error);
            languageSelector.value = currentLanguage; // 恢复原来的选择
        }
    }

    function applyTranslations() {
        // 应用data-i18n属性的翻译
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getTranslation(key);
            if (!translation) return;
            // 针对 <title> 标签
            if (element.tagName === 'TITLE') {
                document.title = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 应用placeholder翻译
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // 应用alt翻译
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = getTranslation(key);
            if (translation) {
                element.alt = translation;
            }
        });

        // 应用aria-label翻译
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            const translation = getTranslation(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });

        // 特殊处理上传提示列表
        const uploadTipsList = document.getElementById('uploadTipsList');
        if (uploadTipsList && translations.upload && translations.upload.tips) {
            uploadTipsList.innerHTML = '';
            translations.upload.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                uploadTipsList.appendChild(li);
            });
        }
    }

    function getTranslation(key) {
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    function t(key, params = {}) {
        let translation = getTranslation(key);
        if (!translation) return key;
        
        // 参数替换
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
});