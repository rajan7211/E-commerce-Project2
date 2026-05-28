import { Request, Response } from "express";
import {
  create as createCategoryService,
  findAll as findAllCategoriesService,
  findById as findCategoryByIdService,
  update as updateCategoryService,
  deleteById as deleteCategoryService,
} from "../services/CategoryService";
import {
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
} from "../Interfaces/category.interface";

 
export const create = async (req: Request , res : Response) => {
    try {
        const data : CreateCategoryRequestBody = req.body;

        const result  = await createCategoryService (data);

        res.status(result.statusCode).json({
            success : result.success,
            message : result.message,
            data: result.data,
        });
    } catch (error : any) {
        console.error("Category create error:" , error);
        const statusCode = error.statusCode || 400;

      res.status(statusCode).json({
        success : false,
        message : error.message,
      });


    }
};


export const findAll = async (req : Request , res: Response) => {
    try {
        const result = await findAllCategoriesService();

        res.status(result.statusCode).json({
            success : result.success,
            message : result.message,
            data : result.data,
        });
    } catch(error : any) {
        console.error("category controller findAll error :" , error);
        const statusCode = error.statusCode || 400;

        res.status(statusCode).json ({
            success : false,
            message : error.message,
        });
    }
};


export const findById = async (req: Request , res: Response) => {
    try{
        const id = parseInt(req.params.id as string);

        if(isNaN(id)) {
            return res.status(400).json({
                success : false,
                message :"Invalid category ID",
            });
        }
        const result = await findCategoryByIdService(id);

        res.status (result.statusCode).json({
            success : result.success,
            message : result.message,
            data : result.data,
        });
    } catch (error :any) {
        console.error("category controler findbyId error:" , error);
        const statusCode =error.statusCode || 400;


        res.status(statusCode).json({
            success : false,
            message : error.message,
        });
    }
};


export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const data: UpdateCategoryRequestBody = req.body;

    const result = await updateCategoryService(id, data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Category controller update error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const result = await deleteCategoryService(id);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Category controller deleteById error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};





