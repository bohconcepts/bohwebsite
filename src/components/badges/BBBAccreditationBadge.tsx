import React from 'react';

interface BBBAccreditationBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BBB Accreditation Badge Component
 * Displays the Better Business Bureau accreditation badge with a link to the company's BBB profile
 */
const BBBAccreditationBadge: React.FC<BBBAccreditationBadgeProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  // Size classes for different badge sizes
  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-16 w-auto',
    lg: 'h-20 w-auto'
  };

  return (
    <a 
      href="https://www.bbb.org/us/wa/kirkland/profile/hospitality/back-of-house-concepts-1296-1000156994" 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`inline-block ${className}`}
      aria-label="BBB Accredited Business - Click for Review"
      title="BBB Accredited Business"
    >
      <img 
        src="/images/badges/bbb-accredited.svg" 
        alt="BBB Accredited Business A+ Rating" 
        className={`${sizeClasses[size]} transition-transform hover:scale-105`}
      />
    </a>
  );
};

export default BBBAccreditationBadge;
