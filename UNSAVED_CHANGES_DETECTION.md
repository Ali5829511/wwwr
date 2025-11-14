# نظام كشف التغييرات غير المحفوظة
# Unsaved Changes Detection System

## نظرة عامة / Overview

تم إضافة نظام شامل لكشف التغييرات غير المحفوظة في النماذج لحماية المستخدمين من فقدان البيانات عند مغادرة الصفحة دون حفظ.

A comprehensive system has been added to detect unsaved changes in forms to protect users from data loss when leaving a page without saving.

## الملفات المضافة / Added Files

- `js/unsaved-changes.js` - المكتبة الأساسية لكشف التغييرات / Core detection library

## الميزات / Features

✅ **تتبع تلقائي للنماذج** - Automatic form tracking  
✅ **تحذير قبل المغادرة** - Warning before leaving page  
✅ **دعم اللغة العربية** - Arabic language support  
✅ **سهولة التكامل** - Easy integration  
✅ **API بسيط** - Simple API  

## كيفية الاستخدام / How to Use

### 1. تضمين المكتبة / Include the Library

أضف السكريبت في صفحتك:
```html
<script src="js/unsaved-changes.js"></script>
```

أو إذا كانت صفحتك في مجلد فرعي:
```html
<script src="../js/unsaved-changes.js"></script>
```

### 2. تتبع نموذج / Track a Form

#### الطريقة الأولى: استخدام المعرف / Using Form ID
```javascript
// تتبع نموذج باستخدام معرفه
window.trackFormChanges('myFormId');
```

#### الطريقة الثانية: استخدام عنصر النموذج / Using Form Element
```javascript
const form = document.getElementById('myFormId');
window.unsavedChangesDetector.trackForm(form);
```

### 3. وضع علامة كمحفوظ بعد الحفظ الناجح / Mark as Saved After Successful Save

```javascript
// بعد حفظ البيانات بنجاح
window.markFormAsSaved('myFormId');

// أو إعادة تعيين جميع النماذج
window.markFormAsSaved();
```

## أمثلة عملية / Practical Examples

### مثال 1: نموذج بسيط / Simple Form Example

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <title>نموذج مع كشف التغييرات</title>
</head>
<body>
    <form id="myForm">
        <input type="text" name="name" placeholder="الاسم">
        <input type="email" name="email" placeholder="البريد الإلكتروني">
        <button type="submit">حفظ</button>
    </form>

    <script src="js/unsaved-changes.js"></script>
    <script>
        // تفعيل التتبع
        window.trackFormChanges('myForm');

        // معالج الحفظ
        document.getElementById('myForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // حفظ البيانات...
            const success = await saveData();
            
            if (success) {
                // وضع علامة كمحفوظ
                window.markFormAsSaved('myForm');
                alert('تم الحفظ بنجاح!');
            }
        });
    </script>
</body>
</html>
```

### مثال 2: نموذج معقد مع AJAX / Complex Form with AJAX

```javascript
const form = document.getElementById('vehicleForm');

// تفعيل التتبع
window.trackFormChanges('vehicleForm');

// معالج الإرسال
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/api/save', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // وضع علامة كمحفوظ بعد النجاح
            window.markFormAsSaved('vehicleForm');
            
            // عرض رسالة نجاح
            showSuccessMessage('تم حفظ البيانات بنجاح!');
        } else {
            showErrorMessage('فشل حفظ البيانات');
        }
    } catch (error) {
        console.error('خطأ في الحفظ:', error);
        showErrorMessage('حدث خطأ أثناء الحفظ');
    }
});
```

### مثال 3: حماية الروابط / Protecting Navigation Links

```javascript
// تفعيل التتبع
window.trackFormChanges('editForm');

// حماية روابط معينة من الملاحة غير المحفوظة
const links = document.querySelectorAll('a.protected-link');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.hasUnsavedChanges()) {
            const confirmed = confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟');
            if (!confirmed) {
                e.preventDefault();
                return false;
            }
        }
    });
});
```

## API المتقدم / Advanced API

### كائن UnsavedChangesDetector

#### الخصائص / Properties

- `hasUnsavedChanges` (boolean) - حالة وجود تغييرات غير محفوظة
- `trackedForms` (Set) - مجموعة النماذج المتتبعة
- `isEnabled` (boolean) - حالة تفعيل النظام

#### الطرق / Methods

##### `trackForm(formElement)`
تتبع نموذج معين
```javascript
window.unsavedChangesDetector.trackForm('myForm');
```

##### `markAsSaved(formElement)`
وضع علامة على نموذج كمحفوظ
```javascript
window.unsavedChangesDetector.markAsSaved('myForm');
```

##### `resetForm(formElement)`
إعادة تعيين نموذج لحالته الأصلية
```javascript
window.unsavedChangesDetector.resetForm('myForm');
```

##### `hasChanges()`
التحقق من وجود تغييرات
```javascript
if (window.unsavedChangesDetector.hasChanges()) {
    console.log('يوجد تغييرات غير محفوظة!');
}
```

##### `setEnabled(enabled)`
تفعيل/تعطيل التحذيرات
```javascript
// تعطيل مؤقت
window.unsavedChangesDetector.setEnabled(false);

