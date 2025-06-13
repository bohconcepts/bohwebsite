import { useState } from "react";
import { motion } from "framer-motion";
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
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6">{t('clients_title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('clients_subtitle')}
          </p>
        </div>

        <div 
          className="relative overflow-x-hidden w-full" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-12 py-4 items-center whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{
              opacity: inView ? 1 : 0,
              x: [-1920, 0],
            }}
            transition={{
              opacity: { duration: 0.8 },
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
                paused: isHovered // Completely pause when hovered
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
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
