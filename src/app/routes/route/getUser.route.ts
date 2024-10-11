import express from 'express';
import { UserControllers } from '../../controllers/user.controller';

const router = express.Router();

router.get('/', UserControllers.getAllUsers);

export const getUserRoutes = router;
