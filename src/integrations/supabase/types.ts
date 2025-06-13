export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      job_applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          job_id: string
          status: string
          resume_url: string | null
          cover_letter: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          job_id: string
          status?: string
          resume_url?: string | null
          cover_letter?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          job_id?: string
          status?: string
          resume_url?: string | null
          cover_letter?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          location: string
          job_type: string
          salary_range: string | null
          requirements: string[]
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          location: string
          job_type: string
          salary_range?: string | null
          requirements?: string[]
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          location?: string
          job_type?: string
          salary_range?: string | null
          requirements?: string[]
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          first_name: string
          last_name: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          bio: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          first_name: string
          last_name: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
