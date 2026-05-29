import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Store } from "../entities/Store";
import { Product } from "../entities/Product";

const getRepository = (): Repository<Store> => {
  return AppDataSource.getRepository(Store);
};

// Create store  
export const createStore = async (storeData: {
  store_name: string;
  store_description: string | null;
  store_logo: string | null;
  user: any;
}): Promise<Store> => {
  try {
    const repository = getRepository();

    const store = repository.create({
      store_name: storeData.store_name,
      store_description: storeData.store_description,
      store_logo: storeData.store_logo,
      user: storeData.user,
    });

    return await repository.save(store);
  } catch (error: any) {
    console.error("Store repository createStore error:", error);
    throw error;
  }
};

// find store by ID 
export const findStoreById = async (id: number): Promise<Store | null> => {
  try {
    const repository = getRepository();
    return await repository.findOne({
      where: { id },
      relations: ["user"],
    });
  } catch (error: any) {
    console.error("Store repository findStoreById error:", error);
    throw error;
  }
};

//  dind all store 
export const findAllStores = async (): Promise<Store[]> => {
  try {
    const repository = getRepository();
    return await repository.find({
      relations: ["user"],
      order: { id: "DESC" },
    });
  } catch (error: any) {
    console.error("Store repository findAllStores error:", error);
    throw error;
  }
};

// find store by user ID  
export const findStoresByUserId = async (userId: number): Promise<Store[]> => {
  try {
    const repository = getRepository();
    return await repository.find({
      where: { user: { id: userId } },
      relations: ["user"],
      order: { id: "DESC" },
    });
  } catch (error: any) {
    console.error("Store repository findStoresByUserId error:", error);
    throw error;
  }
};

// Update Store  
export const updateStore = async (
  id: number,
  updateData: Partial<Store>
): Promise<void> => {
  try {
    const repository = getRepository();
    await repository.update(id, updateData);
  } catch (error: any) {
    console.error("Store repository updateStore error:", error);
    throw error;
  }
};

// Delete Store  
export const deleteStore = async (id: number): Promise<void> => {
  try {
    const repository = getRepository();
    const productRepository = AppDataSource.getRepository(Product);

    const productCount = await productRepository.count({
      where: { store: { id } },
    });

    if (productCount > 0) {
      throw new Error("Cannot delete store with associated products");
    }

    await repository.delete(id);
  } catch (error: any) {
    console.error("Store repository deleteStore error:", error);
    throw error;
  }
};

// Check of Store Exists  
export const storeExists = async (
  storeName: string,
  userId?: number
): Promise<boolean> => {
  try {
    const repository = getRepository();
    const where: any = { store_name: storeName };

    if (userId) {
      where.user = { id: userId };
    }

    const store = await repository.findOne({ where });

    return !!store;
  } catch (error: any) {
    console.error("Store repository storeExists error:", error);
    throw error;
  }
};













