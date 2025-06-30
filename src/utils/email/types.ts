/**
 * Email configuration interface
 */
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  tls?: {
    rejectUnauthorized: boolean;
  };
  auth?: {
    user: string;
    pass: string;
  };
}

/**
 * Email message interface
 */
export interface EmailMessage {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Form submission email data
 */
export interface FormSubmissionData {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  formType: 'contact' | 'partnership' | 'other';
  [key: string]: any; // Additional form fields
}
