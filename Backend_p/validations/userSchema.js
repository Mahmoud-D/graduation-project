// validations/auth.schema.js
// validations/auth.schema.js
const { z } = require("zod");
const { findByEmail } = require("../models/User");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "اسم المستخدم يجب أن يكون على الأقل مكون من حرفين")
    .regex(/^[a-zA-Z\s]+$/, "الاسم يجب أن يحتوي فقط على حروف ومسافات"),
  email: z
    .string()
    .email("تنسيق البريد الإلكتروني غير صحيح")
    .transform((email) => email.toLowerCase()) 
    .refine(async (email) => {
      const userExists = await findByEmail(email);
      console.log(userExists);
      
      return !userExists;
    }, "البريد الإلكتروني موجود بالفعل."),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل مكونة من 6 أحرف")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
  role: z
    .string()
    .optional()
    .refine(
      (role) => ["user", "admin"].includes(role),
      'الدور غير صحيح. يجب أن يكون "user" أو "admin"'
    ),
});



const EmailSchema = z.object({
  
  email: z
  .string()
    .email("تنسيق البريد الإلكتروني غير صحيح")
    .transform((email) => email.toLowerCase())
    .refine(async (email) => {
      const userExists = await findByEmail(email);
      return !userExists;
    }, "البريد الإلكتروني موجود بالفعل."),
    
  });
  
  const passwordValidate = z.object({
 
    newPassword: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون على الأقل مكونة من 6 أحرف")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),

  });


  const loginSchema = z.object({
    email: z
    .string()
    .email("تنسيق البريد الإلكتروني غير صحيح")
    .transform((email) => email.toLowerCase())
    .superRefine(async (email, ctx) => {
      const user = await findByEmail(email);

      if (!user) return;

 

      if (!user.is_active) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "الحساب غير نشط. يرجى التواصل مع الدعم.",
        });
      } else if (!user.is_verified) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يرجى تفعيل بريدك الإلكتروني قبل المتابعة.",
        });
      }
    })
,  
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون على الأقل مكونة من 6 أحرف")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
  })

const isEnteredEmailSchema = z.object({
  email: z
    .string()
    .email("تنسيق البريد الإلكتروني غير صحيح")
    .transform((email) => email.toLowerCase()),
})

  module.exports = { registerSchema,EmailSchema,passwordValidate ,loginSchema,isEnteredEmailSchema};
