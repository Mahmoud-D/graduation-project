import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">من نحن</h1>
          <p className="text-xl text-gray-600 mb-8">
            مرحباً بكم في مطعمنا، حيث نقدم لكم ألذ الأطباق وأسرع خدمة توصيل.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">مهمتنا</h2>
            <p className="text-gray-600">
              نحن ملتزمون بتقديم تجربة طعام استثنائية لعملائنا، من خلال تقديم أطباق عالية الجودة
              وخدمة توصيل سريعة وموثوقة. نهدف إلى جعل طلب الطعام تجربة سهلة وممتعة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">ما نقدمه</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>قائمة متنوعة من الأطباق الشهية</li>
              <li>توصيل سريع وموثوق</li>
              <li>تتبع الطلبات في الوقت الفعلي</li>
              <li>عروض وتخفيضات حصرية</li>
              <li>خدمة عملاء على مدار الساعة</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">فريقنا</h2>
            <p className="text-gray-600">
              يتكون فريقنا من طهاة محترفين وموظفي خدمة متميزين، ملتزمين بتقديم أفضل
              تجربة طعام لعملائنا. نستخدم أفضل المكونات وأحدث التقنيات لضمان جودة
              الطعام وسرعة التوصيل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}