import React from 'react';

interface SectionTitleProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  underlineClassName?: string;
  descriptionClassName?: string;
  useLexendFont?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  className = '',
  titleClassName = '',
  underlineClassName = '',
  descriptionClassName = '',
  useLexendFont = false,
}) => {
  return (
    <div className={`section-title-container ${className}`}>
      <h2 className={`section-title ${useLexendFont ? 'lexend' : ''} ${titleClassName}`}>
        {title}
      </h2>
      <div className={`section-title-underline ${underlineClassName}`}></div>
      {description && (
        <p className={`section-description ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
