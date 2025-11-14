/**
 * نظام كشف التغييرات غير المحفوظة
 * Unsaved Changes Detection System
 * @version 1.0.0
 * 
 * هذا النظام يحمي المستخدم من فقدان البيانات عن طريق:
 * 1. تتبع التغييرات في النماذج
 * 2. تحذير المستخدم قبل مغادرة الصفحة
 * 3. تعطيل التحذير عند الحفظ الناجح
 */

class UnsavedChangesDetector {
    constructor() {
        this.hasUnsavedChanges = false;
        this.trackedForms = new Set();
        this.originalFormData = new Map();
        this.isEnabled = true;
        this.customMessage = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟';
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        // إضافة مستمع لحدث beforeunload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges && this.isEnabled) {
                // معظم المتصفحات الحديثة تتجاهل الرسالة المخصصة وتستخدم رسالة افتراضية
                e.preventDefault();
                e.returnValue = ''; // Chrome requires returnValue to be set
                return '';
            }
        });
    }

    /**
     * تتبع نموذج معين
     * @param {HTMLFormElement|string} formElement - عنصر النموذج أو معرفه
     */
    trackForm(formElement) {
        const form = typeof formElement === 'string' 
            ? document.getElementById(formElement) 
            : formElement;
        
        if (!form || !(form instanceof HTMLFormElement)) {
            console.error('Invalid form element:', formElement);
            return;
        }

        // حفظ البيانات الأصلية
        this.saveOriginalFormData(form);

        // إضافة النموذج إلى قائمة التتبع
        this.trackedForms.add(form);

        // تتبع التغييرات في جميع حقول النموذج
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            ['input', 'change'].forEach(eventType => {
                input.addEventListener(eventType, () => {
                    this.checkForChanges(form);
                });
            });
        });
    }

    /**
     * حفظ البيانات الأصلية للنموذج
     * @param {HTMLFormElement} form
     */
    saveOriginalFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        this.originalFormData.set(form, data);
    }

    /**
     * التحقق من وجود تغييرات
     * @param {HTMLFormElement} form
     */
    checkForChanges(form) {
        const originalData = this.originalFormData.get(form);
        if (!originalData) return;

        const currentData = new FormData(form);
        let hasChanges = false;

        // التحقق من كل حقل
        for (let [key, originalValue] of Object.entries(originalData)) {
            const currentValue = currentData.get(key) || '';
            if (originalValue !== currentValue) {
                hasChanges = true;
                break;
            }
        }

        // التحقق من الحقول الجديدة
        for (let [key, value] of currentData.entries()) {
            if (!(key in originalData) && value !== '') {
                hasChanges = true;
                break;
            }
        }

        this.setUnsavedChanges(hasChanges);
    }

    /**
     * تعيين حالة التغييرات غير المحفوظة
     * @param {boolean} hasChanges
     */
    setUnsavedChanges(hasChanges) {
        this.hasUnsavedChanges = hasChanges;
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('unsavedChangesChanged', { 
            detail: { hasUnsavedChanges: hasChanges } 
        });
        window.dispatchEvent(event);
    }

    /**
     * إعادة تعيين التتبع (استخدم بعد الحفظ الناجح)
     * @param {HTMLFormElement|string} formElement
     */
    markAsSaved(formElement = null) {
        if (formElement) {
            const form = typeof formElement === 'string' 
                ? document.getElementById(formElement) 
                : formElement;
            
            if (form) {
                this.saveOriginalFormData(form);
            }
        } else {
            // إعادة تعيين جميع النماذج
            this.trackedForms.forEach(form => {
                this.saveOriginalFormData(form);
            });
        }
        
        this.setUnsavedChanges(false);
    }

    /**
     * إعادة تعيين النموذج
     * @param {HTMLFormElement|string} formElement
     */
    resetForm(formElement) {
        const form = typeof formElement === 'string' 
            ? document.getElementById(formElement) 
            : formElement;
        
        if (form) {
            form.reset();
            this.saveOriginalFormData(form);
            this.setUnsavedChanges(false);
        }
    }

    /**
     * تعطيل/تفعيل التحذيرات
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    /**
     * التحقق من وجود تغييرات غير محفوظة
     * @returns {boolean}
     */
    hasChanges() {
        return this.hasUnsavedChanges;
    }

    /**
     * مسح التتبع لنموذج معين
     * @param {HTMLFormElement|string} formElement
     */
    untrackForm(formElement) {
        const form = typeof formElement === 'string' 
            ? document.getElementById(formElement) 
            : formElement;
        
        if (form) {
            this.trackedForms.delete(form);
            this.originalFormData.delete(form);
            
            // إعادة التحقق من الحالة العامة
            if (this.trackedForms.size === 0) {
                this.setUnsavedChanges(false);
            }
        }
    }

    /**
     * تأكيد المغادرة مع رسالة مخصصة
     * @param {string} message - رسالة التأكيد
     * @returns {boolean} - true إذا وافق المستخدم على المغادرة
     */
    confirmNavigation(message = null) {
        if (!this.hasUnsavedChanges) {
            return true;
        }
        
        const confirmMessage = message || this.customMessage;
        return confirm(confirmMessage);
    }

    /**
     * حماية الروابط والأزرار من الملاحة غير المحفوظة
     * @param {string} selector - محدد CSS للعناصر المراد حمايتها
     */
    protectNavigation(selector = 'a, button[type="button"]') {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('click', (e) => {
                if (this.hasUnsavedChanges && this.isEnabled) {
                    if (!this.confirmNavigation()) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
            });
        });
    }
}

// إنشاء نسخة عامة
window.unsavedChangesDetector = new UnsavedChangesDetector();

// دالة مساعدة للاستخدام السريع
window.trackFormChanges = function(formId) {
    window.unsavedChangesDetector.trackForm(formId);
};

// دالة مساعدة لوضع علامة على النموذج كمحفوظ
window.markFormAsSaved = function(formId = null) {
    window.unsavedChangesDetector.markAsSaved(formId);
};

// دالة مساعدة للتحقق من وجود تغييرات
window.hasUnsavedChanges = function() {
    return window.unsavedChangesDetector.hasChanges();
};