// إعادة التفعيل
window.unsavedChangesDetector.setEnabled(true);
```

##### `confirmNavigation(message)`
عرض تأكيد مخصص للمغادرة
```javascript
const canLeave = window.unsavedChangesDetector.confirmNavigation(
    'سيتم فقدان التعديلات. هل أنت متأكد؟'
);
```

##### `untrackForm(formElement)`
إيقاف تتبع نموذج
```javascript
window.unsavedChangesDetector.untrackForm('myForm');
```

##### `protectNavigation(selector)`
حماية عناصر معينة من الملاحة
```javascript
// حماية جميع الروابط والأزرار
window.unsavedChangesDetector.protectNavigation('a, button[type="button"]');
```

## الأحداث المخصصة / Custom Events

### حدث `unsavedChangesChanged`
يُطلق عند تغيير حالة التغييرات غير المحفوظة

```javascript
window.addEventListener('unsavedChangesChanged', (e) => {
    const hasChanges = e.detail.hasUnsavedChanges;
    
    if (hasChanges) {
        console.log('توجد تغييرات غير محفوظة');
        // عرض مؤشر بصري
        document.getElementById('saveIndicator').style.display = 'block';
    } else {
        console.log('تم حفظ جميع التغييرات');
        // إخفاء المؤشر
        document.getElementById('saveIndicator').style.display = 'none';
    }
});
```

## حالات الاستخدام / Use Cases

### 1. نماذج تحرير البيانات / Data Edit Forms
حماية تعديلات المستخدم على البيانات الموجودة

### 2. نماذج إضافة البيانات / Data Entry Forms
منع فقدان البيانات المدخلة حديثاً

### 3. نماذج الإعدادات / Settings Forms
حماية تغييرات الإعدادات قبل الحفظ

### 4. نماذج طويلة / Long Forms
حماية الوقت والجهد المستثمر في ملء نماذج طويلة

## الملاحظات الأمنية / Security Notes

⚠️ **مهم / Important:**
- النظام يعمل على جانب العميل فقط
- يمكن تجاوزه من قبل المستخدم
- لا يحل محل التحقق من صحة البيانات على الخادم
- استخدمه كطبقة حماية إضافية للمستخدم

## التوافق / Compatibility

✅ جميع المتصفحات الحديثة / All modern browsers  
✅ Chrome, Firefox, Safari, Edge  
✅ المتصفحات المحمولة / Mobile browsers  

## الصفحات المدمجة حالياً / Currently Integrated Pages

- ✅ `index.html` - صفحة تسجيل الدخول / Login page
- ✅ `test-unsaved-changes.html` - صفحة اختبار شاملة / Comprehensive test page

## صفحات للتكامل المستقبلي / Pages for Future Integration

**ملاحظة:** معظم الصفحات في النظام هي صفحات قراءة فقط (عرض بيانات، بحث، استعلام) ولا تحتاج لهذه الميزة. هذه الميزة مناسبة فقط للصفحات التي تحتوي على نماذج إدخال بيانات حقيقية.

**Note:** Most pages in the system are read-only (display data, search, inquiry) and don't need this feature. This feature is only suitable for pages with actual data entry forms.

الصفحات التي قد تحتاج التكامل في المستقبل (إذا تم إضافة نماذج إدخال):
- ⏳ `vehicle_database_manager.html` - إذا تم إضافة نموذج إدخال سيارات
- ⏳ `apartments_management.html` - إذا تم إضافة نموذج إدخال شقق
- ⏳ `residential_units_management.html` - إذا تم إضافة نموذج إدخال وحدات
- ⏳ `villas_management.html` - إذا تم إضافة نموذج إدخال فلل
- ⏳ `plate_recognition.html` - للصور المرفوعة (اختياري)

## المساهمة / Contributing

لإضافة هذه الميزة لصفحة جديدة:

1. أضف `<script src="js/unsaved-changes.js"></script>`
2. استدع `window.trackFormChanges('formId')` بعد تحميل الصفحة
3. استدع `window.markFormAsSaved('formId')` بعد الحفظ الناجح
4. اختبر الوظيفة بإدخال بيانات ومحاولة المغادرة

## الاختبار / Testing

### صفحة الاختبار التفاعلية / Interactive Test Page

تم إنشاء صفحة اختبار شاملة: `test-unsaved-changes.html`

**الميزات / Features:**
- ✅ واجهة ثنائية اللغة (عربي/إنجليزي)
- ✅ نموذج اختبار تفاعلي مع مؤشر حالة فورية
- ✅ عناصر تحكم للتحقق من الوظائف
- ✅ تغذية راجعة بصرية للتغييرات غير المحفوظة
- ✅ توضيح جميع ميزات الـ API

**كيفية الاستخدام:**
1. افتح `test-unsaved-changes.html` في المتصفح
2. أدخل بيانات في النموذج
3. لاحظ تغيير المؤشر إلى "⚠️ يوجد تغييرات غير محفوظة"
4. حاول مغادرة الصفحة (سيظهر تحذير)
5. اضغط "حفظ" ثم حاول المغادرة مرة أخرى (لن يظهر تحذير)

### الاختبار على صفحة تسجيل الدخول / Testing on Login Page

صفحة تسجيل الدخول (`index.html`) مُكاملة بالفعل:
- ✅ يتم تتبع التغييرات عند الكتابة في الحقول
- ✅ يظهر تحذير عند محاولة المغادرة قبل تسجيل الدخول
- ✅ يتم إلغاء التتبع بعد تسجيل الدخول الناجح

## الدعم / Support

للمساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue في GitHub.

---

© 2025 Traffic Management System - Imam Mohammed Ibn Saud Islamic University
