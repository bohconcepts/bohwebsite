export interface Contact {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
}

export interface ContactInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  archived?: boolean;
}

export interface ContactUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  read?: boolean;
  archived?: boolean;
}
