import {
  create as createProductRepo,
  findAll as findAllProductsRepo,
  findById as findProductByIdRepo,
  findByStoreId as findProductsByStoreIdRepo,
  update as updateProductRepo,
  deleteById as deleteProductRepo,
  productExists as checkProductExists,
  updateStock as updateStockRepo,
} from "../repositories/product.repository";
import { Category } from "../entities/Category";
import { Store } from "../entities/Store";
import { AppDataSource } from "../config/data-source";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  CreateProductRequestBody,
  UpdateProductRequestBody,
  ProductResponse,
  ProductListResponse,
  ProductQueryParams,
} from "../Interfaces/product.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";

// Helper to generate image URLs
const generateImageUrls = (files: Express.Multer.File[]): string[] => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return files.map((file) => `${baseUrl}/public/uploads/products/${file.filename}`);
};


// CREATE PRODUCT
export const create = async (
  data: CreateProductRequestBody,
  userId: number,
  files?: Express.Multer.File[]
): Promise<ServiceResponse<ProductResponse>> => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const storeRepository = AppDataSource.getRepository(Store);

    // Verify category exists
    const category = await categoryRepository.findOne({ where: { id: data.category_id } });
    if (!category) {
      throw createError(ResponseMessage.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify store exists and belongs to user
    const store = await storeRepository.findOne({
      where: { id: data.store_id },
      relations: ["user"],
    });

    if (!store) {
      throw createError(ResponseMessage.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_PRODUCT_ACCESS, HttpStatus.FORBIDDEN);
    }

    // Check if product already exists in this store
    const exists = await checkProductExists(data.product_name, data.store_id);
    if (exists) {
      throw createError(ResponseMessage.PRODUCT_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    // Generate image URLs if files uploaded
    const images = files && files.length > 0 ? generateImageUrls(files) : null;

    const product = await createProductRepo({
      product_name: data.product_name.trim(),
      product_price: data.product_price,
      product_description: data.product_description?.trim() || null,
      stock: data.stock,
      images,
      category,
      store,
    });

    return {
      success: true,
      message: ResponseMessage.PRODUCT_CREATED_SUCCESS,
      data: {
        product_id: product.product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_description: product.product_description,
        stock: product.stock,
        images: product.images,
        category: {
          id: product.category.id,
          category_name: product.category.category_name,
        },
        store: {
          id: product.store.id,
          store_name: product.store.store_name,
        },
        created_at: product.created_at,
      },
      statusCode: HttpStatus.CREATED,
    };
  } catch (error: any) {
    console.error("Product service create error:", error);
    throw error;
  }
};

// find all product   
export const findAll = async (
  params?: ProductQueryParams
): Promise<ServiceResponse<ProductListResponse>> => {
  try {
    const { products, total } = await findAllProductsRepo(params);

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        products: products.map((product) => ({
          product_id: product.product_id,
          product_name: product.product_name,
          product_price: product.product_price,
          product_description: product.product_description,
          stock: product.stock,
          images: product.images,
          category: {
            id: product.category.id,
            category_name: product.category.category_name,
          },
          store: {
            id: product.store.id,
            store_name: product.store.store_name,
          },
        })),
        total,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service findAll error:", error);
    throw error;
  }
};

//  FIND PRODUCT BY ID 
export const findById = async (
  id: number
): Promise<ServiceResponse<ProductResponse>> => {
  try {
    const product = await findProductByIdRepo(id);

    if (!product) {
      throw createError(ResponseMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        product_id: product.product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_description: product.product_description,
        stock: product.stock,
        images: product.images,
        category: {
          id: product.category.id,
          category_name: product.category.category_name,
        },
        store: {
          id: product.store.id,
          store_name: product.store.store_name,
        },
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service findById error:", error);
    throw error;
  }
};

// FIND PRODUCTS BY STORE
export const findByStore = async (
  storeId: number,
  userId: number
): Promise<ServiceResponse<ProductListResponse>> => {
  try {
    const storeRepository = AppDataSource.getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: storeId },
      relations: ["user"],
    });

    if (!store) {
      throw createError(ResponseMessage.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_PRODUCT_ACCESS, HttpStatus.FORBIDDEN);
    }

    const products = await findProductsByStoreIdRepo(storeId);

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        products: products.map((product) => ({
          product_id: product.product_id,
          product_name: product.product_name,
          product_price: product.product_price,
          product_description: product.product_description,
          stock: product.stock,
          images: product.images,
          category: {
            id: product.category.id,
            category_name: product.category.category_name,
          },
          store: {
            id: product.store.id,
            store_name: product.store.store_name,
          },
        })),
        total: products.length,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service findByStore error:", error);
    throw error;
  }
};

// UPDATE PRODUCT 
export const update = async (
  id: number,
  data: UpdateProductRequestBody,
  userId: number,
  files?: Express.Multer.File[]
): Promise<ServiceResponse<ProductResponse>> => {
  try {
    const product = await findProductByIdRepo(id);

    if (!product) {
      throw createError(ResponseMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify ownership
    const storeRepository = AppDataSource.getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: product.store.id },
      relations: ["user"],
    });

    if (!store || store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_PRODUCT_ACCESS, HttpStatus.FORBIDDEN);
    }

    // Update object
    const updateData: any = {};

    // Product name
    if (data.product_name !== undefined) {
      updateData.product_name = data.product_name.trim();
    }

    // Product price
    if (data.product_price !== undefined) {
      updateData.product_price = data.product_price;
    }

    // Product description
    if (data.product_description !== undefined) {
      updateData.product_description = data.product_description?.trim() || null;
    }

    // Stock
    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }

    // Images (if new files uploaded)
    if (files && files.length > 0) {
      updateData.images = generateImageUrls(files);
    }

    // Category
    if (data.category_id !== undefined && data.category_id !== null) {
      const categoryRepository = AppDataSource.getRepository(Category);
      const category = await categoryRepository.findOne({
        where: { id: data.category_id },
      });

      if (!category) {
        throw createError(ResponseMessage.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      updateData.category = category;
    }

    // Update product
    const updatedProduct = await updateProductRepo(id, updateData);

    return {
      success: true,
      message: ResponseMessage.PRODUCT_UPDATED_SUCCESS,
      data: {
        product_id: updatedProduct.product_id,
        product_name: updatedProduct.product_name,
        product_price: updatedProduct.product_price,
        product_description: updatedProduct.product_description,
        stock: updatedProduct.stock,
        images: updatedProduct.images,
        category: {
          id: updatedProduct.category.id,
          category_name: updatedProduct.category.category_name,
        },
        store: {
          id: updatedProduct.store.id,
          store_name: updatedProduct.store.store_name,
        },
        updated_at: updatedProduct.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service update error:", error);
    throw error;
  }
};

// DELETE PRODUCT 
export const deleteById = async (
  id: number,
  userId: number
): Promise<ServiceResponse<void>> => {
  try {
    const product = await findProductByIdRepo(id);

    if (!product) {
      throw createError(ResponseMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify user owns the store
    const storeRepository = AppDataSource.getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: product.store.id },
      relations: ["user"],
    });

    if (!store || store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_PRODUCT_ACCESS, HttpStatus.FORBIDDEN);
    }

    await deleteProductRepo(id);

    return {
      success: true,
      message: ResponseMessage.PRODUCT_DELETED_SUCCESS,
      data: undefined,
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service deleteById error:", error);
    throw error;
  }
};

// UPDATE STOCK 
export const updateStock = async (
  productId: number,
  quantity: number,
  userId: number
): Promise<ServiceResponse<ProductResponse>> => {
  try {
    const product = await findProductByIdRepo(productId);

    if (!product) {
      throw createError(ResponseMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify user owns the store
    const storeRepository = AppDataSource.getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: product.store.id },
      relations: ["user"],
    });

    if (!store || store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_PRODUCT_ACCESS, HttpStatus.FORBIDDEN);
    }

    const updatedProduct = await updateStockRepo(productId, quantity);

    return {
      success: true,
      message: ResponseMessage.PRODUCT_UPDATED_SUCCESS,
      data: {
        product_id: updatedProduct.product_id,
        product_name: updatedProduct.product_name,
        product_price: updatedProduct.product_price,
        product_description: updatedProduct.product_description,
        stock: updatedProduct.stock,
        images: updatedProduct.images,
        category: {
          id: updatedProduct.category.id,
          category_name: updatedProduct.category.category_name,
        },
        store: {
          id: updatedProduct.store.id,
          store_name: updatedProduct.store.store_name,
        },
        updated_at: updatedProduct.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Product service updateStock error:", error);
    if (error.message === "Insufficient stock") {
      throw createError(ResponseMessage.PRODUCT_OUT_OF_STOCK, HttpStatus.BAD_REQUEST);
    }
    throw error;
  }
};




















