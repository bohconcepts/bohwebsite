/**
 * Common JSON type used in Supabase
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Base interface for all database tables
 */
export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Base interface for all database table inserts
 */
export interface BaseInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Base interface for all database table updates
 */
export interface BaseUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Generic type for database query responses
 */
export interface QueryResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic type for database query responses with pagination
 */
export interface PaginatedQueryResponse<T> extends QueryResponse<T[]> {
  count?: number | null;
  hasMore?: boolean;
}
