# دليل نظام رفع الصور
# Image Upload System Guide

## 📸 نظرة عامة

نظام رفع الصور في هذا المشروع يسمح للمستخدمين برفع صور السيارات واللوحات للتحليل والتخزين. هذا الدليل يشرح كيفية استخدام النظام بشكل آمن.

---

## ✨ الميزات الحالية

### 1. رفع الصور - Image Upload
- ✅ رفع صور متعددة في نفس الوقت
- ✅ معاينة الصور قبل الرفع
- ✅ دعم السحب والإفلات (Drag & Drop)
- ✅ التحقق من نوع الملف
- ⚠️ يحتاج: التحقق الأمني المتقدم

### 2. الصفحات التي تدعم رفع الصور
- **advanced_vehicle_analyzer.html** - تحليل صور السيارات
- **plate_recognition.html** - التعرف على اللوحات

---

## 🔒 التحسينات الأمنية الجديدة

### ملف الأمان الجديد: `image-upload-security.js`

تم إنشاء نظام أمان شامل يتضمن:

#### 1. التحقق من نوع الملف
- ✅ قبول JPG, PNG, GIF, WEBP فقط
- ✅ رفض أنواع الملفات الخطرة
- ✅ التحقق من MIME type والامتداد

#### 2. التحقق من حجم الملف
- ✅ حد أقصى 5 MB (قابل للتخصيص)
- ✅ تحذير للملفات الكبيرة
- ✅ رفض الملفات الكبيرة جداً

#### 3. التحقق من أبعاد الصورة
- ✅ حد أقصى: 4096x4096 بكسل
- ✅ حد أدنى: 100x100 بكسل
- ✅ تحذيرات للصور الكبيرة

#### 4. التحقق من المحتوى
- ✅ التأكد من أن الملف صورة حقيقية
- ✅ منع رفع ملفات تنفيذية متنكرة

#### 5. تنظيف أسماء الملفات
- ✅ إزالة الأحرف الخطرة
- ✅ منع Path Traversal attacks
- ✅ إنشاء أسماء ملفات آمنة

#### 6. ضغط الصور
- ✅ تقليل حجم الصور تلقائياً
- ✅ الحفاظ على الجودة
- ✅ تحسين الأداء

---

## 🚀 كيفية الاستخدام

### الخطوة 1: إضافة السكريبت للصفحة

في أي صفحة HTML تريد إضافة رفع الصور، أضف:

```html
<!-- قبل نهاية </body> -->
<script src="image-upload-security.js"></script>
```

### الخطوة 2: استخدام نظام الأمان

#### مثال أساسي:

```javascript
// الحصول على input الملفات
const fileInput = document.getElementById('fileInput');

// التعامل مع اختيار الملفات
fileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    
    // التحقق من الملفات
    for (let file of files) {
        const validation = await imageUploadSecurity.validateFile(file);
        
        if (validation.valid) {
            console.log('✓ الملف صالح:', validation.sanitizedName);
            
            // عرض التحذيرات إن وجدت
            if (validation.warnings.length > 0) {
                console.warn('تحذيرات:', validation.warnings);
            }
            
            // متابعة رفع الملف أو معالجته
            await uploadFile(file);
        } else {
            console.error('✗ الملف غير صالح:', validation.errors);
            alert('خطأ في الملف:\n' + validation.errors.join('\n'));
        }
    }
});
```

#### مثال متقدم مع الضغط:

```javascript
fileInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    
    for (let file of files) {
        // 1. التحقق من الملف
        const validation = await imageUploadSecurity.validateFile(file);
        
        if (!validation.valid) {
            alert('خطأ: ' + validation.errors.join('\n'));
            continue;
        }
        
        // 2. ضغط الصورة إذا كانت كبيرة
        let processedFile = file;
        if (file.size > 1024 * 1024) { // أكبر من 1 MB
            console.log('جاري ضغط الصورة...');
            processedFile = await imageUploadSecurity.compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.85
            });
            console.log('تم الضغط من', file.size, 'إلى', processedFile.size);
        }
        
        // 3. إنشاء اسم ملف آمن وفريد
        const safeName = imageUploadSecurity.generateSafeFilename(file.name);
        
        // 4. رفع الملف
        await uploadFileToServer(processedFile, safeName);
    }
});
```

#### مثال: التحقق من ملفات متعددة دفعة واحدة:

```javascript
async function validateAndProcessFiles(files) {
    // التحقق من جميع الملفات دفعة واحدة
    const validations = await imageUploadSecurity.validateMultipleFiles(files);
    
    const validFiles = [];
    const errors = [];
    
    validations.forEach((validation, index) => {
        if (validation.valid) {
            validFiles.push(files[index]);
        } else {
            errors.push({
                file: files[index].name,
                errors: validation.errors
            });
        }
    });
    
    // عرض الأخطاء
    if (errors.length > 0) {
        console.error('ملفات غير صالحة:', errors);
        alert(`فشل التحقق من ${errors.length} ملف(ات)`);
    }
    
    // معالجة الملفات الصالحة
    for (let file of validFiles) {
        await processFile(file);
    }
    
    return {
        valid: validFiles.length,
        invalid: errors.length
    };
}
```

