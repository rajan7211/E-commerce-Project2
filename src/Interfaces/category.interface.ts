export interface CreateCategoryRequestBody {
    category_name : string;
}

export interface UpdateCategoryRequestBody {
    category_name? : string;
}

export interface CategoryResponse {
    id : number ;
    category_name : string;
    created_at? : Date;
    updated_at? :Date;
}

export interface CategoryListResponse {
    categories : CategoryResponse[];
    total : number;
}


