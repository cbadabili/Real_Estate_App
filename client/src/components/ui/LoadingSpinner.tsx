import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`inline-block border-2 border-primary-200 border-t-primary-600 rounded-full ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const LoadingScreen = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
};