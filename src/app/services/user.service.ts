import AppError from '../errors/AppError';
import { TUser } from '../interface/user.interface';
import { User } from '../model/user.model';

const createUserIntoDB = async (
  user: TUser,
  profilePhotoPath: string | null,
) => {
  const userData = {
    ...user,
    profilePhoto: profilePhotoPath || null,
  };

  const result = await User.create(userData);
  return result;
};

const getAllUsersFromDB = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select('-password')
    .lean();

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    totalItems: totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
  };
};

const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  user.role = role;
  await user.save();

  return user;
};

const updateUserStatus = async (
  userId: string,
  status: 'active' | 'blocked',
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  user.status = status;
  await user.save();

  return user;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  updateUserRole,
  updateUserStatus,
};
