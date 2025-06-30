import nodemailer from 'nodemailer';
import { EmailConfig } from './types';

// Default email configuration for GoDaddy distribution email
const defaultConfig: EmailConfig = {
  host: 'smtp.secureserver.net', // GoDaddy SMTP server
  port: 587,  // Standard port for SMTP submission
  secure: false, // false for 587 (requires STARTTLS)
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
  // No auth for distribution email accounts
};

/**
 * Creates and returns a nodemailer transporter with the provided configuration
 * or the default configuration if none is provided.
 */
export function createTransporter(config: Partial<EmailConfig> = {}) {
  const emailConfig = { ...defaultConfig, ...config };
  return nodemailer.createTransport(emailConfig);
}

/**
 * Get the default transporter
 */
export function getDefaultTransporter() {
  return createTransporter();
}
