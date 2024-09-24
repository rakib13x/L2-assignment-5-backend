// booking.model.ts
import { Schema, model } from 'mongoose';
import { TBooking } from '../interface/booking.interface';

const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) =>
          /^([01]\d|2[0-3]):?([0-5]\d)$/.test(value),
        message: (props: any) =>
          `${props.value} is not a valid 24-hour time format!`,
      },
    },
    endTime: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const BookingModel = model<TBooking>('Booking', bookingSchema);
