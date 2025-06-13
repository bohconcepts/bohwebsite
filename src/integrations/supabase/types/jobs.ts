export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_range: string | null;
  requirements: string[];
  is_active: boolean;
}

export interface JobInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_range?: string | null;
  requirements?: string[];
  is_active?: boolean;
}

export interface JobUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  description?: string;
  location?: string;
  job_type?: string;
  salary_range?: string | null;
  requirements?: string[];
  is_active?: boolean;
}
