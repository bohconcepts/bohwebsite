import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppChatProps {
  phoneNumber: string; // WhatsApp phone number with country code but without + or spaces
  welcomeMessage?: string;
}

const WhatsAppChat = ({
  phoneNumber,
  welcomeMessage = "Hello! I'm interested in your services. Can you provide more information?",
}: WhatsAppChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleChatOpen = () => {
    setIsOpen(true);
  };

  const handleChatClose = () => {
    setIsOpen(false);
  };

  const handleStartChat = () => {
    // Encode the welcome message for the URL
    const encodedMessage = encodeURIComponent(welcomeMessage);
    // Create the WhatsApp URL with the phone number and message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
    // Close the chat popup
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={handleChatOpen}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label={t("Chat with us")}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/images/whatsapp-logo.png"
                  alt="WhatsApp"
                  className="h-8 w-8 mr-2"
                  onError={(e) => {
                    // Fallback if the image doesn't exist
                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
                  }}
                />
                <h3 className="font-medium">{t("Chat with us")}</h3>
              </div>
              <button
                onClick={handleChatClose}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label={t("Close chat")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                {t("Chat with our team via WhatsApp for quick assistance.")}
              </p>
              <button
                onClick={handleStartChat}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <span>{t("Start Chat")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppChat;
