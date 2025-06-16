import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/integrations/supabase/services/newsletterService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface NewsletterSubscriptionFormProps {
  className?: string;
}

export const NewsletterSubscriptionForm: React.FC<NewsletterSubscriptionFormProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { success, error } = await subscribeToNewsletter(email);

      if (success) {
        toast({
          title: 'Success!',
          description: 'Thank you for subscribing to our newsletter.',
        });
        setEmail('');
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to subscribe. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
        disabled={isSubmitting}
        aria-label="Email address for newsletter subscription"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-brand-orange hover:bg-brand-orange/90 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </Button>
    </form>
  );
};

export default NewsletterSubscriptionForm;
