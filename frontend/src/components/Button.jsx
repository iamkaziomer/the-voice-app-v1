import React from 'react';

const Button = ({ children, onClick, className, disabled, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-200',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
