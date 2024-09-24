import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { CarFilters } from '../interface/car.interface';
import { CarServices } from '../services/car.service';
import catchAsync from '../utils/catchAsync';
import { parseQueryParamToInt } from '../utils/ParseIntegers';
import { parseNumberArrayParam } from '../utils/ParseNumber';
import { parseStringArrayParam } from '../utils/ParseString';
import sendResponse from '../utils/sendResponse';

const createCars = catchAsync(async (req, res) => {
  const result = await CarServices.createCarsIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car created successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const pageNumber = parseQueryParamToInt(req.query.page, 1);
  const pageLimit = parseQueryParamToInt(req.query.limit, 4);

  const manufacturers = parseStringArrayParam(req.query.manufacturers);
  const vehicleTypes = parseStringArrayParam(req.query.vehicleTypes);
  const priceRange = parseNumberArrayParam(req.query.priceRange, [10, 155]);

  const filters: CarFilters = {
    manufacturers,
    vehicleTypes,
    priceRange,
  };

  const { cars, totalPages, total } = await CarServices.getAllCarsFromDb(
    filters,
    pageNumber,
    pageLimit,
  );

  if (pageNumber > totalPages && totalPages !== 0) {
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
    message: 'Cars retrieved successfully',
    data: cars,
    totalPages,
    currentPage: pageNumber,
    totalItems: total,
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await CarServices.getSingleCarFromDb(carId);

  if (!result || result.isDeleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Car retrieved successfully',
    data: result,
  });
});
const updateCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const updatedCar = req.body;
  const result = await CarServices.updateCarInDb(carId, updatedCar);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

const deleteCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await CarServices.deleteCarFromDb(carId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Deleted successfully',
    data: result,
  });
});

const returnCar = catchAsync(async (req, res) => {
  const { bookingId, endTime } = req.body;

  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid Booking ID',
      data: null,
    });
  }

  try {
    const result = await CarServices.returnCarInDb(bookingId, endTime);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car returned successfully',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      data: null,
    });
  }
});

export const CarControllers = {
  createCars,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
  returnCar,
};
