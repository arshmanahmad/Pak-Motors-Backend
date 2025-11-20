import { Request, Response } from "express";
import { Person } from "../models/person.model";
import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

// Create a new person
export const createPerson = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body; // Data is already validated by middleware

    const person = new Person(validatedData);
    await person.save();

    ApiResponse.success(
      res,
      StatusCodes.CREATED,
      "Person created successfully",
      person
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get all persons with pagination and filtering
export const getAllPersons = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query; // Data is already validated by middleware

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { fatherName: { $regex: search, $options: "i" } },
        { cast: { $regex: search, $options: "i" } },
        { cnic: { $regex: search, $options: "i" } },
        { phone1: { $regex: search, $options: "i" } },
        { phone2: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const persons = await Person.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Person.countDocuments(filter);

    ApiResponse.success(res, StatusCodes.OK, "Persons retrieved successfully", {
      persons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get person by ID
export const getPersonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID is already validated by middleware

    const person = await Person.findById(id).populate("userId", "name email");

    if (!person) {
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Person not found",
        null
      );
    }

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Person retrieved successfully",
      person
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};
