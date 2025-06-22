// Type definitions for link click tracking

export interface LinkClick {
  id: string;
  url: string;
  page_source: string | null;
  user_id: string | null;
  clicked_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

export interface LinkClickInsert {
  id?: string;
  url: string;
  page_source?: string | null;
  user_id?: string | null;
  clicked_at?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

export interface LinkClickUpdate {
  id?: string;
  url?: string;
  page_source?: string | null;
  user_id?: string | null;
  clicked_at?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}
