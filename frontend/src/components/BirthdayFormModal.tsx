'use client';

import React, { useState, useEffect } from 'react';
import { X, Cake } from 'lucide-react';
import { Birthday } from '@/types';

interface BirthdayFormData {
  name: string;
  date: string;
  reminderType: string;
  repeatType: string;
  eventType: string;
  showPreference: string;
  showAge: boolean;
}

interface BirthdayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BirthdayFormData) => void;
  isSubmitting?: boolean;
  editingBirthday?: Birthday | null;
}

export default function BirthdayFormModal({ isOpen, onClose, onSubmit, isSubmitting = false, editingBirthday }: BirthdayFormModalProps) {
  const [formData, setFormData] = useState<BirthdayFormData>({
    name: '',
    date: '',
    reminderType: '',
    repeatType: '',
    eventType: '',
    showPreference: '',
    showAge: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  
  useEffect(() => {
    if (editingBirthday && isOpen) {
      setFormData({
        name: editingBirthday.name,
        date: editingBirthday.date,
        reminderType: mapReminderTypeToForm(editingBirthday.reminderType),
        repeatType: mapRepeatTypeToForm(editingBirthday.repeatType),
        eventType: mapEventTypeToForm(editingBirthday.eventType),
        showPreference: mapShowPreferenceToForm(editingBirthday.showPreference),
        showAge: editingBirthday.showAge,
      });
    } else if (!editingBirthday && isOpen) {
      
      setFormData({
        name: '',
        date: '',
        reminderType: '',
        repeatType: '',
        eventType: '',
        showPreference: '',
        showAge: false,
      });
    }
  }, [editingBirthday, isOpen]);

  const mapReminderTypeToForm = (type: string): string => {
    switch (type) {
      case 'ONE_DAY_BEFORE': return 'on-day-early';
      case 'SAME_DAY': return 'on-day';
      case 'CUSTOM': return 'two-days-early';
      default: return '';
    }
  };

  const mapRepeatTypeToForm = (type: string): string => {
    switch (type) {
      case 'YEARLY': return 'yearly';
      case 'MONTHLY': return 'monthly';
      case 'NEVER': return 'never';
      default: return '';
    }
  };

  const mapEventTypeToForm = (type: string): string => {
    switch (type) {
      case 'BIRTHDAY': return 'birthday';
      case 'ANNIVERSARY': return 'anniversary';
      case 'HOLIDAY': return 'holiday';
      default: return '';
    }
  };

  const mapShowPreferenceToForm = (pref: string): string => {
    switch (pref) {
      case 'PUBLIC': return 'show-smart-list';
      case 'PRIVATE': return 'never-show';
      default: return '';
    }
  };

  const validateField = (field: keyof BirthdayFormData, value: unknown) => {
    switch (field) {
      case 'name':
        if (!value || !value.toString().trim()) {
          return 'Name is required';
        }
        if (value.toString().trim().length > 100) {
          return 'Name cannot exceed 100 characters';
        }
        if (value.toString().trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        break;
      
      case 'date':
        if (!value || typeof value !== 'string') {
          return 'Date is required';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(selectedDate.getTime())) {
          return 'Invalid date format';
        }
        
        if (selectedDate > today) {
          return 'Birthday cannot be in the future';
        }
        
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 150);
        if (selectedDate < minDate) {
          return 'Date cannot be more than 150 years ago';
        }
        break;
      
      case 'reminderType':
        if (!value) {
          return 'Reminder type is required';
        }
        break;
      
      case 'repeatType':
        if (!value) {
          return 'Repeat type is required';
        }
        break;
      
      case 'eventType':
        if (!value) {
          return 'Event type is required';
        }
        break;
      
      case 'showPreference':
        if (!value) {
          return 'Show preference is required';
        }
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    (Object.keys(formData) as Array<keyof BirthdayFormData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: keyof BirthdayFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      
      setFormData({
        name: '',
        date: '',
        reminderType: '',
        repeatType: '',
        eventType: '',
        showPreference: '',
        showAge: false,
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      date: '',
      reminderType: '',
      repeatType: '',
      eventType: '',
      showPreference: '',
      showAge: false,
    });
    setErrors({});
    onClose();
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Cake className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingBirthday ? 'Edit Birthday' : 'Add Birthday'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => handleFieldChange('eventType', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.eventType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select type</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="holiday">Holiday</option>
              </select>
              {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder
              </label>
              <select
                value={formData.reminderType}
                onChange={(e) => handleFieldChange('reminderType', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.reminderType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select reminder</option>
                <option value="on-day">On the day</option>
                <option value="on-day-early">1 day early</option>
                <option value="two-days-early">2 days early</option>
              </select>
              {errors.reminderType && <p className="text-red-500 text-xs mt-1">{errors.reminderType}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat
              </label>
              <select
                value={formData.repeatType}
                onChange={(e) => handleFieldChange('repeatType', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.repeatType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select repeat</option>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
              {errors.repeatType && <p className="text-red-500 text-xs mt-1">{errors.repeatType}</p>}
            </div>
          </div>

          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-3">Show Age</span>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('showAge', !formData.showAge)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      formData.showAge ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        formData.showAge ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-3">Visibility</span>
                  <select
                    value={formData.showPreference}
                    onChange={(e) => handleFieldChange('showPreference', e.target.value)}
                    className={`text-sm px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.showPreference ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="show-smart-list">Public</option>
                    <option value="never-show">Private</option>
                  </select>
                </div>
              </div>
            </div>
            {errors.showPreference && <p className="text-red-500 text-xs mt-1">{errors.showPreference}</p>}
          </div>

          
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
              className="flex-1 px-4 py-2.5 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 rounded-lg font-medium transition-colors flex items-center justify-center"
              style={{ 
                backgroundColor: (isSubmitting || Object.keys(errors).some(key => errors[key])) ? '#93C5FD' : '#4F85FF' 
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingBirthday ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingBirthday ? 'Update Birthday' : 'Create Birthday'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}