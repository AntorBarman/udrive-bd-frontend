import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon = null,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || props.name;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-surface border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
            Icon ? 'pl-9' : ''
          } ${
            error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border'
          } ${className}`}
          {...props}
        />
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-text-muted">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;