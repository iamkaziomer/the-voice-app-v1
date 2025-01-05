import React from 'react';

const Alert = ({ variant, className, children }) => {
  const alertStyle = variant === 'destructive' 
    ? 'bg-red-100 border border-red-400 text-red-700' 
    : 'bg-blue-100 border border-blue-400 text-blue-700';
  return (
    <div className={`${alertStyle} px-4 py-3 rounded relative ${className}`} role="alert">
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => (
  <span className="block sm:inline">{children}</span>
);

export default Alert;
