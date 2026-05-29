import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { Store } from "../entities/Store";
import { ProductQueryParams } from "../Interfaces/product.interface";

const getRepository = (): Repository<Product> => {
  return AppDataSource.getRepository(Product);
};

export const create = async (productData: {
  product_name: string;
  product_price: number;
  product_description: string | null;
  stock: number;
  category: Category;
  store: Store;
}): Promise<Product> => {
  try {
    const repository = getRepository();

    const product = repository.create({
      product_name: productData.product_name,
      product_price: productData.product_price,
      product_description: productData.product_description ??undefined,
      stock: productData.stock,
      category: productData.category,
      store: productData.store,
    });

    return await repository.save(product);
  } catch (error: any) {
    console.error("Product repository create error:", error);
    throw error;
  }
};

export const findAll = async (params?: ProductQueryParams): Promise<{ products: Product[]; total: number }> => {
  try {
    const repository = getRepository();

    const queryBuilder = repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store");

    // Apply filters
    if (params?.category_id) {
      queryBuilder.andWhere("product.category_id = :category_id", { category_id: params.category_id });
    }

    if (params?.store_id) {
      queryBuilder.andWhere("product.store_id = :store_id", { store_id: params.store_id });
    }

    if (params?.min_price !== undefined) {
      queryBuilder.andWhere("product.product_price >= :min_price", { min_price: params.min_price });
    }

    if (params?.max_price !== undefined) {
      queryBuilder.andWhere("product.product_price <= :max_price", { max_price: params.max_price });
    }

    if (params?.in_stock === true) {
      queryBuilder.andWhere("product.stock > 0");
    }

    if (params?.search) {
      queryBuilder.andWhere("product.product_name ILIKE :search", { search: `%${params.search}%` });
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  } catch (error: any) {
    console.error("Product repository findAll error:", error);
    throw error;
  }
};

export const findById = async (id: number): Promise<Product | null> => {
  try {
    const repository = getRepository();
    return await repository.findOne({
      where: { product_id: id },
      relations: ["category", "store"],
    });
  } catch (error: any) {
    console.error("Product repository findById error:", error);
    throw error;
  }
};

export const findByStoreId = async (storeId: number): Promise<Product[]> => {
  try {
    const repository = getRepository();
    return await repository.find({
      where: { store: { id: storeId } },
      relations: ["category", "store"],
      order: { product_id: "DESC" },
    });
  } catch (error: any) {
    console.error("Product repository findByStoreId error:", error);
    throw error;
  }
};

export const update = async (
  id: number,
  data: Partial<Product>
): Promise<Product> => {
  try {
    const repository = getRepository();

    await repository.update(id, data);
    const product = await findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error: any) {
    console.error("Product repository update error:", error);
    throw error;
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    const repository = getRepository();
    await repository.delete(id);
  } catch (error: any) {
    console.error("Product repository deleteById error:", error);
    throw error;
  }
};

export const productExists = async (product_name: string, storeId?: number): Promise<boolean> => {
  try {
    const repository = getRepository();
    const query: any = { product_name };
    if (storeId) {
      query.store = { id: storeId };
    }
    const count = await repository.count({ where: query });
    return count > 0;
  } catch (error: any) {
    console.error("Product repository productExists error:", error);
    throw error;
  }
};

export const updateStock = async (
  productId: number,
  quantity: number
): Promise<Product> => {
  try {
    const repository = getRepository();

    const product = await findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const newStock = product.stock - quantity;

    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }

    await repository.update(productId, { stock: newStock });

    const updatedProduct = await findById(productId);

    if (!updatedProduct) {
      throw new Error("Product not found after update");
    }

    return updatedProduct;
  } catch (error: any) {
    console.error("Product repository updateStock error:", error);
    throw error;
  }
};











