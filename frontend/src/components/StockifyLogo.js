import React from 'react';

const StockifyLogo = ({ size = 32, className = "" }) => {
  return (
    <img 
      src="/stock.png" 
      alt="Stockify Logo"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: '50%' }}
    />
  );
};

export default StockifyLogo;
