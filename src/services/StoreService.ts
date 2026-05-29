import {
  createStore,
  findStoreById,
  findAllStores,
  findStoresByUserId,
  updateStore,
  deleteStore,
  storeExists,
} from "../repositories/store.repository";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  CreateStoreRequestBody,
  UpdateStoreRequestBody,
  StoreResponse,
  StoreListResponse,
} from "../Interfaces/store.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";

// Create store  
export const create = async (
  data: CreateStoreRequestBody,
  userId: number
): Promise<ServiceResponse<StoreResponse>> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw createError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Check if store name already exists for this user
    const exists = await storeExists(data.store_name, userId);
    if (exists) {
      throw createError(ResponseMessage.STORE_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const store = await createStore({
      store_name: data.store_name.trim(),
      store_description: data.store_description?.trim() || null,
      store_logo: data.store_logo?.trim() || null,
      user,
    });

    return {
      success: true,
      message: ResponseMessage.STORE_CREATED_SUCCESS,
      data: {
        id: store.id,
        store_name: store.store_name,
        store_description: store.store_description,
        store_logo: store.store_logo,
        user: {
          id: store.user.id,
          first_name: store.user.first_name,
          last_name: store.user.last_name,
          email: store.user.user_email,
        },
        created_at: store.created_at,
      },
      statusCode: HttpStatus.CREATED,
    };
  } catch (error: any) {
    console.error("Store service create error:", error);
    throw error;
  }
};

// find all stores
export const findAll = async (): Promise<ServiceResponse<StoreListResponse>> => {
  try {
    const stores = await findAllStores();

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        stores: stores.map((store) => ({
          id: store.id,
          store_name: store.store_name,
          store_description: store.store_description,
          store_logo: store.store_logo,
          user: {
            id: store.user.id,
            first_name: store.user.first_name,
            last_name: store.user.last_name,
            email: store.user.user_email,
          },
          created_at: store.created_at,
        })),
        total: stores.length,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Store service findAll error:", error);
    throw error;
  }
};
// find store by Id
export const findById = async (
  id: number
): Promise<ServiceResponse<StoreResponse>> => {
  try {
    const store = await findStoreById(id);

    if (!store) {
      throw createError(ResponseMessage.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        id: store.id,
        store_name: store.store_name,
        store_description: store.store_description,
        store_logo: store.store_logo,
        user: {
          id: store.user.id,
          first_name: store.user.first_name,
          last_name: store.user.last_name,
          email: store.user.user_email,
        },
        created_at: store.created_at,
        updated_at: store.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Store service findById error:", error);
    throw error;
  }
};

// find stores by user  
export const findByUser = async (
  userId: number
): Promise<ServiceResponse<StoreListResponse>> => {
  try {
    const stores = await findStoresByUserId(userId);

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        stores: stores.map((store) => ({
          id: store.id,
          store_name: store.store_name,
          store_description: store.store_description,
          store_logo: store.store_logo,
          user: {
            id: store.user.id,
            first_name: store.user.first_name,
            last_name: store.user.last_name,
            email: store.user.user_email,
          },
          created_at: store.created_at,
        })),
        total: stores.length,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Store service findByUser error:", error);
    throw error;
  }
};

// Update store  

export const update = async (
  id: number,
  data: UpdateStoreRequestBody,
  userId: number
): Promise<ServiceResponse<StoreResponse>> => {
  try {
    const store = await findStoreById(id);

    if (!store) {
      throw createError(ResponseMessage.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify user owns the store
    if (store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_STORE_ACCESS, HttpStatus.FORBIDDEN);
    }

    // Check if store name already exists (if being updated)
    if (data.store_name) {
      const exists = await storeExists(data.store_name, userId);
      if (exists && store.store_name !== data.store_name) {
        throw createError(ResponseMessage.STORE_ALREADY_EXISTS, HttpStatus.CONFLICT);
      }
      data.store_name = data.store_name.trim();
    }

    if (data.store_description !== undefined) {
      data.store_description = data.store_description?.trim() || null;
    }

    if (data.store_logo !== undefined) {
      data.store_logo = data.store_logo?.trim() || null;
    }

    await updateStore(id, data);
    
    const updatedStore = await findStoreById(id);
    if (!updatedStore) {
        throw createError (
            ResponseMessage.STORE_NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    }
    return {
      success: true,
      message: ResponseMessage.STORE_UPDATED_SUCCESS,
      data: {
        id: updatedStore.id,
        store_name: updatedStore.store_name,
        store_description: updatedStore.store_description,
        store_logo: updatedStore.store_logo,
        user: {
          id: updatedStore.user.id,
          first_name: updatedStore.user.first_name,
          last_name: updatedStore.user.last_name,
          email: updatedStore.user.user_email,
        },
        updated_at: updatedStore.updated_at,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Store service update error:", error);
    throw error;
  }
};

// delete store  
export const deleteById = async (
  id: number,
  userId: number
): Promise<ServiceResponse<void>> => {
  try {
    const store = await findStoreById(id);

    if (!store) {
      throw createError(ResponseMessage.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify user owns the store
    if (store.user.id !== userId) {
      throw createError(ResponseMessage.UNAUTHORIZED_STORE_ACCESS, HttpStatus.FORBIDDEN);
    }

    await deleteStore(id);

    return {
      success: true,
      message: ResponseMessage.STORE_DELETED_SUCCESS,
      data: undefined,
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Store service deleteById error:", error);
    if (error.message === "Cannot delete store with associated products") {
      throw createError(
        ResponseMessage.CANNOT_DELETE_STORE_WITH_PRODUCTS,
        HttpStatus.BAD_REQUEST
      );
    }
    throw error;
  }
};








