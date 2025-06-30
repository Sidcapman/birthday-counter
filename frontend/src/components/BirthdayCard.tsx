import React from 'react';
import { Cake, Edit2, Trash2 } from 'lucide-react';

interface BirthdayCardProps {
  id: string;
  name: string;
  daysUntil: number;
  targetDate: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BirthdayCard({ id, name, daysUntil, targetDate, onEdit, onDelete }: BirthdayCardProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-orange-100 p-2 rounded-lg mr-3">
            <Cake className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit birthday"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete birthday"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      
      <div className="text-center mb-4">
        <div className="text-6xl font-bold text-blue-500 mb-2" style={{ fontWeight: 300 }}>
          {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow!' : daysUntil}
        </div>
        <p className="text-gray-600 text-sm">
          {daysUntil === 0 ? 'It\'s their special day!' : 
           daysUntil === 1 ? 'Tomorrow is the day!' :
           `Days until ${formatDate(targetDate)}`}
        </p>
      </div>
    </div>
  );
}