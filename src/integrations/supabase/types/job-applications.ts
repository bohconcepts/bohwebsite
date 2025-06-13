export interface JobApplication {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  job_id: string;
  status: string;
  resume_url: string | null;
  cover_letter: string | null;
}

export interface JobApplicationInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  job_id: string;
  status?: string;
  resume_url?: string | null;
  cover_letter?: string | null;
}

export interface JobApplicationUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  job_id?: string;
  status?: string;
  resume_url?: string | null;
  cover_letter?: string | null;
}
