import httpStatus from 'http-status';
import { TUser } from '../interface/user.interface';
import { UserServices } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createUser = catchAsync(async (req, res) => {
  console.log('Processing signup...');

  let profilePhotoUrl = null;
  if (req.file) {
    profilePhotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const userData: Partial<TUser> = {
    ...req.body,
    role: req.body.role || 'user',
    profilePhoto: profilePhotoUrl,
  };

  console.log('User data to create:', userData);

  try {
    const result = await UserServices.createUserIntoDB(
      userData as TUser,
      profilePhotoUrl,
    );
    const { password, ...userWithoutPassword } = result.toObject();

    console.log('User created successfully:', userWithoutPassword); // Log the created user

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User registered successfully',
      data: userWithoutPassword,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating user.',
    });
  }
});

export const UserControllers = {
  createUser,
};
