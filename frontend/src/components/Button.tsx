import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  fullWidth = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    outline: 'none',
    opacity: disabled || isLoading ? 0.7 : 1,
  };

  const variants = {
    primary: {
      background: 'var(--accent-gradient)',
      color: 'white',
      boxShadow: 'var(--shadow-glow)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'var(--text-primary)',
      backdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      background: 'var(--danger)',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    }
  };

  // Hover states using a simple style override for demonstration (in a real app, use CSS classes or styled-components for hover)
  // Since we are using Vanilla CSS, we'll assign a class name to handle hover states if needed, 
  // but for react inline styles we can't easily do hover.
  // Instead, let's use CSS classes for the variants in a component specific CSS or just global.
  // Wait, let's just use CSS modules or write the classes in index.css!
  
  // For simplicity and matching our plan, we'll use inline styles for the base and variants, 
  // but let's actually just define the classes in index.css for better hover support.
  
  return (
    <button 
      className={`btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
      {children}
    </button>
  );
};
