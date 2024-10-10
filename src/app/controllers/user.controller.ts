import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUser } from '../interface/user.interface';
import { UserServices } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createUser = catchAsync(async (req, res) => {
  console.log('Processing signup...');

  let profilePhotoUrl = null;
  if (req.file && req.file.path) {
    profilePhotoUrl = req.file.path;
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

const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const usersData = await UserServices.getAllUsersFromDB(page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    data: usersData,
  });
});
const makeAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updatedUser = await UserServices.updateUserRole(userId, 'admin');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User promoted to admin successfully',
    data: updatedUser,
  });
});

const makeUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updatedUser = await UserServices.updateUserRole(userId, 'user');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User demoted to user successfully',
    data: updatedUser,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updatedUser = await UserServices.updateUserStatus(userId, 'blocked');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User blocked successfully',
    data: updatedUser,
  });
});

const activateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updatedUser = await UserServices.updateUserStatus(userId, 'active');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User activated successfully',
    data: updatedUser,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const userUpdates: Partial<TUser> = req.body;

  let profilePhotoUrl = null;
  if (req.file && req.file.path) {
    profilePhotoUrl = req.file.path;
  }

  try {
    const updatedUser = await UserServices.updateUserIntodb(
      userId,
      userUpdates,
      profilePhotoUrl,
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword,
    });
  } catch (err: any) {
    console.error('Error updating user:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please choose another one.',
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error while updating user.',
    });
  }
});

export const UserControllers = {
  createUser,
  getAllUsers,
  makeAdmin,
  makeUser,
  blockUser,
  activateUser,
  updateUser,
};
