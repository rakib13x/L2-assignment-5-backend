import { Router } from 'express';
import { AuthRoutes } from './route/auth.route';
import { BookingRoutes } from './route/booking.route';
import { CarRoutes } from './route/car.route';
import { getUserRoutes } from './route/getUser.route';
import { UserRoutes } from './route/user.route';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleRoutes = [
  {
    path: '/auth/signup',
    route: UserRoutes,
  },
  {
    path: '/cars',
    route: CarRoutes,
  },
  {
    path: '/users',
    route: getUserRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/auth/signin',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
