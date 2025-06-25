const { z } = require('zod');

 const baseDishSchema = z.object({
  name: z.string({
    required_error: "اسم الطبق مطلوب"
  }).min(2, "الاسم يجب أن يكون على الأقل حرفين").max(100),
  
  description: z.string()
    .min(5, "الوصف يجب أن يكون على الأقل 5 أحرف")
    .max(500, "الوصف يجب أن لا يتجاوز 500 حرف")
    .optional(),
  
  price: z.coerce.number()
    .min(0, "السعر يجب أن يكون موجباً")
    .max(10000, "السعر يجب أن لا يتجاوز 10000"),
  
  category: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return val;
      }
    },
    z.array(z.number(), {
      required_error: "التصنيفات مطلوبة",
      invalid_type_error: "يجب أن تكون التصنيفات مصفوفة من الأرقام"
    }).min(1, "يجب تحديد تصنيف واحد على الأقل")
  )
});

 const createDishSchema = baseDishSchema.extend({
  image: z.object({
    originalname: z.string(),
    mimetype: z.string().regex(/^image\//, "يجب أن يكون الملف صورة"),
    size: z.number().max(5_000_000, "يجب أن لا يتجاوز حجم الصورة 5MB"),
    filename: z.string()
  }, {
    required_error: "الصورة مطلوبة"
  })
});

 const updateDishSchema = baseDishSchema.extend({
  id: z.string().min(1, "معرف الطبق مطلوب"),
  image: z.object({
    originalname: z.string(),
    mimetype: z.string().regex(/^image\//, "يجب أن يكون الملف صورة"),
    size: z.number().max(5_000_000, "يجب أن لا يتجاوز حجم الصورة 5MB"),
    filename: z.string()
  }).optional()
}).partial(); 


const dishIdsSchema = z.object({
  ids: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return val;
      }
    },
    z.array(z.string().min(1), {
      required_error: "معرفات الأطباق مطلوبة",
      invalid_type_error: "يجب أن تكون المعرفات مصفوفة من النصوص"
    }).min(1, "يجب تحديد معرف طبق واحد على الأقل")
  )
});

module.exports = {
  createDishSchema,
  updateDishSchema,
  dishIdsSchema
};