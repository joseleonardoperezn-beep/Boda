export interface Guest {
  id: string;
  name: string;
  dedication: string;
  phone?: string | null;
  confirmed: boolean;
  companions_count: number;
  dietary_notes?: string;
  confirmed_at?: string;
  updated_at?: string;
}

export interface Gift {
  id: string;
  title: string;
  description: string;
  price_approx: number;
  is_group_gift: boolean;
  target_amount: number;
  current_amount: number;
  is_reserved: boolean;
  reserved_by_guest_id?: string;
  reserved_by_name?: string;
  reserved_at?: string;
}

