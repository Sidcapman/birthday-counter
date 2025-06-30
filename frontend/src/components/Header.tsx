import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Countdown
        </h1>
        <button
          onClick={onAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
          aria-label="Add new birthday"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}