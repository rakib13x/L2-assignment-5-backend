import dotenv from 'dotenv';
import Stripe from 'stripe';
import { BookingPaymentModel } from '../model/bookingPayment.model';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
  typescript: true,
});

const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });
  return paymentIntent;
};

const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

const createBookingPaymentRecord = async (
  bookingId: string,
  paymentIntentId: string,
  amount: number,
) => {
  const bookingPayment = new BookingPaymentModel({
    booking: bookingId,
    transactionId: paymentIntentId,
    paymentStatus: 'unpaid',
    amount,
  });
  await bookingPayment.save();
  return bookingPayment;
};

const updateBookingPaymentStatus = async (paymentIntentId: string) => {
  const bookingPayment = await BookingPaymentModel.findOne({
    transactionId: paymentIntentId,
  });

  if (!bookingPayment) {
    throw new Error(
      `Booking payment not found for transaction ID: ${paymentIntentId}`,
    );
  }

  bookingPayment.paymentStatus = 'paid';
  await bookingPayment.save();

  return bookingPayment;
};

const getTotalRevenue = async () => {
  const totalRevenue = await BookingPaymentModel.aggregate([
    {
      $match: { paymentStatus: 'paid' },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  return totalRevenue.length > 0 ? totalRevenue[0].total : 0;
};

export const bookingPaymentServices = {
  createPaymentIntent,
  confirmPayment,
  createBookingPaymentRecord,
  updateBookingPaymentStatus,
  getTotalRevenue,
};
