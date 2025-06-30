'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export default function ErrorToast({ toast, onClose }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  }, [onClose, toast.id]);

  useEffect(() => {
    
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    
    let autoCloseTimer: NodeJS.Timeout;
    if (toast.duration && toast.duration > 0) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, toast.duration);
    }

    return () => {
      clearTimeout(timer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [toast.duration, handleClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <RefreshCw className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`fixed top-4 right-4 max-w-md w-full border rounded-lg shadow-lg transition-all duration-300 z-50 ${
        styles.bg
      } ${
        isVisible && !isExiting 
          ? 'transform translate-x-0 opacity-100' 
          : 'transform translate-x-full opacity-0'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {toast.title}
            </h3>
            <p className={`mt-1 text-sm ${styles.message}`}>
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`text-sm font-medium underline hover:no-underline ${styles.title}`}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}