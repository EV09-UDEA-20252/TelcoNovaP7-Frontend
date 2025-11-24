// SimpleSelect.tsx

import * as React from 'react';
import { cn } from '@/lib/utils';

// Exportamos la interfaz de la opción para usarla en otros componentes (como OrdersTable)
export interface SelectOption {
  value: string;
  label: string;
}

export interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  placeholder?: string;
  // Usamos el tipo SelectOption[]
  options: SelectOption[];
}

const SimpleSelect = React.forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ className, error, label, placeholder, options, ...props }, ref) => {
    return (
      <div className="form-field">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <select
          className={cn(
            "form-input",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">{placeholder || "Seleccionar..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
SimpleSelect.displayName = 'SimpleSelect';

export { SimpleSelect };
