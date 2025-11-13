# دليل ربط قاعدة البيانات السحابية
# Cloud Database Integration Guide

## 🗄️ نظرة عامة

هذا الدليل يشرح كيفية ربط النظام بقاعدة بيانات سحابية لإدارة البيانات بشكل مركزي وآمن.

---

## 📊 الحالة الحالية

النظام حالياً يستخدم **localStorage** لتخزين البيانات:
- ✅ مناسب للتطوير والاختبار
- ✅ لا يحتاج إعداد معقد
- ⚠️ البيانات محلية فقط (لا يتم مشاركتها بين المستخدمين)
- ⚠️ محدود السعة (5-10 MB)
- ⚠️ غير مناسب للإنتاج

---

## 🎯 خيارات قاعدة البيانات السحابية

### الخيار 1: Firebase Firestore ⭐ موصى به للمبتدئين

**المميزات:**
- ✅ سهل الإعداد والاستخدام
- ✅ مجاني حتى 50,000 عملية قراءة/يوم
- ✅ Real-time sync تلقائي
- ✅ أمان مدمج (Firebase Auth)
- ✅ دعم الملفات (Firebase Storage)

**العيوب:**
- ⚠️ تكلفة إضافية عند الاستخدام الكثيف
- ⚠️ استعلامات محدودة مقارنة بـ SQL

### الخيار 2: Supabase ⭐ موصى به للمشاريع الكبيرة

**المميزات:**
- ✅ قاعدة بيانات PostgreSQL كاملة
- ✅ استعلامات SQL قوية ومرنة
- ✅ مجاني حتى 500 MB تخزين
- ✅ Authentication مدمج
- ✅ REST API تلقائي
- ✅ مفتوح المصدر

**العيوب:**
- ⚠️ يحتاج معرفة أساسية بـ SQL

### الخيار 3: MongoDB Atlas

**المميزات:**
- ✅ NoSQL مرن
- ✅ مجاني حتى 512 MB
- ✅ سهل التعامل مع البيانات المعقدة

---

## 🚀 الإعداد خطوة بخطوة

---

## 1️⃣ Firebase Firestore - دليل كامل

### الخطوة 1: إنشاء المشروع

