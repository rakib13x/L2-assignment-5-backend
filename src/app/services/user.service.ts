import { TUser } from '../interface/user.interface';
import { User } from '../model/user.model';

const createUserIntoDB = async (
  user: TUser,
  profilePhotoPath: string | null,
) => {
  const userData = {
    ...user,
    profilePhoto: profilePhotoPath || null, // Ensure profile photo is added
  };

  const result = await User.create(userData);
  return result;
};

export const UserServices = {
  createUserIntoDB,
};
