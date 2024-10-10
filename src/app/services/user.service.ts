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

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
};
