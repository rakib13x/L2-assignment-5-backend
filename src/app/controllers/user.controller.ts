import httpStatus from 'http-status';
import { UserServices } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { createUserValidationSchema } from '../validations/user.validation';

const createUser = catchAsync(async (req, res) => {
  // Validate using safeParse (non-throwing validation)
  const validation = createUserValidationSchema.safeParse({ body: req.body });

  if (!validation.success) {
    // Log and send the validation errors
    console.error('Validation errors:', validation.error.errors);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors, // Return the zod validation errors
    });
  }

  // Proceed with user creation if validation passes
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: {
      ...result.toObject(),
      password: undefined,
    },
  });
});

export const UserControllers = {
  createUser,
};