### الخطوة 3: تخصيص الإعدادات

يمكنك إنشاء نسخة مخصصة بإعدادات مختلفة:

```javascript
const customSecurity = new ImageUploadSecurity({
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowedTypes: ['image/jpeg', 'image/png'], // JPG و PNG فقط
    maxWidth: 2048,
    maxHeight: 2048,
    minWidth: 200,
    minHeight: 200,
    checkDimensions: true,
    sanitizeFilename: true
});

// استخدام النسخة المخصصة
const validation = await customSecurity.validateFile(file);
```

---

## 🛡️ أفضل الممارسات الأمنية

### 1. في Frontend (الواجهة الأمامية)

```javascript
// ✅ صحيح: التحقق قبل المعالجة
async function handleUpload(file) {
    // التحقق من الملف
    const validation = await imageUploadSecurity.validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }
    
    // ضغط الصورة
    const compressed = await imageUploadSecurity.compressImage(file);
    
    // رفع الملف
    return await uploadToServer(compressed);
}

// ❌ خطأ: الرفع بدون تحقق
async function badHandleUpload(file) {
    return await uploadToServer(file); // خطر أمني!
}
```

### 2. في Backend (الخادم)

**⚠️ مهم جداً:** يجب التحقق من الملفات في الخادم أيضاً!

```php
// مثال PHP
<?php
function validateUploadedImage($file) {
    // 1. التحقق من نوع الملف
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('نوع الملف غير مدعوم');
    }
    
    // 2. التحقق من حجم الملف
    $maxSize = 5 * 1024 * 1024; // 5 MB
    if ($file['size'] > $maxSize) {
        throw new Exception('حجم الملف كبير جداً');
    }
    
    // 3. التحقق من أن الملف صورة حقيقية
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        throw new Exception('الملف ليس صورة صالحة');
    }
    
    // 4. تنظيف اسم الملف
    $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
    $safeName = time() . '_' . $safeName;
    
    // 5. نقل الملف
    $uploadPath = 'uploads/' . $safeName;
    move_uploaded_file($file['tmp_name'], $uploadPath);
    
    return $uploadPath;
}
?>
```

### 3. تكوين الخادم

#### Apache (.htaccess):
```apache
# منع تنفيذ السكريبتات في مجلد الرفع
<Directory "/var/www/html/uploads">
    Options -ExecCGI
    php_flag engine off
    AddType text/plain .php .php3 .php4 .php5 .phtml
</Directory>

# السماح بالصور فقط
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Allow from all
</FilesMatch>
```

#### Nginx:
```nginx
location /uploads/ {
    # منع تنفيذ PHP
    location ~ \.php$ {
        deny all;
    }
    
    # السماح بالصور فقط
    location ~* \.(jpg|jpeg|png|gif|webp)$ {
        allow all;
    }
}
```

---

## 📊 أمثلة عملية

### مثال 1: صفحة رفع بسيطة

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>رفع الصور</title>
</head>
<body>
    <h1>رفع صورة</h1>
    
    <input type="file" id="imageInput" accept="image/*">
    <button onclick="handleUpload()">رفع</button>
    
    <div id="result"></div>
    
    <script src="image-upload-security.js"></script>
    <script>
        async function handleUpload() {
            const input = document.getElementById('imageInput');
            const result = document.getElementById('result');
            
            if (input.files.length === 0) {
                alert('اختر صورة أولاً');
                return;
            }
            
            const file = input.files[0];
            
            // التحقق من الملف
            const validation = await imageUploadSecurity.validateFile(file);
            
            if (!validation.valid) {
                result.innerHTML = '<p style="color: red;">خطأ: ' + 
                    validation.errors.join('<br>') + '</p>';
                return;
            }
            
            // عرض النتيجة
            result.innerHTML = '<p style="color: green;">✓ الملف صالح!</p>';
            
            if (validation.warnings.length > 0) {
                result.innerHTML += '<p style="color: orange;">تحذيرات:<br>' + 
                    validation.warnings.join('<br>') + '</p>';
            }
            
            // هنا يمكنك رفع الملف للخادم
            console.log('جاهز للرفع:', validation.sanitizedName);
        }
    </script>
</body>
</html>
```

### مثال 2: رفع متعدد مع معاينة

```html
<div class="upload-container">
    <input type="file" id="multipleFiles" multiple accept="image/*">
    <div id="previews"></div>
    <button onclick="uploadAll()">رفع الكل</button>
</div>

