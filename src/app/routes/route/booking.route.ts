import express from 'express';
import { USER_ROLE } from '../../constants/user.constant';
import { bookingControllers } from '../../controllers/booking.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createBookingValidationSchema } from '../../validations/booking.validation';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLE.user),
  validateRequest(createBookingValidationSchema),
  bookingControllers.createBooking,
);
router.get('/', bookingControllers.getAllBookings);
router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
  bookingControllers.getMyBookings,
);
router.get(
  '/my-bookings/:id',
  auth(USER_ROLE.user),
  bookingControllers.getBookingById,
);
router.put(
  '/my-bookings/:id',
  auth(USER_ROLE.user),
  bookingControllers.getBookingById,
);
router.delete('/my-bookings/:id', bookingControllers.cancelBooking);
router.patch(
  '/approve/:id',
  auth(USER_ROLE.admin),
  bookingControllers.approveBooking,
);
export const BookingRoutes = router;
