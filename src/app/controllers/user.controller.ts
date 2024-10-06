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

export const UserControllers = {
  createUser,
  getAllUsers,
  makeAdmin,
  makeUser,
  blockUser,
  activateUser,
};
