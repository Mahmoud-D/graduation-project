export const CheckoutStepper = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            1
          </div>
          <span className="mr-3 font-medium">معلومات الشحن</span>
        </div>
        <div className="w-16 h-1 bg-blue-200"></div>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-semibold">
            2
          </div>
          <span className="mr-3 text-gray-600">تأكيد الطلب</span>
        </div>
      </div>
    </div>
  );
};