/**
 * نظام أمان رفع الصور
 * Image Upload Security Module
 * @version 1.0.0
 * 
 * يوفر هذا الملف وظائف التحقق من أمان الصور المرفوعة
 * This module provides security validation for uploaded images
 */

class ImageUploadSecurity {
    constructor(options = {}) {
        // الإعدادات الافتراضية
        this.config = {
            maxFileSize: options.maxFileSize || 5 * 1024 * 1024, // 5 MB default
            allowedTypes: options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            maxWidth: options.maxWidth || 4096,
            maxHeight: options.maxHeight || 4096,
            minWidth: options.minWidth || 100,
            minHeight: options.minHeight || 100,
            allowedExtensions: options.allowedExtensions || ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            checkDimensions: options.checkDimensions !== false, // true by default
            sanitizeFilename: options.sanitizeFilename !== false // true by default
        };
    }

    /**
     * التحقق من صحة الملف
     * Validate uploaded file
     * @param {File} file - الملف المراد التحقق منه
     * @returns {Promise<Object>} نتيجة التحقق
     */
    async validateFile(file) {
        const errors = [];
        const warnings = [];

        try {
            // 1. التحقق من وجود الملف
            if (!file) {
                errors.push('لم يتم اختيار ملف');
                return { valid: false, errors, warnings };
            }

            // 2. التحقق من نوع الملف
            if (!this.isValidFileType(file)) {
                errors.push(`نوع الملف غير مدعوم: ${file.type}. الأنواع المسموحة: JPG, PNG, GIF, WEBP`);
            }

            // 3. التحقق من امتداد الملف
            if (!this.isValidExtension(file.name)) {
                errors.push(`امتداد الملف غير صحيح. الامتدادات المسموحة: ${this.config.allowedExtensions.join(', ')}`);
            }

            // 4. التحقق من حجم الملف
            if (!this.isValidFileSize(file)) {
                errors.push(`حجم الملف يتجاوز الحد المسموح: ${this.formatFileSize(file.size)} / ${this.formatFileSize(this.config.maxFileSize)}`);
            }

            // 5. التحقق من اسم الملف (عدم وجود أحرف خطرة)
            if (this.config.sanitizeFilename) {
                const sanitized = this.sanitizeFilename(file.name);
                if (sanitized !== file.name) {
                    warnings.push('تم تنظيف اسم الملف من الأحرف الخطرة');
                }
            }

            // 6. التحقق من أبعاد الصورة (إذا كان مفعلاً)
            if (this.config.checkDimensions && errors.length === 0) {
                const dimensionResult = await this.validateDimensions(file);
                if (!dimensionResult.valid) {
                    errors.push(...dimensionResult.errors);
                }
                if (dimensionResult.warnings) {
                    warnings.push(...dimensionResult.warnings);
                }
            }

            // 7. التحقق من محتوى الملف (التأكد من أنه صورة حقيقية)
            if (errors.length === 0) {
                const contentResult = await this.validateImageContent(file);
                if (!contentResult.valid) {
                    errors.push('الملف لا يبدو كصورة صالحة');
                }
            }

            return {
                valid: errors.length === 0,
                errors,
                warnings,
                file: file,
                sanitizedName: this.sanitizeFilename(file.name)
            };

        } catch (error) {
            console.error('خطأ في التحقق من الملف:', error);
            return {
                valid: false,
                errors: ['حدث خطأ أثناء التحقق من الملف'],
                warnings
            };
        }
    }

    /**
     * التحقق من نوع الملف
     * Check if file type is allowed
     */
    isValidFileType(file) {
        return this.config.allowedTypes.includes(file.type);
    }

    /**
     * التحقق من امتداد الملف
     * Check if file extension is allowed
     */
    isValidExtension(filename) {
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return this.config.allowedExtensions.includes(ext);
    }

    /**
     * التحقق من حجم الملف
     * Check if file size is within limit
     */
    isValidFileSize(file) {
        return file.size <= this.config.maxFileSize;
    }

