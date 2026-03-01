import { z } from 'zod'
export const paymentFormSchema =  z.object({
  name: z
    .string()
    .min(2, { message: "الاسم يجب أن يكون على الأقل حرفين." })
    .max(50, { message: "الاسم طويل جداً." })
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "الاسم يجب أن يحتوي فقط على حروف عربية أو إنجليزية ومسافات"
    ),
  address: z
    .string()
    .min(10, {
      message: "العنوان يجب أن يكون مفصلاً أكثر (10 أحرف على الأقل).",
    })
    .max(200, { message: "العنوان طويل جداً." }),
  city: z
    .string()
    .min(2, { message: "اسم المدينة مطلوب." })
    .max(30, { message: "اسم المدينة طويل جداً." }),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, {
    message: "رقم الهاتف يجب أن يكون مصري صحيح (01xxxxxxxxx).",
  }),
  

  paymentMethod: z.enum(["cash", "paypal"], {
    required_error: "يجب اختيار طريقة الدفع",
  }),
  couponCode: z.string().optional(),
});
