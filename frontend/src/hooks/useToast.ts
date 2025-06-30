'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/ErrorToast';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? (type === 'error' ? 0 : 5000), // Error toasts don't auto-close
      action: options?.action,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  
  const showError = useCallback((title: string, message: string, action?: { label: string; onClick: () => void }) => {
    return addToast('error', title, message, { action });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addToast('warning', title, message, { duration });
  }, [addToast]);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addToast('success', title, message, { duration: duration ?? 3000 });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addToast('info', title, message, { duration });
  }, [addToast]);

  
  const showNetworkError = useCallback((retryAction?: () => void) => {
    return showError(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection.',
      retryAction ? { label: 'Retry', onClick: retryAction } : undefined
    );
  }, [showError]);

  const showTimeoutError = useCallback((retryAction?: () => void) => {
    return showError(
      'Request Timeout',
      'The request is taking too long. Please try again.',
      retryAction ? { label: 'Retry', onClick: retryAction } : undefined
    );
  }, [showError]);

  const showValidationError = useCallback((errors: string[]) => {
    const message = errors.length === 1 
      ? errors[0] 
      : `Please fix the following errors:\n${errors.map(err => `• ${err}`).join('\n')}`;
    
    return showError('Validation Error', message);
  }, [showError]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    showError,
    showWarning,
    showSuccess,
    showInfo,
    showNetworkError,
    showTimeoutError,
    showValidationError,
  };
}