import {
  create as createCategoryRepo,
  findAll as findAllCategoriesRepo,
  findById as findCategoryByIdRepo,
  update as updateCategoryRepo,
  deleteById as deleteCategoryRepo,
  categoryExists as checkCategoryExists,
} from "../repositories/category.repository";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
  CategoryResponse,
  CategoryListResponse,
} from "../Interfaces/category.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";

export const create = async (
  data: CreateCategoryRequestBody
): Promise<ServiceResponse<CategoryResponse>> => {
  try {
    const normalizedCategoryName = data.category_name.trim();

    const exists = await checkCategoryExists(normalizedCategoryName);
    if (exists) {
      throw createError(ResponseMessage.CATEGORY_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const category = await createCategoryRepo({
      category_name: normalizedCategoryName,
    });

    return {
      success: true,
      message: ResponseMessage.CATEGORY_CREATED_SUCCESS,
      data: {
        id: category.id,
        category_name: category.category_name,
        created_at: category.created_at,
      },
      statusCode: HttpStatus.CREATED,
    };
  } catch (error: any) {
    console.error("Category service create error:", error);
    throw error;
  }
};

export const findAll = async (): Promise<ServiceResponse<CategoryListResponse>> => {
  try {
    const categories = await findAllCategoriesRepo();

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        categories: categories.map((cat) => ({
          id: cat.id,
          category_name: cat.category_name,
        })),
        total: categories.length,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Category service findAll error:", error);
    throw error;
  }
};

export const findById = async (
  id: number
): Promise<ServiceResponse<CategoryResponse>> => {
  try {
    const category = await findCategoryByIdRepo(id);

    if (!category) {
      throw createError(ResponseMessage.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        id: category.id,
        category_name: category.category_name,
        created_at: category.created_at,
        updated_at: category.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Category service findById error:", error);
    throw error;
  }
};

export const update = async (
  id: number,
  data: UpdateCategoryRequestBody
): Promise<ServiceResponse<CategoryResponse>> => {
  try {
    const category = await findCategoryByIdRepo(id);

    if (!category) {
      throw createError(ResponseMessage.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (data.category_name) {
      const normalizedCategoryName = data.category_name.trim();
      const exists = await checkCategoryExists(normalizedCategoryName);

      if (exists && category.category_name !== normalizedCategoryName) {
        throw createError(ResponseMessage.CATEGORY_ALREADY_EXISTS, HttpStatus.CONFLICT);
      }

      data.category_name = normalizedCategoryName;
    }

    const updatedCategory = await updateCategoryRepo(id, data);

    return {
      success: true,
      message: ResponseMessage.CATEGORY_UPDATED_SUCCESS,
      data: {
        id: updatedCategory.id,
        category_name: updatedCategory.category_name,
        updated_at: updatedCategory.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Category service update error:", error);
    throw error;
  }
};

export const deleteById = async (
  id: number
): Promise<ServiceResponse<void>> => {
  try {
    const category = await findCategoryByIdRepo(id);

    if (!category) {
      throw createError(ResponseMessage.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await deleteCategoryRepo(id);

    return {
      success: true,
      message: ResponseMessage.CATEGORY_DELETED_SUCCESS,
      data: undefined,
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Category service deleteById error:", error);
    if (error.message === "Cannot delete category with associated products") {
      throw createError(
        ResponseMessage.CANNOT_DELETE_CATEGORY_WITH_PRODUCTS,
        HttpStatus.BAD_REQUEST
      );
    }
    throw error;
  }
};











