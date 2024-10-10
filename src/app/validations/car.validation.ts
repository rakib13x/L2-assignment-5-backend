import { z } from 'zod';

export const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    color: z.string().min(1),
    // isElectric: z.boolean().optional(),
    // features: z.array(z.string()).optional(),
    // pricePerHour: z.number().optional(),
    Manufacturers: z.string().min(1),
    vehicleType: z.string().min(1),
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
