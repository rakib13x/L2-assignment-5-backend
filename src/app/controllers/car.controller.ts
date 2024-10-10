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
  const carData = req.body;

  // Log the body and file for debugging
  console.log('Request Body:', req.body); // Logs form data
  console.log('Request File:', req.file); // Logs the uploaded file

  // Convert `isElectric` to boolean
  carData.isElectric = carData.isElectric === 'true';

  // Convert `features` from string back to array (it's sent as a JSON string)
  carData.features = JSON.parse(carData.features);

  // Convert `pricePerHour` to number
  carData.pricePerHour = parseFloat(carData.pricePerHour);

  // Handle image upload
  if (req.file && req.file.path) {
    carData.image = req.file.path; // Set the image URL from Cloudinary
  } else {
    return res.status(400).json({
      success: false,
      message: 'Image is required and was not uploaded',
    });
  }

  // Now create the car entry in the database
  const result = await CarServices.createCarsIntoDB(carData);

  // Respond to the client with success message
  res.status(201).json({
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

  // Check if priceRange is provided; default range will apply only if it's missing
  const priceRange = parseNumberArrayParam(
    req.query.priceRange,
    [10, 99999999999999],
  );

  // Define filters dynamically
  const filters: CarFilters = {
    manufacturers,
    vehicleTypes,
  };

  // Only apply price range filter if valid price range is provided
  if (priceRange.length === 2 && priceRange[0] < priceRange[1]) {
    filters.priceRange = priceRange;
  }

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
