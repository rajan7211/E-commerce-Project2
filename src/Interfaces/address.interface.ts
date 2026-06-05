export interface CreateAddressRequestBody {
  street: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface UpdateAddressRequestBody {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AddressResponse {
  id: number;
  street: string;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country: string;
  created_at: Date;
  updated_at: Date;
}
