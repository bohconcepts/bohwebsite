import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useStatistics } from '@/hooks/useLocalizedConstants';
import { 
  CheckCircle, Users, Clock, Building2
} from 'lucide-react';

const iconMap = {
  CheckCircle: CheckCircle,
  Users: Users,
  Clock: Clock,
  Building2: Building2
};

// Counter component to animate number values
const Counter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '').trim();
  
  useEffect(() => {
    if (numericValue > 0) {
      // Calculate increment per frame for smooth animation
      const incrementsPerFrame = numericValue / (duration / 16);
      let startValue = 0;
      
      const timer = setInterval(() => {
        startValue += incrementsPerFrame;
        if (startValue >= numericValue) {
          clearInterval(timer);
          setCount(numericValue);
        } else {
          setCount(Math.floor(startValue));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [numericValue, duration]);
  
  return (
    <span>
      {count}{suffix}
    </span>
  );
};

const Statistics = () => {
  // We'll keep useLanguage import for future translations
  const statistics = useStatistics();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const renderIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-12 w-12 text-brand-orange" /> : null;
  };

  return (
    <section ref={ref} className="primary-gradient py-16">
      <div className="container">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {statistics.map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={itemVariants}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                {renderIcon(stat.icon)}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {inView ? <Counter value={stat.value} /> : "0"}
              </h3>
              <p className="text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;