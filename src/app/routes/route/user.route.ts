import express from 'express';
import multer from 'multer';
import path from 'path';
import { UserControllers } from '../../controllers/user.controller';
import validateSignUp from '../../middlewares/validateSignUp';
import { createUserValidationSchema } from '../../validations/user.validation';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  '/',
  upload.single('profilePhoto'),
  validateSignUp(createUserValidationSchema),
  async (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    next();
  },
  UserControllers.createUser,
);

// User management routes
router.patch('/:userId/make-admin', UserControllers.makeAdmin);

export const UserRoutes = router;
