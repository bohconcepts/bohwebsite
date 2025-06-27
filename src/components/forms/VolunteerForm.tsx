import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";

const availabilityOptions = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings" },
  { value: "mornings", label: "Mornings" },
  { value: "flexible", label: "Flexible" },
];

const volunteerInterests = [
  { id: "teaching", label: "Teaching & Education" },
  { id: "mentorship", label: "Mentorship" },
  { id: "events", label: "Event Organization" },
  { id: "fundraising", label: "Fundraising" },
  { id: "marketing", label: "Marketing & Communications" },
  { id: "logistics", label: "Logistics & Administration" },
];

const VolunteerForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    availability: "flexible",
    interests: [] as string[],
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, id] 
        : prev.interests.filter(item => item !== id)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally submit to your backend
      // For now, we'll simulate a submission with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Application submitted!",
        description: "Thank you for your interest in volunteering. We'll contact you soon.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        availability: "flexible",
        interests: [],
        message: "",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {t("volunteer.form.title", "Volunteer Application")}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("form.firstName", "First Name")} *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder={t("form.firstNamePlaceholder", "Enter your first name")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("form.lastName", "Last Name")} *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder={t("form.lastNamePlaceholder", "Enter your last name")}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t("form.email", "Email")} *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={t("form.emailPlaceholder", "Enter your email address")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">{t("form.phone", "Phone Number")}</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("form.phonePlaceholder", "Enter your phone number")}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">{t("volunteer.form.location", "Location")} *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder={t("volunteer.form.locationPlaceholder", "City, Country")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="availability">{t("volunteer.form.availability", "Availability")} *</Label>
          <Select 
            value={formData.availability}
            onValueChange={(value) => handleSelectChange("availability", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("volunteer.form.selectAvailability", "Select your availability")} />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`volunteer.form.availabilityOptions.${option.value}`, option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <Label>{t("volunteer.form.interests", "Areas of Interest")} *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {volunteerInterests.map((interest) => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={interest.id} 
                  checked={formData.interests.includes(interest.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(interest.id, checked === true)}
                />
                <Label 
                  htmlFor={interest.id} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {t(`volunteer.form.interestOptions.${interest.id}`, interest.label)}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">{t("volunteer.form.experience", "Relevant Experience")}</Label>
          <Textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder={t("volunteer.form.experiencePlaceholder", "Tell us about your relevant skills and experience...")}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">{t("volunteer.form.message", "Additional Information")}</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={t("volunteer.form.messagePlaceholder", "Tell us why you want to volunteer with us...")}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t("form.submitting", "Submitting...") 
              : t("volunteer.form.submit", "Submit Application")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default VolunteerForm;