<script src="image-upload-security.js"></script>
<script>
    const selectedFiles = [];
    
    document.getElementById('multipleFiles').addEventListener('change', async (e) => {
        const previews = document.getElementById('previews');
        previews.innerHTML = '';
        selectedFiles.length = 0;
        
        for (let file of e.target.files) {
            const validation = await imageUploadSecurity.validateFile(file);
            
            const div = document.createElement('div');
            div.className = 'preview-item';
            
            if (validation.valid) {
                selectedFiles.push(file);
                
                // إنشاء معاينة
                const reader = new FileReader();
                reader.onload = (e) => {
                    div.innerHTML = `
                        <img src="${e.target.result}" style="width: 100px;">
                        <p>✓ ${validation.sanitizedName}</p>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                div.innerHTML = `
                    <p style="color: red;">✗ ${file.name}</p>
                    <p>${validation.errors.join('<br>')}</p>
                `;
            }
            
            previews.appendChild(div);
        }
    });
    
    async function uploadAll() {
        console.log('رفع', selectedFiles.length, 'ملف...');
        
        for (let file of selectedFiles) {
            // ضغط وحفظ
            const compressed = await imageUploadSecurity.compressImage(file);
            console.log('تم ضغط:', file.name, 
                'من', file.size, 'إلى', compressed.size);
            
            // هنا: رفع للخادم
            // await uploadToServer(compressed);
        }
        
        alert('تم الرفع بنجاح!');
    }
</script>
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: "الملف ليس صورة صالحة"
**الحل:**
- تأكد من أن الملف صورة حقيقية (JPG, PNG, إلخ)
- تحقق من عدم تلف الملف
- حاول فتح الصورة في برنامج تحرير صور

### المشكلة: "حجم الملف كبير جداً"
**الحل:**
```javascript
// استخدم الضغط التلقائي
const compressed = await imageUploadSecurity.compressImage(file, {
    maxWidth: 1920,
    quality: 0.8
});
```

### المشكلة: "نوع الملف غير مدعوم"
**الحل:**
- تأكد من رفع صور فقط (JPG, PNG, GIF, WEBP)
- تحقق من امتداد الملف
- لا ترفع ملفات PDF أو DOC

---

## 📋 قائمة التحقق الأمنية

قبل النشر للإنتاج:

### Frontend:
- [ ] تم إضافة `image-upload-security.js` لجميع صفحات الرفع
- [ ] يتم التحقق من جميع الملفات قبل المعالجة
- [ ] يتم ضغط الصور الكبيرة تلقائياً
- [ ] يتم تنظيف أسماء الملفات
- [ ] يتم عرض رسائل خطأ واضحة للمستخدم

### Backend:
- [ ] يتم التحقق من الملفات في الخادم أيضاً
- [ ] لا يتم تنفيذ السكريبتات من مجلد الرفع
- [ ] يتم حفظ الملفات خارج مجلد الويب الرئيسي
- [ ] يتم استخدام أسماء ملفات عشوائية
- [ ] يتم تحديد حجم رفع مناسب

### الخادم:
- [ ] تم تكوين Apache/Nginx لمنع التنفيذ
- [ ] تم تحديد أنواع MIME المسموحة
- [ ] تم تفعيل CORS بشكل صحيح
- [ ] يتم مسح الملفات القديمة تلقائياً

---

## 🚀 التكامل مع قاعدة البيانات السحابية

### Firebase Storage:

```javascript
async function uploadToFirebase(file) {
    // التحقق والضغط
    const validation = await imageUploadSecurity.validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }
    
    const compressed = await imageUploadSecurity.compressImage(file);
    const safeName = imageUploadSecurity.generateSafeFilename(file.name);
    
    // رفع إلى Firebase
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`images/vehicles/${safeName}`);
    
    const snapshot = await imageRef.put(compressed);
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    return {
        url: downloadURL,
        name: safeName,
        size: compressed.size
    };
}
```

### Supabase Storage:

```javascript
async function uploadToSupabase(file) {
    // التحقق والضغط
    const validation = await imageUploadSecurity.validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }
    
    const compressed = await imageUploadSecurity.compressImage(file);
    const safeName = imageUploadSecurity.generateSafeFilename(file.name);
    
    // رفع إلى Supabase
    const { data, error } = await supabaseClient.storage
        .from('images')
        .upload(`vehicles/${safeName}`, compressed);
    
    if (error) throw error;
    
    const { publicURL } = supabaseClient.storage
        .from('images')
        .getPublicUrl(`vehicles/${safeName}`);
    
    return {
        url: publicURL,
        name: safeName,
        size: compressed.size
    };
}
```

---

## 📚 موارد إضافية

- [OWASP File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**آخر تحديث:** 13 نوفمبر 2025  
**الإصدار:** 1.0  
**الحالة:** جاهز للاستخدام
