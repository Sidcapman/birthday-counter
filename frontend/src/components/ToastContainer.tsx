'use client';

import React from 'react';
import ErrorToast, { Toast } from './ErrorToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            zIndex: 1000 + toasts.length - index, // Stack toasts properly
          }}
        >
          <ErrorToast toast={toast} onClose={onRemoveToast} />
        </div>
      ))}
    </div>
  );
}