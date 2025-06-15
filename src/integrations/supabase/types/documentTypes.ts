import { Json } from '../types';

/**
 * Document types for the documents table
 * These types define the structure of document records in the database
 */
export interface DocumentTypes {
  Row: {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string | null;
    file_path: string;
    file_type: string;
    file_size: number;
    is_active: boolean;
    is_processed: boolean;
    metadata: Json | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    updated_at?: string;
    title: string;
    description?: string | null;
    file_path: string;
    file_type: string;
    file_size: number;
    is_active?: boolean;
    is_processed?: boolean;
    metadata?: Json | null;
  };
  Update: {
    id?: string;
    created_at?: string;
    updated_at?: string;
    title?: string;
    description?: string | null;
    file_path?: string;
    file_type?: string;
    file_size?: number;
    is_active?: boolean;
    is_processed?: boolean;
    metadata?: Json | null;
  };
}

/**
 * Document type for use in application code
 * This type represents a document with properly typed date fields
 */
export interface Document {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  is_active: boolean;
  is_processed: boolean;
  metadata: Json | null;
}

/**
 * Document update payload for updating document metadata
 */
export interface DocumentUpdatePayload {
  title?: string;
  description?: string | null;
  is_active?: boolean;
}
