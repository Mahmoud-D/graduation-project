const { z } = require('zod');

const dishSchema = z.object({
  name: z.string({
    required_error: "اسم الطبق مطلوب"
  }).min(2).max(100),
  
  description: z.string().min(5).max(500).optional(),
  
  price: z.coerce.number()
    .min(0, "السعر يجب أن يكون موجباً")
    .max(10000),
  
  category: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return [];
      }
    },
    z.array(z.number()).min(1, "يجب تحديد تصنيف واحد على الأقل")
  ),
  
  image: z.object({
    originalname: z.string(),
    mimetype: z.string().regex(/^image\//, "يجب أن يكون الملف صورة"),
    size: z.number().max(5_000_000, "يجب أن لا يتجاوز حجم الصورة 5MB"),
    filename: z.string()
  }, {
    required_error: "الصورة مطلوبة"
  })
});

module.exports = { dishSchema };