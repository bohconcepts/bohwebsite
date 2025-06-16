// Import types first to use them in the Database interface
import { Profile, ProfileInsert, ProfileUpdate } from './profiles';
import { Job, JobInsert, JobUpdate } from './jobs';
import { JobApplication, JobApplicationInsert, JobApplicationUpdate } from './job-applications';
import { Contact, ContactInsert, ContactUpdate } from './contacts';
import { PartnershipRequest, PartnershipRequestInsert, PartnershipRequestUpdate } from './partnership-requests';
import { DocumentTypes } from './documentTypes';
import { ChatTypes } from './chatTypes';

// Re-export all types
export * from './profiles';
export * from './jobs';
export * from './job-applications';
export * from './contacts';
export * from './documentTypes';
export * from './chatTypes';

// Common JSON type used in Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database schema type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: JobUpdate;
      };
      job_applications: {
        Row: JobApplication;
        Insert: JobApplicationInsert;
        Update: JobApplicationUpdate;
      };
      contacts: {
        Row: Contact;
        Insert: ContactInsert;
        Update: ContactUpdate;
      };
      partnership_requests: {
        Row: PartnershipRequest;
        Insert: PartnershipRequestInsert;
        Update: PartnershipRequestUpdate;
      };
      documents: {
        Row: DocumentTypes['Row'];
        Insert: DocumentTypes['Insert'];
        Update: DocumentTypes['Update'];
      };
      chat_sessions: {
        Row: ChatTypes['Sessions']['Row'];
        Insert: ChatTypes['Sessions']['Insert'];
        Update: ChatTypes['Sessions']['Update'];
      };
      chat_messages: {
        Row: ChatTypes['Messages']['Row'];
        Insert: ChatTypes['Messages']['Insert'];
        Update: ChatTypes['Messages']['Update'];
      };
      document_embeddings: {
        Row: ChatTypes['Embeddings']['Row'];
        Insert: ChatTypes['Embeddings']['Insert'];
        Update: ChatTypes['Embeddings']['Update'];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];