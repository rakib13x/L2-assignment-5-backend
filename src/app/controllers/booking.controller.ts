import httpStatus from 'http-status';
import { isValidObjectId, Types } from 'mongoose';
import { TBooking } from '../interface/booking.interface';
import { CarModel } from '../model/car.model';
import { BookingServices } from '../services/booking.service';
import catchAsync from '../utils/catchAsync';
import { isValidDate } from '../utils/isValidDate';
import sendResponse from '../utils/sendResponse';
import { createBookingValidationSchema } from '../validations/booking.validation';

export const createBooking = catchAsync(async (req, res) => {
  const { endTime, totalCost, ...bookingData } = req.body;
  const userId = req.user._id;

  if (endTime || totalCost) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'You cannot set endTime or totalCost when creating a booking.',
      data: null,
    });
  }

  const validatedData = createBookingValidationSchema.parse({
    body: bookingData,
  });

  const bookingDataWithObjectId = {
    ...validatedData.body,
    car: new Types.ObjectId(validatedData.body.carId),
  };

  const result = await BookingServices.createBookingIntoDB(
    bookingDataWithObjectId,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car booked successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User ID is missing from request.',
      data: null,
    });
  }

  const bookings = await BookingServices.getMyBookingsFromDb(userId);

  if (bookings.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Bookings retrieved successfully',
    data: bookings,
  });
});

export const getBookingById = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  const booking = await BookingServices.getBookingById(bookingId);

  if (!booking) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Booking not found.',
      data: null,
    });
  }

  if (booking.user.toString() !== userId.toString()) {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You are not authorized to view this booking.',
      data: null,
    });
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retrieved successfully.',
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { carId, date } = req.query;
  console.log('Incoming request query:', req.query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filter: any = {};

  if (carId && isValidObjectId(carId as string)) {
    filter.car = carId as string;
  }

  if (date && isValidDate(date as string)) {
    filter.date = new Date(date as string);
  }

  const bookings = await BookingServices.getAllBookingsfromdb(filter);
  console.log('Retrieved bookings:', bookings);

  if (bookings.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        filter && Object.keys(filter).length > 0
          ? 'No bookings match the provided filters'
          : 'No bookings available in the system',
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});

export const updateBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  const booking = await BookingServices.getBookingById(bookingId);

  if (!booking || booking.user.toString() !== userId.toString()) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Booking not found or you are not authorized.',
      data: null,
    });
  }

  if (booking.status === 'approved') {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Cannot modify an approved booking.',
      data: null,
    });
  }

  const { date, startTime } = req.body;
  const updateData: Partial<TBooking> = {};

  if (date) updateData.date = date;
  if (startTime) updateData.startTime = startTime;

  if (Object.keys(updateData).length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No valid fields provided for update.',
      data: null,
    });
  }

  const updatedBooking = await BookingServices.updateBooking(
    bookingId,
    updateData,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking updated successfully.',
    data: updatedBooking,
  });
});

export const cancelBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;

  const booking = await BookingServices.getBookingById(bookingId);

  if (!booking) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Booking not found or you are not authorized.',
      data: null,
    });
  }

  if (booking.status === 'approved') {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Cannot cancel an approved booking.',
      data: null,
    });
  }

  const canceledBooking = await BookingServices.cancelBookingService(bookingId);

  if (!canceledBooking) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Failed to cancel the booking. Booking may not exist.',
      data: null,
    });
  }

  await CarModel.findByIdAndUpdate(canceledBooking.car, {
    status: 'available',
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking canceled successfully and car is now available.',
    data: canceledBooking,
  });
});

export const approveBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;

  const booking = await BookingServices.getBookingById(bookingId);

  if (!booking) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Booking not found.',
      data: null,
    });
  }

  if (booking.status !== 'pending') {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Only pending bookings can be approved.',
      data: null,
    });
  }

  const approvedBooking =
    await BookingServices.approveBookingService(bookingId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking approved successfully.',
    data: approvedBooking,
  });
});

export const getBookingStats = catchAsync(async (req, res) => {
  const totalPendingBookings = await BookingServices.getTotalPendingBookings();
  const totalApprovedBookings =
    await BookingServices.getTotalApprovedBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking statistics retrieved successfully',
    data: {
      totalPendingBookings,
      totalApprovedBookings,
    },
  });
});

export const bookingControllers = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  getBookingById,
  cancelBooking,
  approveBooking,
  getBookingStats,
};
