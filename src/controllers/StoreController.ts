import { Request, Response } from "express";
import {
  create as createStoreService,
  findAll as findAllStoresService,
  findById as findStoreByIdService,
  findByUser as findStoresByUserService,
  update as updateStoreService,
  deleteById as deleteStoreService,
} from "../services/StoreService";
import {
  CreateStoreRequestBody,
  UpdateStoreRequestBody,
} from "../Interfaces/store.interface";

// CREATE STORE 
export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data: CreateStoreRequestBody = req.body;
    const result = await createStoreService(data, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller create error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// FIND ALL STORES 
export const findAll = async (req: Request, res: Response) => {
  try {
    const result = await findAllStoresService();

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller findAll error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// FIND STORE BY ID 
export const findById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const result = await findStoreByIdService(id);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller findById error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

//  FIND STORES BY USER 
export const findByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await findStoresByUserService(userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller findByUser error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE STORE 
export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const data: UpdateStoreRequestBody = req.body;
    const result = await updateStoreService(id, data, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller update error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

//  DELETE STORE 
export const deleteById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const result = await deleteStoreService(id, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Store controller deleteById error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};















