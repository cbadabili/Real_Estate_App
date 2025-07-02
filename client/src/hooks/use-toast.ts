
import { useContext } from 'react';
import { ToastContext } from '../components/ui/Toast';

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = (props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    const type = props.variant === 'destructive' ? 'error' : 'success';
    context.addToast({
      type,
      title: props.title || '',
      message: props.description || '',
    });
  };

  return { toast };
};
