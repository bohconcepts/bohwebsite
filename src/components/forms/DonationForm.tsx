import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { Card } from "../ui/card";

const donationFrequencies = [
  { id: "once", label: "One-time donation" },
  { id: "monthly", label: "Monthly donation" },
  { id: "quarterly", label: "Quarterly donation" },
  { id: "annually", label: "Annual donation" },
];

const donationAmounts = [
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
  { value: "250", label: "$250" },
  { value: "500", label: "$500" },
  { value: "custom", label: "Custom Amount" },
];

const DonationForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "100",
    customAmount: "",
    frequency: "once",
    dedicateGift: false,
    honoreeInfo: { name: "", email: "", message: "" },
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleHonoreeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      honoreeInfo: { ...prev.honoreeInfo, [name]: value }
    }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, dedicateGift: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally submit to your payment processor
      // For now, we'll simulate a submission with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you for your donation!",
        description: "Your generous support helps make a difference.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        amount: "100",
        customAmount: "",
        frequency: "once",
        dedicateGift: false,
        honoreeInfo: { name: "", email: "", message: "" },
        message: "",
      });
    } catch (error) {
      toast({
        title: "Donation processing failed",
        description: "There was a problem processing your donation. Please try again.",
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
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t("donation.form.title", "Make a Donation")}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {t("donation.form.chooseAmount", "Choose Donation Amount")}
            </Label>
            
            <RadioGroup 
              value={formData.amount}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, amount: value }));
              }}
              className="grid grid-cols-3 gap-3"
            >
              {donationAmounts.map((amt) => (
                <div key={amt.value} className="flex items-center">
                  <RadioGroupItem
                    value={amt.value}
                    id={`amount-${amt.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`amount-${amt.value}`}
                    className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:bg-brand-blue/10 cursor-pointer font-medium"
                  >
                    {amt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {formData.amount === "custom" && (
              <div className="pt-2">
                <Label htmlFor="customAmount">{t("donation.form.customAmount", "Custom Amount (USD)")}</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    id="customAmount"
                    name="customAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.customAmount}
                    onChange={handleInputChange}
                    required={formData.amount === "custom"}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="text-lg font-medium">
              {t("donation.form.frequency", "Donation Frequency")}
            </Label>
            
            <RadioGroup 
              value={formData.frequency}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, frequency: value }));
              }}
              className="space-y-2"
            >
              {donationFrequencies.map((frequency) => (
                <div key={frequency.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={frequency.id} id={`frequency-${frequency.id}`} />
                  <Label htmlFor={`frequency-${frequency.id}`}>
                    {t(`donation.form.frequencyOptions.${frequency.id}`, frequency.label)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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
          
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dedicateGift" 
                checked={formData.dedicateGift}
                onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
              />
              <Label 
                htmlFor="dedicateGift" 
                className="font-medium cursor-pointer"
              >
                {t("donation.form.dedicateGift", "Dedicate this gift in honor or memory of someone")}
              </Label>
            </div>
          </div>
          
          {formData.dedicateGift && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 bg-gray-50 p-4 rounded-md"
            >
              <div className="space-y-2">
                <Label htmlFor="honoreeName">{t("donation.form.honoreeName", "Honoree's Name")}</Label>
                <Input
                  id="honoreeName"
                  name="name"
                  value={formData.honoreeInfo.name}
                  onChange={handleHonoreeInputChange}
                  placeholder={t("donation.form.honoreeNamePlaceholder", "Enter honoree's name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="honoreeEmail">{t("donation.form.honoreeEmail", "Honoree's Email (Optional)")}</Label>
                <Input
                  id="honoreeEmail"
                  name="email"
                  type="email"
                  value={formData.honoreeInfo.email}
                  onChange={handleHonoreeInputChange}
                  placeholder={t("donation.form.honoreeEmailPlaceholder", "Enter honoree's email")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="honoreeMessage">{t("donation.form.honoreeMessage", "Message for Honoree")}</Label>
                <Textarea
                  id="honoreeMessage"
                  name="message"
                  value={formData.honoreeInfo.message}
                  onChange={handleHonoreeInputChange}
                  placeholder={t("donation.form.honoreeMessagePlaceholder", "Enter a message for the honoree")}
                  className="min-h-[100px]"
                />
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">{t("donation.form.message", "Message (Optional)")}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t("donation.form.messagePlaceholder", "Tell us why you're making this donation...")}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white text-lg py-6" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t("form.processing", "Processing...") 
                : t("donation.form.submit", `Donate ${formData.amount === "custom" ? `$${formData.customAmount || "0"}` : `$${formData.amount}`} ${formData.frequency !== "once" ? "recurring" : ""}`)}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              {t("donation.form.securePayment", "Secure payment processing. All donations are tax-deductible.")}
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default DonationForm;
