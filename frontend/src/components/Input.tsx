import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</span>}
    </div>
  );
};
