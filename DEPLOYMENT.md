# دليل نشر موقع مكتبة زيتونة | Zytonabook Deployment Guide

## النسخة الحالية
- **إصدار**: 1.0.0
- **الحالة**: جاهز للنشر
- **آخر تحديث**: 2026-06-02

---

## المتطلبات الأساسية

### قبل البدء تأكد من:
- تثبيت Node.js (الإصدار 18 أو أحدث)
- تثبيت npm أو yarn
- حساب على منصة استضافة (Vercel, Netlify, Heroku، إلخ)

---

## طرق النشر

### الطريقة الأولى: نشر على Vercel (الأسهل والموصى به)

#### الخطوة 1: ربط المشروع بـ Git
```bash
# إنشاء مستودع Git محلي (إذا لم يكن موجوداً)
git init
git add .
git commit -m "Initial commit - Zytonabook v1.0"
```

#### الخطوة 2: دفع المشروع إلى GitHub
```bash
# إنشاء مستودع على GitHub ثم:
git remote add origin https://github.com/yourusername/zytonabook.git
git branch -M main
git push -u origin main
```

#### الخطوة 3: نشر على Vercel
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# للإنتاج:
vercel --prod
```

#### أو من خلال الويب:
1. اذهب إلى https://vercel.com/new
2. اختر "Import Git Repository"
3. اختر مستودعك من GitHub
4. انقر "Deploy"

---

### الطريقة الثانية: نشر على Netlify

#### الخطوة 1: بناء المشروع
```bash
npm run build
```

#### الخطوة 2: تحميل على Netlify
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# نشر المشروع
netlify deploy --prod --dir=.next
```

#### أو من خلال الويب:
1. اذهب إلى https://app.netlify.com
2. انقر "New site from Git"
3. اختر مستودعك
4. اترك الإعدادات الافتراضية
5. انقر "Deploy"

---

### الطريقة الثالثة: نشر على استضافة عادية (cPanel)

#### الخطوة 1: بناء المشروع محلياً
```bash
npm install
npm run build
```

#### الخطوة 2: تحضير الملفات للرفع
تأكد من نسخ المجلدات التالية:
- `.next/` - ملفات التطبيق المبنية
- `public/` - الصور والملفات الثابتة
- `node_modules/` - المكتبات (اختياري إذا كنت ستثبتها على الخادم)
- `package.json` و `package-lock.json`

#### الخطوة 3: رفع الملفات
استخدم FTP أو File Manager في cPanel:
```
/home/username/public_html/zytonabook/
```

#### الخطوة 4: تثبيت التبعيات على الخادم
عبر SSH:
```bash
cd /home/username/public_html/zytonabook
npm install --production
```

#### الخطوة 5: تشغيل التطبيق
```bash
npm start
```

أو إذا كنت تستخدم PM2:
```bash
npm install -g pm2
pm2 start npm --name "zytonabook" -- start
pm2 startup
pm2 save
```

---

### الطريقة الرابعة: نشر على Docker

#### الخطوة 1: إنشاء Dockerfile
ملف `Dockerfile` موجود بالفعل أو يمكن إنشاء واحد:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./. next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

#### الخطوة 2: بناء وتشغيل
```bash
docker build -t zytonabook .
docker run -p 3000:3000 zytonabook
```

---

## خطوات ما بعد النشر

### 1. التحقق من الموقع
- تفعيل HTTPS
- اختبار جميع الصفحات
- التحقق من وظائف البحث والتحميل

### 2. إضافة DNS
إذا كان لديك نطاق خاص:
```
A Record: yyour-domain.com -> IP Address
CNAME Record: www.your-domain.com -> your-domain.com
```

### 3. إعدادات الأداء
- تفعيل caching
- ضغط الملفات (gzip)
- تحسين الصور

### 4. المراقبة والتحليلات
```bash
# إضافة Google Analytics (اختياري)
# إضافة Sentry للمراقبة (اختياري)
```

---

## متغيرات البيئة الإنتاجية

انسخ `.env.example` إلى `.env.production.local`:
```bash
cp .env.example .env.production.local
```

حدّث المتغيرات:
```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

---

## المشاكل الشائعة والحلول

### المشكلة 1: خطأ "Cannot find module"
**الحل:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### المشكلة 2: الصور لا تظهر
**الحل:**
- تأكد من أن `public/` موجود على الخادم
- تحقق من صلاحيات الملفات: `chmod 755 public`

### المشكلة 3: الوضع الليلي لا يعمل
**الحل:**
- امسح cache المتصفح
- تحقق من `suppressHydrationWarning` في `html` tag

### المشكلة 4: بطء الموقع
**الحل:**
```bash
npm run build
# تحقق من حجم الحزمة:
npm run build -- --analyze
```

---

## فحص قائمة التحقق قبل النشر

- [ ] تشغيل المشروع محلياً بدون أخطاء: `npm run dev`
- [ ] البناء بدون أخطاء: `npm run build`
- [ ] اختبار الصفحة الرئيسية
- [ ] اختبار البحث والفلترة
- [ ] اختبار الوضع الليلي
- [ ] اختبار عرض تفاصيل الكتب
- [ ] اختبار التحميل (إذا كانت الملفات متوفرة)
- [ ] اختبار الاستجابة على الأجهزة المختلفة
- [ ] حذف `node_modules` من الملفات المرفوعة (بعض المنصات تحتاجها، البعض لا)
- [ ] التحقق من ملف `.gitignore` صحيح

---

## الدعم والمساعدة

### التوثيق الرسمية:
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev

### للأسئلة والمشاكل:
- اطرح السؤال على Stack Overflow
- ابحث في مستودع المشروع على GitHub
- تواصل مع فريق الدعم الفني للاستضافة

---

## تحديثات مستقبلية

المميزات الموصى بها للإضافة لاحقاً:
- [ ] قاعدة بيانات (Supabase/Firebase)
- [ ] نظام التعليقات الديناميكي
- [ ] نظام تسجيل المستخدمين
- [ ] المكتبة الشخصية
- [ ] نظام التقييمات

---

**النسخة**: 1.0.0 - جاهز للإنتاج  
**آخر تحديث**: 2026-06-02  
**الحالة**: مستقر وآمن للاستخدام
