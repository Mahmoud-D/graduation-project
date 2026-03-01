import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">اتصل بنا</h1>
          <p className="text-xl text-gray-600 mb-8">
            لديك استفسار عن طلبك أو قائمتنا؟ نحن هنا لمساعدتك! تواصل معنا من
            خلال أي من الطرق التالية.
          </p>
        </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              تواصل معنا
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">البريد الإلكتروني</h3>
                <p className="text-gray-600">info@restaurant.com</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">رقم الهاتف</h3>
                <p className="text-gray-600">0483481646</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">ساعات العمل</h3>
                <p className="text-gray-600">
                  كل يوم من 10 صباحاً حتى 11 مساءً
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">العنوان</h3>
                <p className="text-gray-600">
                  123 شارع المطاعم
                  <br />
                  القاهرة
                  <br />
                  مصر{" "}
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
