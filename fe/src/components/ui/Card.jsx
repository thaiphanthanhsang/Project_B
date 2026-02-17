import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-neutral-200 shadow-sm ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
