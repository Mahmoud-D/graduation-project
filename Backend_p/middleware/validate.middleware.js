 const validator = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
  
    if (!result.success) {
      const errors = result.error.errors.map((e) => e);
      return res.status(400).json({ errors });
    }
  
     req.validatedBody = result.data;
    next();
  };
  
  module.exports = validator;
  