1. **الذهاب إلى Firebase Console:**
   - افتح [https://console.firebase.google.com](https://console.firebase.google.com)
   - سجل الدخول بحساب Google

2. **إنشاء مشروع جديد:**
   - انقر على "Add project" أو "إضافة مشروع"
   - أدخل اسم المشروع: `traffic-management-system`
   - فعّل Google Analytics (اختياري)
   - انقر على "Create project"

### الخطوة 2: إعداد Firestore

1. **فتح Firestore Database:**
   - من القائمة الجانبية، اختر "Firestore Database"
   - انقر على "Create database"

2. **اختيار وضع الأمان:**
   - اختر "Start in production mode" (للأمان)
   - اختر الموقع الأقرب: `eur3 (Europe)` أو `asia-south1`

3. **إنشاء المجموعات (Collections):**
   ```
   ├── users          (المستخدمون)
   ├── violations     (المخالفات)
   ├── vehicles       (السيارات)
   ├── buildings      (المباني)
   ├── residential_units (الوحدات السكنية)
   └── residents      (السكان)
   ```

### الخطوة 3: إعداد Authentication

1. **تفعيل Authentication:**
   - اذهب إلى "Authentication"
   - انقر على "Get started"
   - فعّل "Email/Password"

2. **إضافة مستخدمين:**
   - انقر على "Users" ثم "Add user"
   - أضف المستخدمين الافتراضيين:
     - admin@system.local / كلمة_مرور_قوية
     - violations@system.local / كلمة_مرور_قوية

### الخطوة 4: إعداد Firebase Storage (لرفع الصور)

1. **تفعيل Storage:**
   - اذهب إلى "Storage"
   - انقر على "Get started"
   - اختر "Start in production mode"

2. **إنشاء المجلدات:**
   ```
   /images
   ├── violations/    (صور المخالفات)
   ├── vehicles/      (صور السيارات)
   └── plates/        (صور اللوحات)
   ```

### الخطوة 5: الحصول على تكوين Firebase

1. **فتح إعدادات المشروع:**
   - انقر على أيقونة الترس ⚙️ بجانب "Project Overview"
   - اختر "Project settings"

2. **نسخ التكوين:**
   - انتقل إلى تبويب "General"
   - في قسم "Your apps"، انقر على زر الويب `</>`
   - انسخ كود `firebaseConfig`

### الخطوة 6: تكوين النظام

1. **إنشاء ملف التكوين:**

   أنشئ ملف جديد: `firebase-config.js`
   ```javascript
   // تكوين Firebase
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:xxxxxxxxxxxxx"
   };

   // تهيئة Firebase
   firebase.initializeApp(firebaseConfig);
   const db = firebase.firestore();
   const auth = firebase.auth();
   const storage = firebase.storage();

   console.log('✓ Firebase initialized successfully');
   ```

2. **إضافة Firebase SDK:**

   في جميع ملفات HTML، أضف قبل `</head>`:
   ```html
   <!-- Firebase SDK -->
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
   
   <!-- تكوين Firebase -->
   <script src="firebase-config.js"></script>
   ```

### الخطوة 7: تحديث database.js

```javascript
class DatabaseManager {
    constructor() {
        this.dbType = 'firestore'; // تغيير من 'localStorage'
        this.db = firebase.firestore();
        this.init();
    }

    async init() {
        try {
            // اختبار الاتصال
            await this.db.collection('users').limit(1).get();
            console.log('✓ Firestore connected successfully');
            this.connectionStatus = 'connected';
        } catch (error) {
            console.error('Firebase connection error:', error);
            this.connectionStatus = 'error';
        }
    }

    // مثال: إضافة مخالفة
    async addViolation(violationData) {
        try {
            const docRef = await this.db.collection('violations').add({
                ...violationData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Violation added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding violation:', error);
            throw error;
        }
    }

    // مثال: الحصول على المخالفات
    async getViolations() {
        try {
            const snapshot = await this.db.collection('violations')
                .orderBy('createdAt', 'desc')
                .get();
            
            const violations = [];
            snapshot.forEach(doc => {
                violations.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return violations;
        } catch (error) {
            console.error('Error getting violations:', error);
            throw error;
        }
    }

    // مثال: رفع صورة
    async uploadImage(file, path) {
        try {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`${path}/${Date.now()}_${file.name}`);
            
            // رفع الصورة
            const snapshot = await imageRef.put(file);
            
            // الحصول على URL
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            console.log('Image uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}
```

### الخطوة 8: إعداد قواعد الأمان

1. **قواعد Firestore:**
   في Firebase Console > Firestore Database > Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // السماح للمستخدمين المصادقين فقط
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
       
       // قواعد محددة للمستخدمين
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId 
                      || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // قواعد المخالفات
       match /violations/{violationId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null 
                       && request.auth.uid != null;
         allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

2. **قواعد Storage:**
   في Firebase Console > Storage > Rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // السماح برفع الصور للمستخدمين المصادقين
       match /images/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null
                      && request.resource.size < 5 * 1024 * 1024 // حد أقصى 5 MB
                      && request.resource.contentType.matches('image/.*'); // صور فقط
       }
     }
   }
   ```

---

## 2️⃣ Supabase - دليل كامل

### الخطوة 1: إنشاء المشروع

1. **التسجيل في Supabase:**
   - اذهب إلى [https://supabase.com](https://supabase.com)
   - سجل حساب جديد (مجاني)

2. **إنشاء مشروع:**
   - انقر على "New Project"
   - اسم المشروع: `traffic-management`
   - كلمة مرور قاعدة البيانات: (احفظها في مكان آمن!)
   - المنطقة: اختر الأقرب

### الخطوة 2: إنشاء الجداول

استخدم ملف `schema.sql` لإنشاء الجداول:

1. **فتح SQL Editor:**
   - من القائمة الجانبية، اختر "SQL Editor"

2. **تنفيذ السكريبت:**
   - انسخ محتوى `schema.sql`
   - الصقه في المحرر
   - انقر على "Run"

### الخطوة 3: الحصول على API Keys

1. **فتح Project Settings:**
   - انقر على أيقونة الترس ⚙️
   - اختر "API"

2. **نسخ المفاتيح:**
   - `Project URL`: https://xxxxx.supabase.co
   - `anon public`: المفتاح العام
   - `service_role secret`: المفتاح السري (استخدمه في الخادم فقط!)

### الخطوة 4: تكوين النظام

```javascript
// supabase-config.js
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';

