import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { UserControllers } from '../../controllers/user.controller';
import validateSignUp from '../../middlewares/validateSignUp';
import { updateUserValidationSchema } from '../../validations/user.validation';

const router = express.Router();

router.get('/', UserControllers.getAllUsers);

router.patch(
  '/:userId',
  multerUpload.single('profilePhoto'),
  validateSignUp(updateUserValidationSchema),
  UserControllers.updateUser,
);

router.patch('/:userId/make-admin', UserControllers.makeAdmin);
router.patch('/:userId/make-user', UserControllers.makeUser);
router.patch('/:userId/block', UserControllers.blockUser);
router.patch('/:userId/activate', UserControllers.activateUser);

export const getUserRoutes = router;
