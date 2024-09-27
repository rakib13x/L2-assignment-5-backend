import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateSignUp = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log('Request Body:', req.body);
    try {
      // Parse and validate req.body directly
      const validatedData = await schema.parseAsync(req.body);
      // Optionally attach the validated data to the request object
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors,
        });
      }
      // Pass other errors to the global error handler
      next(error);
    }
  });
};

export default validateSignUp;
