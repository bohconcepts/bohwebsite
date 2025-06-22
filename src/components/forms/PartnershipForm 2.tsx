import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

import { savePartnershipRequest } from "@/integrations/supabase/services/partnershipService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PartnershipFormProps {
  className?: string;
}

export const PartnershipForm = ({ className = "" }: PartnershipFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    partnership_type: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Save partnership request using the partnershipService
      const { success, error } = await savePartnershipRequest(formState);
      
      if (success) {
        // Show success toast notification
        toast({
          title: t('Partnership Request Submitted'),
          description: t('Thank you for your interest in partnering with us. We will contact you soon.')
          // Using default variant for success
        });
        
        setIsSubmitted(true);
        setFormState({
          company_name: "",
          contact_person: "",
          email: "",
          phone: "",
          website: "",
          industry: "",
          partnership_type: "",
          message: "",
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        // Show error message
        setSubmitError(error || t('Something went wrong. Please try again.'));
        toast({
          title: t('Error'),
          description: error || t('Something went wrong. Please try again.'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : t('Something went wrong. Please try again.'));
      
      toast({
        title: t('Error'),
        description: error instanceof Error ? error.message : t('Something went wrong. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    { value: "strategic", label: t('Strategic Partnership') },
    { value: "technology", label: t('Technology Partnership') },
    { value: "affiliate", label: t('Affiliate Partnership') },
    { value: "distribution", label: t('Distribution Partnership') },
    { value: "marketing", label: t('Marketing Partnership') },
    { value: "other", label: t('Other') }
  ];

  const industryTypes = [
    { value: "technology", label: t('Technology') },
    { value: "finance", label: t('Finance') },
    { value: "healthcare", label: t('Healthcare') },
    { value: "education", label: t('Education') },
    { value: "retail", label: t('Retail') },
    { value: "manufacturing", label: t('Manufacturing') },
    { value: "transportation", label: t('Transportation') },
    { value: "energy", label: t('Energy') },
    { value: "other", label: t('Other') }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      <h2 className="text-3xl font-bold mb-6 text-brand-blue">{t('Partner With Us')}</h2>
      
      {isSubmitted ? (
        <motion.div 
          className="flex flex-col items-center justify-center h-64 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CheckCircle className="text-green-500 mb-4" size={60} />
          <h3 className="text-2xl font-bold text-green-500 mb-2">{t('Request Submitted')}</h3>
          <p className="text-gray-600">{t('Thank you for your interest in partnering with us. We will contact you soon.')}</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Company Name')} *
              </Label>
              <Input
                id="company_name"
                name="company_name"
                value={formState.company_name}
                onChange={handleChange}
                placeholder={t('Your Company Name')}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Contact Person')} *
              </Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formState.contact_person}
                onChange={handleChange}
                placeholder={t('Full Name')}
                required
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Email Address')} *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Phone Number')} *
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Company Website')}
            </Label>
            <Input
              id="website"
              name="website"
              value={formState.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Industry')}
              </Label>
              <Select 
                value={formState.industry} 
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Select Industry')} />
                </SelectTrigger>
                <SelectContent>
                  {industryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="partnership_type" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Partnership Type')}
              </Label>
              <Select 
                value={formState.partnership_type} 
                onValueChange={(value) => handleSelectChange('partnership_type', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Select Partnership Type')} />
                </SelectTrigger>
                <SelectContent>
                  {partnershipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Message')}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              placeholder={t('Tell us about your partnership interests and goals')}
              className="w-full min-h-[150px]"
            />
          </div>
          
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('Submitting')}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send size={18} className="mr-2" />
                {t('Submit Partnership Request')}
              </div>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
