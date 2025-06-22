// Partnership request types

export interface PartnershipRequest {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string | null;
  industry: string | null;
  partnership_type: string | null;
  message: string | null;
  created_at: string;
}

export type PartnershipRequestInsert = Omit<PartnershipRequest, 'id' | 'created_at'>;
export type PartnershipRequestUpdate = Partial<PartnershipRequestInsert>;
