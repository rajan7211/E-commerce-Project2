import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Address } from "../entities/Address";

const getAddressRepository = (): Repository<Address> => {
  return AppDataSource.getRepository(Address);
};

export const createAddress = async (
  userId: number,
  addressData: Partial<Address>,
): Promise<Address> => {
  try {
    const repository = getAddressRepository();
    const address = repository.create({
      ...addressData,
      user: { id: userId },
    });

    return await repository.save(address);
  } catch (error: any) {
    console.error("Address repository createAddress error:", error);
    throw error;
  }
};

export const findAddressesByUserId = async (
  userId: number,
): Promise<Address[]> => {
  try {
    const repository = getAddressRepository();
    return await repository.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  } catch (error: any) {
    console.error("Address repository findAddressesByUserId error:", error);
    throw error;
  }
};

export const findAddressById = async (
  id: number,
): Promise<Address | null> => {
  try {
    const repository = getAddressRepository();
    return await repository.findOne({
      where: { id },
      relations: ["user"],
    });
  } catch (error: any) {
    console.error("Address repository findAddressById error:", error);
    throw error;
  }
};

export const findAddressByIdAndUser = async (
  userId: number,
  id: number,
): Promise<Address | null> => {
  try {
    const repository = getAddressRepository();
    return await repository.findOne({
      where: { id, user: { id: userId } },
    });
  } catch (error: any) {
    console.error("Address repository findAddressByIdAndUser error:", error);
    throw error;
  }
};

export const updateAddress = async (
  addressId: number,
  data: Partial<Address>,
): Promise<Address> => {
  try {
    const repository = getAddressRepository();
    await repository.update(addressId, data);
    const address = await repository.findOne({ where: { id: addressId } });
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  } catch (error: any) {
    console.error("Address repository updateAddress error:", error);
    throw error;
  }
};

export const deleteAddressById = async (addressId: number): Promise<void> => {
  try {
    const repository = getAddressRepository();
    await repository.delete(addressId);
  } catch (error: any) {
    console.error("Address repository deleteAddressById error:", error);
    throw error;
  }
};
