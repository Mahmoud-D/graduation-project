// components/CheckoutSteps.jsx

export default function CheckoutSteps({ currentStep   }) {
    return (
      <>
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span
                className={`mr-3 font-medium ${
                  currentStep >= 1 ? "text-black" : "text-gray-600"
                }`}
              >
                معلومات الشحن
              </span>
            </div>
  
            {/* Line Between Steps */}
            <div className="w-16 h-1 bg-blue-200"></div>
  
            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`mr-3 ${
                  currentStep === 2 ? "font-medium text-black" : "text-gray-600"
                }`}
              >
                تأكيد الطلب
              </span>
            </div>
          </div>
        </div>
  
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 text-lg">
            املأ البيانات المطلوبة لإتمام عملية الشراء
          </p>
        </div>
      </>
    );
  }
  