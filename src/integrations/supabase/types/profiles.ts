import { BaseRecord, BaseInsert, BaseUpdate } from "./base";

export interface Profile extends BaseRecord {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name?: string | null;
  email?: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  role?: "admin" | "editor" | "viewer" | null;
  is_active?: boolean | null;
  employee_id?: string | null;
  // created_at and updated_at are inherited from BaseRecord
}

export interface ProfileInsert extends BaseInsert {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role?: "admin" | "editor" | "viewer" | null;
  is_active?: boolean | null;
  employee_id?: string | null;
}

export interface ProfileUpdate extends BaseUpdate {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role?: "admin" | "editor" | "viewer" | null;
  is_active?: boolean | null;
  employee_id?: string | null;
}
