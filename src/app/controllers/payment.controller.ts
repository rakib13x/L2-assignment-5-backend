import { Request, Response } from 'express';
import { BookingModel } from '../model/booking.model';
import { bookingPaymentServices } from '../services/payment.service';

export const createBookingPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const { amount, bookingId } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  if (!bookingId) {
    return res
      .status(400)
      .json({ success: false, message: 'Booking ID is required' });
  }

  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    const paymentIntent =
      await bookingPaymentServices.createPaymentIntent(amount);

    await bookingPaymentServices.createBookingPaymentRecord(
      bookingId,
      paymentIntent.id,
      amount,
    );

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const confirmBookingPaymentController = async (
  req: Request,
  res: Response,
) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res
      .status(400)
      .json({ success: false, message: 'PaymentIntent ID is required' });
  }

  try {
    const paymentIntent =
      await bookingPaymentServices.confirmPayment(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const bookingPayment =
        await bookingPaymentServices.updateBookingPaymentStatus(
          paymentIntentId,
        );

      const booking = await BookingModel.findById(bookingPayment.booking);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: 'Booking not found' });
      }

      booking.payStatus = 'paid';
      await booking.save();

      res.json({ success: true, paymentIntent, bookingPayment });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed successfully',
      });
    }
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTotalRevenueController = async (
  req: Request,
  res: Response,
) => {
  try {
    const totalRevenue = await bookingPaymentServices.getTotalRevenue();

    res.json({
      success: true,
      message: 'Total revenue retrieved successfully',
      totalRevenue,
    });
  } catch (error: any) {
    console.error('Error fetching total revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve total revenue',
    });
  }
};