    /**
     * تنظيف اسم الملف من الأحرف الخطرة
     * Sanitize filename by removing dangerous characters
     */
    sanitizeFilename(filename) {
        // إزالة الأحرف الخطرة والمسافات
        let sanitized = filename.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_');
        
        // إزالة النقاط المتعددة المتتالية
        sanitized = sanitized.replace(/\.{2,}/g, '.');
        
        // التأكد من أن الاسم لا يبدأ بنقطة
        if (sanitized.startsWith('.')) {
            sanitized = 'file' + sanitized;
        }
        
        // تحديد الطول الأقصى لاسم الملف
        const maxLength = 255;
        if (sanitized.length > maxLength) {
            const ext = sanitized.substring(sanitized.lastIndexOf('.'));
            sanitized = sanitized.substring(0, maxLength - ext.length) + ext;
        }
        
        return sanitized;
    }

    /**
     * التحقق من أبعاد الصورة
     * Validate image dimensions
     */
    async validateDimensions(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.onload = () => {
                    const errors = [];
                    const warnings = [];
                    
                    if (img.width > this.config.maxWidth || img.height > this.config.maxHeight) {
                        errors.push(`أبعاد الصورة كبيرة جداً: ${img.width}x${img.height}. الحد الأقصى: ${this.config.maxWidth}x${this.config.maxHeight}`);
                    }
                    
                    if (img.width < this.config.minWidth || img.height < this.config.minHeight) {
                        errors.push(`أبعاد الصورة صغيرة جداً: ${img.width}x${img.height}. الحد الأدنى: ${this.config.minWidth}x${this.config.minHeight}`);
                    }
                    
                    // تحذير للصور الكبيرة جداً
                    if (img.width > 2048 || img.height > 2048) {
                        warnings.push('الصورة كبيرة الحجم. يُنصح بضغطها قبل الرفع لتحسين الأداء');
                    }
                    
                    resolve({
                        valid: errors.length === 0,
                        errors,
                        warnings,
                        dimensions: {
                            width: img.width,
                            height: img.height
                        }
                    });
                };
                
                img.onerror = () => {
                    resolve({
                        valid: false,
                        errors: ['فشل تحميل الصورة للتحقق من الأبعاد'],
                        warnings: []
                    });
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                resolve({
                    valid: false,
                    errors: ['فشل قراءة الملف'],
                    warnings: []
                });
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * التحقق من محتوى الصورة (التأكد من أنها صورة حقيقية)
     * Validate that file is actually an image
     */
    async validateImageContent(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.onload = () => {
                    resolve({ valid: true });
                };
                
                img.onerror = () => {
                    resolve({ valid: false });
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                resolve({ valid: false });
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * التحقق من عدة ملفات دفعة واحدة
     * Validate multiple files
     * @param {FileList|Array} files - قائمة الملفات
     * @returns {Promise<Array>} نتائج التحقق من جميع الملفات
     */
    async validateMultipleFiles(files) {
        const results = [];
        
        for (let file of files) {
            const result = await this.validateFile(file);
            results.push(result);
        }
        
        return results;
    }

    /**
     * تنسيق حجم الملف للعرض
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * إنشاء اسم ملف فريد وآمن
     * Generate unique and safe filename
     */
    generateSafeFilename(originalName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = originalName.substring(originalName.lastIndexOf('.'));
        const sanitized = this.sanitizeFilename(originalName.replace(ext, ''));
        
        return `${sanitized}_${timestamp}_${random}${ext}`;
    }

    /**
     * ضغط الصورة قبل الرفع
     * Compress image before upload
     * @param {File} file - الملف المراد ضغطه
     * @param {Object} options - خيارات الضغط
     * @returns {Promise<File>} الملف المضغوط
     */
    async compressImage(file, options = {}) {
        const maxWidth = options.maxWidth || 1920;
        const maxHeight = options.maxHeight || 1080;
        const quality = options.quality || 0.85;

        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // حساب الأبعاد الجديدة
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = width * ratio;
                        height = height * ratio;
                    }
                    
                    // إنشاء canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // تحويل إلى Blob
                    canvas.toBlob(
                        (blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        },
                        file.type,
                        quality
                    );
                };
                
                img.onerror = () => {
                    // في حالة الفشل، إرجاع الملف الأصلي
                    resolve(file);
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                resolve(file);
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// إنشاء نسخة عامة
window.imageUploadSecurity = new ImageUploadSecurity();

// تصدير الكلاس للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageUploadSecurity;
}