// تهيئة Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✓ Supabase initialized');
```

### الخطوة 5: تحديث database.js

```javascript
class DatabaseManager {
    constructor() {
        this.dbType = 'supabase';
        this.client = supabaseClient;
        this.init();
    }

    // مثال: إضافة مخالفة
    async addViolation(violationData) {
        const { data, error } = await this.client
            .from('violations')
            .insert([violationData]);
        
        if (error) throw error;
        return data;
    }

    // مثال: الحصول على المخالفات
    async getViolations() {
        const { data, error } = await this.client
            .from('violations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    // مثال: رفع صورة
    async uploadImage(file, path) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await this.client.storage
            .from('images')
            .upload(`${path}/${fileName}`, file);
        
        if (error) throw error;
        
        // الحصول على URL العام
        const { publicURL } = this.client.storage
            .from('images')
            .getPublicUrl(`${path}/${fileName}`);
        
        return publicURL;
    }
}
```

---

## 📸 نظام رفع الصور

### تحسينات رفع الصور:

1. **التحقق من نوع الملف:**
```javascript
function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5 MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('نوع الملف غير مدعوم. استخدم JPG أو PNG فقط.');
    }
    
    if (file.size > maxSize) {
        throw new Error('حجم الصورة يتجاوز 5 MB');
    }
    
    return true;
}
```

2. **ضغط الصورة قبل الرفع:**
```javascript
async function compressImage(file) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    
    try {
        const compressedFile = await imageCompression(file, options);
        console.log('Image compressed from', file.size, 'to', compressedFile.size);
        return compressedFile;
    } catch (error) {
        console.error('Compression error:', error);
        return file; // استخدم الملف الأصلي في حالة الفشل
    }
}
```

---

## ✅ قائمة التحقق

قبل الانتهاء، تأكد من:

### قاعدة البيانات:
- [ ] تم اختيار قاعدة البيانات (Firebase أو Supabase)
- [ ] تم إنشاء المشروع بنجاح
- [ ] تم إنشاء جميع الجداول/المجموعات
- [ ] تم اختبار الاتصال بقاعدة البيانات

### الأمان:
- [ ] تم إعداد قواعد الأمان
- [ ] تم تفعيل Authentication
- [ ] تم تخزين API keys بشكل آمن
- [ ] تم اختبار الصلاحيات

### رفع الصور:
- [ ] تم إعداد Storage
- [ ] تم اختبار رفع الصور
- [ ] تم التحقق من عمل الضغط
- [ ] تم التحقق من أمان الرفع

---

## 🧪 اختبار النظام

```javascript
// اختبار الاتصال بقاعدة البيانات
async function testDatabaseConnection() {
    try {
        const db = new DatabaseManager();
        console.log('Database type:', db.dbType);
        console.log('Connection status:', db.connectionStatus);
        
        // اختبار إضافة بيانات
        const testData = {
            test: true,
            timestamp: new Date().toISOString()
        };
        
        // ... إضافة بيانات تجريبية
        
        console.log('✓ Database test passed');
    } catch (error) {
        console.error('✗ Database test failed:', error);
    }
}

// تشغيل الاختبار
testDatabaseConnection();
```

---

## 📚 موارد إضافية

### Firebase:
- [التوثيق الرسمي](https://firebase.google.com/docs)
- [أمثلة Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Storage Guide](https://firebase.google.com/docs/storage)

### Supabase:
- [التوثيق الرسمي](https://supabase.com/docs)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**آخر تحديث:** 13 نوفمبر 2025  
**الحالة:** جاهز للتطبيق
