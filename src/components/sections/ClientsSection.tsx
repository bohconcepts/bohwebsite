import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useClients } from "@/hooks/useLocalizedConstants";
import { useLanguage } from "@/contexts/LanguageContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

const ClientsSection = () => {
  const { t } = useLanguage();
  const clients = useClients();
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Duplicate clients array to create the seamless effect
  const duplicatedClients = [...clients, ...clients];
  
  // Animation variants for individual items
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section ref={ref} className="py-10 bg-white">
      <div className="container">
        <div className="section-title-container mb-12">
          <h2 className="section-title">{t('clients_title')}</h2>
          <div className="section-title-underline"></div>
          <p className="section-title-description">
            {t('clients_subtitle')}
          </p>
        </div>

        <div 
          className="relative overflow-x-hidden w-full" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {inView && (
            <motion.div
              className="flex gap-12 py-4 items-center whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: isHovered ? 0 : "-50%"
              }}
              transition={{
                opacity: { duration: 0.8 },
                x: {
                  repeat: isHovered ? 0 : Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear"
                },
              }}
            >
              {duplicatedClients.map((client, index) => (
                <motion.div
                  key={`${client.id}-${index}`}
                  variants={itemVariants}
                  className="flex justify-center"
                >
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-[160px] p-2 rounded-lg",
                    "grayscale hover:grayscale-0 transition-all duration-300",
                    "hover:shadow-lg hover:scale-105",
                    "flex items-center justify-center"
                  )}
                  aria-label={`Visit ${client.name} website`}
                >
                  <AspectRatio ratio={3 / 2} className="w-full">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}  {/* Added missing closing parenthesis */}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
