import express from 'express';
import {
  confirmBookingPaymentController,
  createBookingPaymentIntentController,
  getTotalRevenueController,
} from '../../controllers/payment.controller';

const router = express.Router();

router.post('/create-payment-intent', createBookingPaymentIntentController);

router.post('/confirm-payment', confirmBookingPaymentController);
router.get('/total-revenue', getTotalRevenueController);

export const BookingPaymentRoutes = router;
