import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PolarBearProps {
  isPasswordField: boolean;
  isFocused: boolean;
}

export const PolarBearAnimation: React.FC<PolarBearProps> = ({ isPasswordField, isFocused }) => {
  // State to track if eyes should be closed
  const [eyesClosed, setEyesClosed] = useState(false);
  
  // Update eyes state based on props
  useEffect(() => {
    setEyesClosed(isPasswordField && isFocused);
  }, [isPasswordField, isFocused]);

  return (
    <div className="flex justify-center items-center mb-6">
      <motion.div 
        className="relative w-48 h-48"
        initial={{ y: -20 }}
        animate={{ 
          y: [0, -10, 0],
          rotate: isFocused ? [0, -2, 2, -1, 0] : 0
        }}
        transition={{ 
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          rotate: { duration: 0.5 }
        }}
      >
        {/* Polar Bear Face */}
        <motion.div 
          className="absolute w-36 h-36 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        />
        
        {/* Ears */}
        <motion.div className="absolute w-10 h-10 bg-white rounded-full -left-1 top-2 border-2 border-gray-100">
          <motion.div className="absolute w-5 h-5 bg-red-400 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <motion.div className="absolute w-10 h-10 bg-white rounded-full -right-1 top-2 border-2 border-gray-100">
          <motion.div className="absolute w-5 h-5 bg-red-400 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        
        {/* Eyes */}
        <motion.div 
          className="absolute w-6 h-6 bg-gray-800 rounded-full left-1/3 top-1/3"
          animate={{ 
            scaleY: eyesClosed ? 0.1 : 1,
            y: eyesClosed ? 2 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute w-2 h-2 bg-white rounded-full top-1 left-1"
            animate={{ opacity: eyesClosed ? 0 : 1 }}
          />
        </motion.div>
        <motion.div 
          className="absolute w-6 h-6 bg-gray-800 rounded-full right-1/3 top-1/3"
          animate={{ 
            scaleY: eyesClosed ? 0.1 : 1,
            y: eyesClosed ? 2 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute w-2 h-2 bg-white rounded-full top-1 left-1"
            animate={{ opacity: eyesClosed ? 0 : 1 }}
          />
        </motion.div>
        
        {/* Nose */}
        <motion.div className="absolute w-5 h-4 bg-gray-800 rounded-full left-1/2 top-1/2 -translate-x-1/2" />
        
        {/* Mouth */}
        <motion.div 
          className="absolute w-12 h-5 left-1/2 -translate-x-1/2 top-[60%]"
          animate={{
            scaleY: isFocused && !isPasswordField ? 1.5 : 1,
            y: isFocused && !isPasswordField ? 2 : 0
          }}
        >
          <motion.svg width="100%" height="100%" viewBox="0 0 48 20">
            <motion.path
              d="M 10 10 Q 24 20 38 10"
              stroke="black"
              strokeWidth="2"
              fill="transparent"
              animate={{
                d: isFocused && !isPasswordField 
                  ? "M 10 10 Q 24 0 38 10" 
                  : "M 10 10 Q 24 20 38 10"
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.svg>
        </motion.div>
        
        {/* Scarf - removed red background */}
        <motion.div 
          className="absolute w-48 h-12 border-2 border-red-500 rounded-full -bottom-2 left-1/2 -translate-x-1/2 z-[-1]"
          animate={{
            y: isFocused ? [-2, 2, -1, 1, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute w-12 h-16 border-2 border-red-500 rounded-md bottom-0 left-1/2 -translate-x-1/2 z-[-2]"
          animate={{
            y: isFocused ? [0, 2, 0] : 0,
            rotate: isFocused ? [-2, 2, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

export default PolarBearAnimation;
