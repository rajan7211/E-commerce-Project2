import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

const getRepository = (): Repository<Category> => {
  return AppDataSource.getRepository(Category);
};

export const create = async (categoryData: {
  category_name: string;
}): Promise<Category> => {
  try {
    const repository = getRepository();

    const category = repository.create({
      category_name: categoryData.category_name,
    });

    return await repository.save(category);
  } catch (error: any) {
    console.error("Category repository create error:", error);
    throw error;
  }
};

export const findAll = async (): Promise<Category[]> => {
  try {
    const repository = getRepository();
    return await repository.find({
      order: { id: "ASC" },
    });
  } catch (error: any) {
    console.error("Category repository findAll error:", error);
    throw error;
  }
};

export const findById = async (id: number): Promise<Category | null> => {
  try {
    const repository = getRepository();
    return await repository.findOne({
      where: { id },
    });
  } catch (error: any) {
    console.error("Category repository findById error:", error);
    throw error;
  }
};

export const findByName = async (category_name: string): Promise<Category | null> => {
  try {
    const repository = getRepository();
    return await repository.findOne({
      where: { category_name },
    });
  } catch (error: any) {
    console.error("Category repository findByName error:", error);
    throw error;
  }
};

export const update = async (
  id: number,
  data: Partial<Category>
): Promise<Category> => {
  try {
    const repository = getRepository();

    await repository.update(id, data);
    const category = await findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error: any) {
    console.error("Category repository update error:", error);
    throw error;
  }
};


export const deleteById = async (id : number) : Promise<void> => {
    try {

        const repository = getRepository();
        const productRespository= AppDataSource.getRepository(Product);

        const productCount = await productRespository.count({
            where : { category : {id} },
        });
        if(productCount > 0) {
            throw new Error("cannot delete category with associated products");
        }
        await repository.delete(id);
    } catch(error: any) {
        console.error("category deleteById error:" , error);
        throw error;
        
    }
};

export const categoryExists = async (category_name : string):Promise<boolean> => {
    try {
        const repository = getRepository();

        const count = await repository.findOne ({
            where : { category_name},
        }) ;
        return !! Category; 
        } catch (error : any) {
            console.error("category categoryExists error :", error);
            throw error;
        }
};









