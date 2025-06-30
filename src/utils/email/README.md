# Email Service for BOH Concepts

This email service provides functionality to send emails from your forms to both the user and the company.

## Setup Instructions

1. Install the required package:

```bash
npm install nodemailer
```

2. Add the following environment variable to your `.env.local` file:

```
COMPANY_EMAIL=info@bohconcepts.com  # or any other email where you want to receive notifications
```

Note: Since you're using a GoDaddy distribution email account that doesn't require login credentials, no username or password is needed.

## Usage Example

Here's how to use the email service in your form components:

```tsx
import { useState } from 'react';
import { FormSubmissionData } from '@/utils/email/types';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Prepare the submission data
      const submissionData: FormSubmissionData = {
        ...formData,
        formType: 'contact'
      };

      // Send the form data to the API
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitResult({ 
          success: true, 
          message: 'Thank you! Your message has been sent successfully.'
        });
      } else {
        setSubmitResult({ 
          success: false, 
          message: result.error || 'Failed to send your message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitResult({ 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
      
      {submitResult && (
        <div className={`mt-4 p-3 rounded-md ${submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {submitResult.message}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
```

## Partnership Form Example

For a partnership form, you would follow the same pattern but set `formType: 'partnership'` and include any additional fields specific to partnership requests.

## How It Works

1. When a user submits a form, the data is sent to the `/api/forms/submit` endpoint
2. The API validates the form data and processes it using the email service
3. Two emails are sent:
   - A confirmation email to the user who submitted the form
   - A notification email to the company with all form details
4. The API returns a success or error response to the frontend

## Customization

You can customize the email templates in `emailService.ts` to match your branding and messaging needs.
