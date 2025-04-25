import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function Alert({ type = 'info', className, children, ...props }: AlertProps) {
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variants[type],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 