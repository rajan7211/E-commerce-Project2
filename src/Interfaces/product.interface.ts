export interface CreateProductRequestBody {
  product_name: string;
  product_price: number;
  product_description?: string;
  stock: number;
  category_id: number;
  store_id: number;
}

export interface UpdateProductRequestBody {
  product_name?: string;
  product_price?: number;
  product_description?: string;
  stock?: number;
  category_id?: number;
}

export interface ProductResponse {
  product_id: number;
  product_name: string;
  product_price: number;
  product_description: string | null;
  stock: number;
  images: string[] | null;
  category: {
    id: number;
    category_name: string;
  };
  store: {
    id: number;
    store_name: string;
  };
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  page ? : number;
  limit ? : number;
}

export interface ProductQueryParams {
  category_id?: number;
  store_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}


