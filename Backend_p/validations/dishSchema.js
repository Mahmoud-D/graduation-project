 const { z } = require('zod');

const dishSchema = z.object({
  name: z
    .string()
    .min(2, "اسم الطبق يجب أن يكون على الأقل مكون من حرفين")
    .max(100, "اسم الطبق يجب ألا يتجاوز 100 حرف"),
  description: z
    .string()
    .min(5, "الوصف يجب أن يكون على الأقل مكون من 5 أحرف")
    .max(500, "الوصف يجب ألا يتجاوز 500 حرف"),
  price: z
    .number()
    .min(0, "السعر يجب أن يكون قيمة صحيحة أكبر من أو تساوي 0")
    .max(10000, "السعر يجب أن لا يتجاوز 10000"),
  category: z
    .string()
    .min(1, "يجب تقديم تصنيفات على الأقل")
    .transform((val) => JSON.parse(val)), // تحويل التصنيفات إلى مصفوفة
});


module.exports = { dishSchema };



 
  
