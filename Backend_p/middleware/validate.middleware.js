const validate = (schema) => (req, res, next) => {
  try {
    // استخدام البيانات المحضرة من multer
    const data = req.bodyForValidation || req.body;
    const validatedData = schema.parse(data);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors,
      message: "Validation failed"
    });
  }
};

module.exports = validate;