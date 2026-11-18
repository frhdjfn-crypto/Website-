#!/bin/bash

# بناء المشروع
npm run build

# ضغط الملفات
cd out
zip -r ../zeitouna-book.zip .
cd ..

echo "✅ تم إنشاء ملف zeitouna-book.zip"
echo "📤 ارفع هذا الملف إلى استضافتك وفك الضغط في المجلد الرئيسي"
