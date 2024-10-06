import { Schema, model } from 'mongoose';
import { TCar } from '../interface/car.interface';

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isElectric: {
      type: Boolean,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    Manufacturers: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'not available'],
      default: 'available',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bookingCount: {
      type: Number,
    },
  },
  { timestamps: true },
);

export const CarModel = model<TCar>('Car', carSchema);
