import { Request, Response } from "express";
import {
  create as createProductService,
  findAll as findAllProductsService,
  findById as findProductByIdService,
  findByStore as findProductsByStoreService,
  update as updateProductService,
  deleteById as deleteProductService,
  updateStock as updateStockService,
} from "../services/ProductService";
import {
  CreateProductRequestBody,
  UpdateProductRequestBody,
  ProductQueryParams,
} from "../Interfaces/product.interface";

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data: CreateProductRequestBody = req.body;
    const result = await createProductService(data, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller create error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const params: ProductQueryParams = {
      category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
      store_id: req.query.store_id ? parseInt(req.query.store_id as string) : undefined,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      in_stock: req.query.in_stock === "true",
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const result = await findAllProductsService(params);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller findAll error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const findById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const result = await findProductByIdService(id);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller findById error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const findByStore = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const storeId = parseInt(req.params.storeId as string);

    if (isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const result = await findProductsByStoreService(storeId, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller findByStore error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

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
        message: "Invalid product ID",
      });
    }

    const data: UpdateProductRequestBody = req.body;
    const result = await updateProductService(id, data, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller update error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

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
        message: "Invalid product ID",
      });
    }

    const result = await deleteProductService(id, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller deleteById error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStock = async (req: Request, res: Response) => {
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
        message: "Invalid product ID",
      });
    }

    const { quantity } = req.body;

    if (!quantity || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const result = await updateStockService(id, quantity, userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Product controller updateStock error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};






