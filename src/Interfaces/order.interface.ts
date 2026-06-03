export interface CreateOrderRequestBody {
  shipping_address: string;
  payment_method: string; 
}



export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  product: {
    product_id: number;
    product_name: string;
    images: string[] | null;
  };
}



export interface PaymentResponse {
  id: number;
  amount: number;
  payment_method: string;
  transaction_status: string;
  transaction_id: string;
}


export interface ShippingResponse {
  id: number;
  address: string;
}


export interface TrackResponse {
  id: number;
  status: string;
  date_time: Date;
}

export interface OrderResponse {
  id: number;
  total_price: number;
  status: string;
  items: OrderItemResponse[];
  payment: PaymentResponse;
  shipping: ShippingResponse;
  tracking: TrackResponse;
  created_at: Date;
  updated_at: Date;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
}






