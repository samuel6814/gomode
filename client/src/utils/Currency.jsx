import React from 'react';

/**
 * Utility function to format numbers as GHC.
 * Use this when you just need the text string (e.g., inside alerts or calculations).
 */
export const formatGHC = (amount) => {
  // Ensures the amount is a number and forces 2 decimal places
  const numericAmount = Number(amount) || 0;
  return `GHC ${numericAmount.toFixed(2)}`;
};

/**
 * React Component to display formatted GHC.
 * Use this directly in your JSX.
 */
const Currency = ({ amount, className, style }) => {
  return (
    <span className={className} style={style}>
      {formatGHC(amount)}
    </span>
  );
};

export default Currency;