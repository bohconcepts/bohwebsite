import { NextApiRequest, NextApiResponse } from 'next';
import { processFormSubmission } from '@/utils/email/emailService';
import { FormSubmissionData } from '@/utils/email/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData: FormSubmissionData = req.body;
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.formType) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        requiredFields: ['name', 'email', 'formType']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Process the form submission
    const result = await processFormSubmission(formData);

    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Form submitted successfully' 
      });
    } else {
      // Partial success
      return res.status(207).json({
        success: false,
        userEmailSent: result.userEmailSent,
        companyEmailSent: result.companyEmailSent,
        message: 'Form processed with partial success'
      });
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
