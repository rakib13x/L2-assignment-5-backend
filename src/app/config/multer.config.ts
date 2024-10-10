import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';

// Function to remove the file extension
const removeExtension = (filename: string): string => {
  return filename.split('.').slice(0, -1).join('.');
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (
      _req: any,
      file: Express.Multer.File, // Specify file type
    ) =>
      Math.random().toString(36).substring(2) +
      '-' +
      Date.now() +
      '-' +
      file.fieldname +
      '-' +
      removeExtension(file.originalname),
  },
});

// Multer upload configuration using CloudinaryStorage
export const multerUpload = multer({ storage: storage });
