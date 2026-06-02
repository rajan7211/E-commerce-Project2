export interface AddToCartRequestBody {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequestBody {
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  product: {
    product_id: number;
    product_name: string;
    product_price: number;
    product_description: string | null;
    images: string[] | null;
    stock: number;
  };
  subtotal: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CartResponse {
  id: number;
  total_price: number;
  total_items: number;
  items: CartItemResponse[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CartListResponse {
  cart: CartResponse | null;
  message: string;
}











