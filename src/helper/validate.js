import vine, {errors} from "@vinejs/vine";


export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body;
      const validator = vine.compile(schema);
      const payload = await validator.validate(data);
      next();
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          error: error.messages,
        });
      } else {
        return res.status(500).json({
          message: "internal server error custom msg",
          error,
        });
      }
    }
  };
};