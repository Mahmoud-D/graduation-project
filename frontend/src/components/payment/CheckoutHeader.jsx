import React from "react";

export const CheckoutHeader = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, title: "معلومات الشحن", active: currentStep === 1 },
    { id: 2, title: "تأكيد الطلب", active: currentStep === 2 },
  ];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step.active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`mr-3 ${step.active ? "font-medium" : "text-gray-600"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-1 bg-blue-200"></div>
              )}
            </React.Fragment>
          ))}
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
};