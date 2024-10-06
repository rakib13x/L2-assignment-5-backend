import express from 'express';
import { UserControllers } from '../../controllers/user.controller';

const router = express.Router();

router.get('/', UserControllers.getAllUsers);

router.patch('/:userId/make-admin', UserControllers.makeAdmin);
router.patch('/:userId/make-user', UserControllers.makeUser);
router.patch('/:userId/block', UserControllers.blockUser);
router.patch('/:userId/activate', UserControllers.activateUser);

export const getUserRoutes = router;
