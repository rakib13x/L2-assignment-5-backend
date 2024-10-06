import mongoose, { Document, Schema } from 'mongoose';

interface IBookingPayment extends Document {
  booking: Schema.Types.ObjectId;
  transactionId: string;
  paymentStatus: 'paid' | 'unpaid';
  amount: number;
}

const bookingPaymentSchema = new Schema<IBookingPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    transactionId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

export const BookingPaymentModel = mongoose.model<IBookingPayment>(
  'BookingPayment',
  bookingPaymentSchema,
);
