import { Schema, model } from 'mongoose';
import { TBooking } from '../interface/booking.interface';

const personalInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  nidNumber: { type: String, required: true },
  drivingLicense: { type: String, required: true },
});

const extraFeaturesSchema = new Schema({
  insurance: { type: Boolean, default: false },
  gps: { type: Boolean, default: false },
});

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
    personalInfo: {
      type: personalInfoSchema,
    },
    extraFeatures: {
      type: extraFeaturesSchema,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    carPricePerHour: {
      type: Number,
    },
    additionalFeaturesCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
    payStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
  },
  { timestamps: true },
);

export const BookingModel = model<TBooking>('Booking', bookingSchema);
