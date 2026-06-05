import { Request, Response } from "express";
import logger from "../config/logger.config";
import {
  addAddress as addAddressService,
  getAddresses as getAddressesService,
  getAddressById as getAddressByIdService,
  updateAddress as updateAddressService,
  deleteAddress as deleteAddressService,
} from "../services/AddressService";
import {
  CreateAddressRequestBody,
  UpdateAddressRequestBody,
} from "../Interfaces/address.interface";

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data: CreateAddressRequestBody = req.body;
    const result = await addAddressService(userId, data);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    logger.error("AddressController addAddress error:", error);
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await getAddressesService(userId);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    logger.error("AddressController getAddresses error:", error);
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const addressId = parseInt(req.params.id as string, 10);
    if (Number.isNaN(addressId)) {
      return res.status(400).json({ success: false, message: "Invalid address ID" });
    }

    const result = await getAddressByIdService(userId, addressId);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    logger.error("AddressController getAddressById error:", error);
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const addressId = parseInt(req.params.id as string, 10);
    if (Number.isNaN(addressId)) {
      return res.status(400).json({ success: false, message: "Invalid address ID" });
    }

    const data: UpdateAddressRequestBody = req.body;
    const result = await updateAddressService(userId, addressId, data);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    logger.error("AddressController updateAddress error:", error);
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const addressId = parseInt(req.params.id as string, 10);
    if (Number.isNaN(addressId)) {
      return res.status(400).json({ success: false, message: "Invalid address ID" });
    }

    const result = await deleteAddressService(userId, addressId);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    logger.error("AddressController deleteAddress error:", error);
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
