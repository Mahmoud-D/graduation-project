const validator = (schema) => async (req, res, next) => {
   const dataToValidate = req.bodyForValidation || req.body;
  
  const result = await schema.safeParseAsync(dataToValidate);

  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    return res.status(400).json({ 
      message: "Validation failed",
      errors: formattedErrors 
    });
  }

  req.validatedData = result.data;
  next();
};

module.exports = validator;