export interface TCar {
  name: string;
  image: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  Manufacturers: string;
  vehicleType: string;
  status: 'available' | 'not available';
  isDeleted: boolean;
  bookingCount: number;
}

export interface CarFilters {
  manufacturers?: string[];
  vehicleTypes?: string[];
  priceRange?: number[];
}

export interface QueryType {
  isDeleted: boolean;
  $and?: Record<string, unknown>[];
}
