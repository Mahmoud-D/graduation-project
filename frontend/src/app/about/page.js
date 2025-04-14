import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">من نحن</h1>
          <p className="text-xl text-gray-600 mb-8">
            مرحباً بكم في منصتنا، حيث نربط الطلاب بجامعات أحلامهم.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">مهمتنا</h2>
            <p className="text-gray-600">
              نحن ملتزمون بتبسيط عملية التقديم للجامعات ومساعدة الطلاب في العثور على
              التطابق الأكاديمي المثالي. توفر منصتنا أدوات وموارد شاملة لاتخاذ
              قرارات مستنيرة بشأن التعليم العالي.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">ما نقدمه</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>قاعدة بيانات شاملة للجامعات</li>
              <li>توصيات مخصصة</li>
              <li>نظام تتبع الطلبات</li>
              <li>معلومات المنح الدراسية</li>
              <li>إرشادات ودعم من الخبراء</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">فريقنا</h2>
            <p className="text-gray-600">
              يتكون فريقنا من محترفين ذوي خبرة في التعليم ومطورين ومستشارين
              متحمسين لمساعدة الطلاب في تحقيق أهدافهم الأكاديمية. نجمع بين
              التكنولوجيا والخبرة البشرية لتقديم أفضل توجيه ممكن.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 