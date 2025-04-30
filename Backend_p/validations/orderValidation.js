// validation/orderValidation.js
const { z } = require('zod');

const createOrderSchema = z.object({
  dishes: z.array(
    z.object({
      dishId: z.number().int('Dish ID must be an integer').positive(),
      quantity: z.number('must be an integer').int('Quantity must be an integer').positive()
    })
  ).min(1, "You must select at least one dish."),
  
  coupon_code: z.string().optional()
 });

module.exports = { createOrderSchema };
