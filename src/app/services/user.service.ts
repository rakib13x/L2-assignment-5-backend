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

const updateUserIntodb = async (
  userId: string,
  updates: Partial<TUser>,
  profilePhotoPath: string | null,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Only update fields if they are provided
  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email; // Be cautious with email updates
  if (updates.phone) user.phone = updates.phone;
  if (updates.address) user.address = updates.address;
  if (updates.role) user.role = updates.role;
  if (updates.status) user.status = updates.status;

  // Handle optional profile photo update
  if (profilePhotoPath) {
    user.profilePhoto = profilePhotoPath;
  }

  try {
    await user.save(); // Attempt to save the updated user
  } catch (error: any) {
    // Check for duplicate key error (email conflict)
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new AppError(
        400,
        'Email already exists. Please use a different email.',
      );
    }
    throw error; // Throw other errors
  }

  return user;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  updateUserRole,
  updateUserStatus,
  updateUserIntodb,
};
