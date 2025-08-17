import { forwardRef } from 'react';
import type { InputProps } from './Input.types';
import './Input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'medium',
  variant = 'default',
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  className = '',
  ...rest
}, ref) => {
  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    error && 'input--error',
    disabled && 'input--disabled',
    fullWidth && 'input--full-width',
    leftIcon && 'input--has-left-icon',
    rightIcon && 'input--has-right-icon',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    fullWidth && 'input-container--full-width'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-label__required" aria-hidden="true">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {leftIcon && (
          <button
            type="button"
            className="input-icon input-icon--left"
            onClick={onLeftIconClick}
            tabIndex={onLeftIconClick ? 0 : -1}
            aria-hidden={!onLeftIconClick}
          >
            {leftIcon}
          </button>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${rest.id}-error` : 
            helperText ? `${rest.id}-helper` : 
            undefined
          }
          {...rest}
        />
        
        {rightIcon && (
          <button
            type="button"
            className="input-icon input-icon--right"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            aria-hidden={!onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      
      {error && (
        <div className="input-error" id={`${rest.id}-error`} role="alert">
          {error}
        </div>
      )}
      
      {!error && helperText && (
        <div className="input-helper" id={`${rest.id}-helper`}>
          {helperText}
        </div>
      )}
    </div>
  );
});