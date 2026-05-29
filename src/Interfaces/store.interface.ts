export interface CreateStoreRequestBody {
  store_name: string;
  store_description?: string;
  store_logo?: string;
}

export interface UpdateStoreRequestBody {
  store_name?: string;
  store_description?: string | null;
  store_logo?: string | null;
}

export interface StoreResponse {
  id: number;
  store_name: string;
  store_description: string | null;
  store_logo: string | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at?: Date;
  updated_at?: Date;
}

export interface StoreListResponse {
  stores: StoreResponse[];
  total: number;
}








