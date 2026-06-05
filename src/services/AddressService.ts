import logger from "../config/logger.config";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  createAddress as createAddressRepo,
  findAddressesByUserId,
  findAddressById,
  findAddressByIdAndUser,
  updateAddress as updateAddressRepo,
  deleteAddressById,
} from "../repositories/address.repository";
import {
  CreateAddressRequestBody,
  UpdateAddressRequestBody,
  AddressResponse,
} from "../Interfaces/address.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";

const formatAddress = (address: any): AddressResponse => ({
  id: address.id,
  street: address.street,
  city: address.city,
  state: address.state ?? null,
  postal_code: address.postal_code ?? null,
  country: address.country,
  created_at: address.created_at,
  updated_at: address.updated_at,
});

export const addAddress = async (
  userId: number,
  data: CreateAddressRequestBody,
): Promise<ServiceResponse<AddressResponse>> => {
  try {
    logger.info(`AddressService addAddress started for user ${userId}`);
    const address = await createAddressRepo(userId, data as any);

    return {
      success: true,
      message: ResponseMessage.ADDRESS_CREATED_SUCCESS,
      data: formatAddress(address),
      statusCode: HttpStatus.CREATED,
    };
  } catch (error: any) {
    logger.error("AddressService addAddress error:", error);
    throw error;
  }
};

export const getAddresses = async (
  userId: number,
): Promise<ServiceResponse<{ addresses: AddressResponse[] }>> => {
  try {
    logger.info(`AddressService getAddresses started for user ${userId}`);
    const addresses = await findAddressesByUserId(userId);

    return {
      success: true,
      message: ResponseMessage.ADDRESSES_RETRIEVED_SUCCESS,
      data: { addresses: addresses.map(formatAddress) },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("AddressService getAddresses error:", error);
    throw error;
  }
};

export const getAddressById = async (
  userId: number,
  addressId: number,
): Promise<ServiceResponse<AddressResponse>> => {
  try {
    logger.info(`AddressService getAddressById started for user ${userId}`);

    const address = await findAddressById(addressId);
    if (!address) {
      throw createError(ResponseMessage.ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (address.user.id !== userId) {
      throw createError(
        ResponseMessage.UNAUTHORIZED_ADDRESS_ACCESS,
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      success: true,
      message: ResponseMessage.ADDRESS_RETRIEVED_SUCCESS,
      data: formatAddress(address),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("AddressService getAddressById error:", error);
    throw error;
  }
};

export const updateAddress = async (
  userId: number,
  addressId: number,
  data: UpdateAddressRequestBody,
): Promise<ServiceResponse<AddressResponse>> => {
  try {
    logger.info(`AddressService updateAddress started for user ${userId}`);

    const existingAddress = await findAddressById(addressId);
    if (!existingAddress) {
      throw createError(ResponseMessage.ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (existingAddress.user.id !== userId) {
      throw createError(
        ResponseMessage.UNAUTHORIZED_ADDRESS_ACCESS,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedAddress = await updateAddressRepo(addressId, data as any);

    return {
      success: true,
      message: ResponseMessage.ADDRESS_UPDATED_SUCCESS,
      data: formatAddress(updatedAddress),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("AddressService updateAddress error:", error);
    throw error;
  }
};

export const deleteAddress = async (
  userId: number,
  addressId: number,
): Promise<ServiceResponse<null>> => {
  try {
    logger.info(`AddressService deleteAddress started for user ${userId}`);

    const existingAddress = await findAddressById(addressId);
    if (!existingAddress) {
      throw createError(ResponseMessage.ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (existingAddress.user.id !== userId) {
      throw createError(
        ResponseMessage.UNAUTHORIZED_ADDRESS_ACCESS,
        HttpStatus.FORBIDDEN,
      );
    }

    await deleteAddressById(addressId);

    return {
      success: true,
      message: ResponseMessage.ADDRESS_DELETED_SUCCESS,
      data: null,
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("AddressService deleteAddress error:", error);
    throw error;
  }
};
