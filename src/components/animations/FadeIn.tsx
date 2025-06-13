import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 0.5,
  className = '',
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Set initial and animate values based on direction
  const getDirectionalValues = () => {
    switch (direction) {
      case 'up':
        return { initial: { y: distance }, animate: { y: 0 } };
      case 'down':
        return { initial: { y: -distance }, animate: { y: 0 } };
      case 'left':
        return { initial: { x: distance }, animate: { x: 0 } };
      case 'right':
        return { initial: { x: -distance }, animate: { x: 0 } };
      case 'none':
        return { initial: {}, animate: {} };
      default:
        return { initial: { y: distance }, animate: { y: 0 } };
    }
  };

  const { initial, animate } = getDirectionalValues();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        ...animate,
        transition: {
          duration,
          delay,
          ease: 'easeOut',
        },
      });
    }
  }, [isInView, controls, animate, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};
