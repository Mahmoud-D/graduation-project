// validations/auth.schema.js
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password too short'),
  role: z.string().optional() 
});

module.exports = { registerSchema };
