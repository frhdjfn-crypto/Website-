# ⚡ دليل البدء السريع | Quick Start Guide

## 🎯 نشر الموقع في 5 دقائق فقط!

موقع مكتبة زيتونة **جاهز تماماً للنشر الفوري**. اختر إحدى الطرق أدناه:

---

## 🚀 الطريقة الأولى: Vercel (الأسهل)

### الخطوة 1: التثبيت
```bash
npm install -g vercel
```

### الخطوة 2: تسجيل الدخول
```bash
vercel login
```
ثم اتبع التعليمات (هتفتح صفحة في المتصفح)

### الخطوة 3: النشر الفوري
```bash
vercel --prod
```

**انتهى!** 🎉  
الموقع سيكون متاح على رابط مثل: `https://zytonabook.vercel.app`

---

## 🎯 الطريقة الثانية: Netlify

### الخطوة 1: التثبيت
```bash
npm install -g netlify-cli
```

### الخطوة 2: تسجيل الدخول
```bash
netlify login
```

### الخطوة 3: النشر الفوري
```bash
netlify deploy --prod --dir=.next
```

**انتهى!** 🎉  
الموقع سيكون متاح على رابط مثل: `https://zytonabook.netlify.app`

---

## 💻 الطريقة الثالثة: GitHub Pages / استضافة عادية

### خطوة 1: بناء المشروع
```bash
npm install
npm run build
```

### خطوة 2: رفع الملفات
انسخ هذه المجلدات إلى الخادم عبر FTP:
- `.next/`
- `public/`
- `package.json`
- `package-lock.json`

### خطوة 3: التثبيت والتشغيل على الخادم
```bash
npm install --production
npm start
```

---

## ✅ فحص سريع قبل النشر

```bash
# 1. تشغيل محلي (اختياري)
npm run dev
# افتح http://localhost:3000

# 2. بناء (مهم!)
npm run build

# 3. اختبار الإنتاج (اختياري)
npm start
```

---

## 🎨 بيانات الموقع

| البيان | القيمة |
|--------|--------|
| الاسم | مكتبة زيتونة |
| النسخة | 1.0.0 |
| الحالة | جاهز للنشر |
| عدد الكتب | 9 |
| عدد الصفحات | 9+ |

---

## 🔧 إعدادات بعد النشر

### 1. إضافة Domain خاص (اختياري)

إذا كان لديك domain:

**على Vercel:**
- اذهب إلى Project Settings
- اختر Domains
- أضف domain الخاص بك

**على Netlify:**
- اذهب إلى Domain settings
- أضف domain الخاص بك

### 2. تفعيل HTTPS (تلقائي)
جميع المنصات تفعل HTTPS تلقائياً ✅

### 3. إضافة Analytics (اختياري)
يمكنك إضافة Google Analytics لاحقاً

---

## 🚨 حل المشاكل الشائعة

### المشكلة: "command not found: vercel"
**الحل:**
```bash
npm install -g vercel
```

### المشكلة: "Failed to login"
**الحل:**
- تأكد من اتصالك بالإنترنت
- احذف `~/.vercel` وحاول مرة أخرى

### المشكلة: "Build failed"
**الحل:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 الدعم الإضافي

- 📖 قراءة المزيد: اقرأ [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ قائمة التحقق: اقرأ [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- 📊 التقرير النهائي: اقرأ [FINAL_STATUS.md](./FINAL_STATUS.md)

---

## ⏱️ الوقت المتوقع

| الطريقة | الوقت |
|--------|------|
| Vercel | 2-3 دقائق |
| Netlify | 3-4 دقائق |
| استضافة عادية | 10-15 دقيقة |

---

## 🎊 تهانينا!

بعد اكتمال الخطوات أعلاه، موقعك سيكون مباشر على الإنترنت! 🚀

---

**ملاحظة مهمة**: الموقع مستقر وآمن وجاهز للاستخدام الفوري.

تم الإعداد بواسطة: **v0 (Vercel AI)**  
التاريخ: **2026-06-02**
