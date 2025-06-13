import { BaseRecord, BaseInsert, BaseUpdate } from "./base";

export interface Profile extends BaseRecord {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  role?: "admin" | "viewer" | "staff";
  email?: string;
  full_name?: string;
  is_active?: boolean;
  employee_id?: string;
}

export interface ProfileInsert extends BaseInsert {
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role?: "admin" | "viewer" | "staff";
  email?: string;
  full_name?: string;
  is_active?: boolean;
  employee_id?: string;
}

export interface ProfileUpdate extends BaseUpdate {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role?: "admin" | "viewer" | "staff";
  email?: string;
  full_name?: string;
  is_active?: boolean;
  employee_id?: string;
}
