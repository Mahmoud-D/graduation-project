const { z } = require('zod');

const CategorySchema = z.object({
  name: z
    .string()
    .min(3, "الاسم يجب أن يتكون من 3 أحرف على الأقل")
    .max(30, "الاسم يجب أن لا يتجاوز 100 حرف"),
  description: z
    .string()
    .min(5, "الوصف يجب أن يتكون من 5 أحرف على الأقل")
    .max(500, "الوصف يجب أن لا يتجاوز 500 حرف"),
});


module.exports = { CategorySchema };



 
  
