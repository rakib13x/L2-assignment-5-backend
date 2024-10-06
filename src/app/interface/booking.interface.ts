import { Types } from 'mongoose';

export interface TPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  nidNumber: string;
  drivingLicense: string;
}

export interface TExtraFeatures {
  insurance: boolean;
  gps: boolean;
}

export interface TBooking {
  date: Date;
  startTime: string;
  endTime: string | null;
  user: Types.ObjectId;
  car: Types.ObjectId;
  totalCost: number;
  carPricePerHour: number;
  additionalFeaturesCost: number;
  personalInfo: TPersonalInfo;
  extraFeatures: TExtraFeatures;
  status: 'pending' | 'approved' | 'canceled';
  payStatus: 'paid' | 'unpaid';
}
