import { z } from 'zod';

export const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: 'Car name is required!' }),
    image: z.string().min(2, { message: 'Car image is required!' }),
    description: z.string().min(5, { message: 'Car description is required!' }),
    color: z.string().min(3, { message: 'Car color is required!' }),
    isElectric: z.boolean(),
    features: z.array(z.string()),
    pricePerHour: z.number({ message: 'price is required!' }),
    Manufacturers: z.string({ message: 'Manufacturers name is required' }),
    vehicleType: z.string({ message: 'VehicleType name is required' }),
    status: z.enum(['available', 'not available']).default('available'),
    isDeleted: z.boolean().default(false),
  }),
});
export const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: 'Car name is required!' }).optional(),
    description: z
      .string()
      .min(5, { message: 'Car description is required!' })
      .optional(),
    color: z.string().min(3, { message: 'Car color is required!' }).optional(),
    isElectric: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number({ message: 'price is required!' }).optional(),
    Manufacturers: z.string({ message: 'Manufacturers name is required' }),
    vehicleType: z.string({ message: 'VehicleType name is required' }),
    status: z
      .enum(['available', 'not available'])
      .default('available')
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});
