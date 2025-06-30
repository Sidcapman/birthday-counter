'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import BirthdayCard from './BirthdayCard';
import BirthdayFormModal from './BirthdayFormModal';
import ConfirmDialog from './ConfirmDialog';
import ToastContainer from './ToastContainer';
import { BirthdayCardSkeleton } from './SkeletonLoader';
import { birthdayApi, ApiError } from '@/services/api';
import { Birthday, CreateBirthdayRequest, EventType, ReminderType, RepeatType, ShowPreference } from '@/types';

interface BirthdayFormData {
  name: string;
  date: string;
  reminderType: string;
  repeatType: string;
  eventType: string;
  showPreference: string;
  showAge: boolean;
}
import { useToast } from '@/hooks/useToast';
import { AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('birthday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);
  
  const { 
    toasts, 
    removeToast, 
    showError, 
    showSuccess, 
    showNetworkError, 
    showTimeoutError, 
    showValidationError 
  } = useToast();

  const handleApiError = useCallback((error: ApiError, retryAction?: () => void) => {
    switch (error.type) {
      case 'network':
        showNetworkError(retryAction);
        break;
      case 'timeout':
        showTimeoutError(retryAction);
        break;
      case 'validation':
        if (error.validationErrors?.length) {
          showValidationError(error.validationErrors);
        } else {
          showError('Validation Error', error.message);
        }
        break;
      case 'not_found':
        showError('Not Found', error.message);
        break;
      case 'server':
        showError('Server Error', error.message, retryAction ? { label: 'Retry', onClick: retryAction } : undefined);
        break;
      default:
        showError('Error', error.message || 'An unexpected error occurred');
        break;
    }
  }, [showError, showNetworkError, showTimeoutError, showValidationError]);

  const fetchBirthdays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: { eventType?: string; daysAhead?: number } = {};
      
      switch (activeTab) {
        case 'countdown':
          filters.daysAhead = 30;
          break;
        case 'birthday':
          filters.eventType = 'BIRTHDAY';
          break;
        case 'anniversary':
          filters.eventType = 'ANNIVERSARY';
          break;
        case 'holiday':
          filters.eventType = 'HOLIDAY';
          break;
        
      }
      
      const response = await birthdayApi.getAllBirthdays(Object.keys(filters).length > 0 ? filters : undefined);
      setBirthdays(response.data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch birthdays:', err);
      handleApiError(err as ApiError, () => fetchBirthdays());
    } finally {
      setLoading(false);
    }
  }, [activeTab, handleApiError]);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBirthday(null);
  };

  const handleFormSubmit = async (formData: BirthdayFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (editingBirthday) {
        const updateRequest = {
          name: formData.name,
          date: formData.date,
          reminderType: mapReminderType(formData.reminderType),
          repeatType: mapRepeatType(formData.repeatType),
          eventType: mapEventType(formData.eventType),
          showPreference: mapShowPreference(formData.showPreference),
          showAge: formData.showAge,
        };
        
        await birthdayApi.updateBirthday(editingBirthday.id, updateRequest);
        showSuccess('Updated!', `${formData.name}'s birthday has been updated successfully.`);
      } else {
        const createRequest: CreateBirthdayRequest = {
          name: formData.name,
          date: formData.date,
          reminderType: mapReminderType(formData.reminderType),
          repeatType: mapRepeatType(formData.repeatType),
          eventType: mapEventType(formData.eventType),
          showPreference: mapShowPreference(formData.showPreference),
          showAge: formData.showAge,
        };
        
        await birthdayApi.createBirthday(createRequest);
        showSuccess('Created!', `${formData.name}'s birthday has been added successfully.`);
      }
      
      setIsModalOpen(false);
      setEditingBirthday(null);
      
      await fetchBirthdays();
      
    } catch (err: unknown) {
      console.error('Failed to save birthday:', err);
      const retryAction = () => handleFormSubmit(formData);
      handleApiError(err as ApiError, retryAction);
    } finally {
      setSubmitting(false);
    }
  };

  const mapReminderType = (type: string): ReminderType => {
    switch (type) {
      case 'on-day-early': return ReminderType.ONE_DAY_BEFORE;
      case 'on-day': return ReminderType.SAME_DAY;
      case 'two-days-early': return ReminderType.CUSTOM;
      default: return ReminderType.NONE;
    }
  };

  const mapRepeatType = (type: string): RepeatType => {
    switch (type) {
      case 'yearly': return RepeatType.YEARLY;
      case 'monthly': return RepeatType.MONTHLY;
      case 'never': return RepeatType.NEVER;
      default: return RepeatType.YEARLY;
    }
  };

  const mapEventType = (type: string): EventType => {
    switch (type) {
      case 'birthday': return EventType.BIRTHDAY;
      case 'anniversary': return EventType.ANNIVERSARY;
      case 'holiday': return EventType.HOLIDAY;
      default: return EventType.OTHER;
    }
  };

  const mapShowPreference = (pref: string): ShowPreference => {
    switch (pref) {
      case 'show-smart-list': return ShowPreference.PUBLIC;
      case 'never-show': return ShowPreference.PRIVATE;
      default: return ShowPreference.PUBLIC;
    }
  };

  const handleEdit = (id: string) => {
    const birthday = birthdays.find(b => b.id === id);
    if (birthday) {
      setEditingBirthday(birthday);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const birthday = birthdays.find(b => b.id === id);
    if (birthday) {
      setDeletingBirthday(birthday);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBirthday) return;

    try {
      await birthdayApi.deleteBirthday(deletingBirthday.id);
      showSuccess('Deleted!', `${deletingBirthday.name}'s birthday has been deleted.`);
      setDeletingBirthday(null);
      await fetchBirthdays();
    } catch (err: unknown) {
      console.error('Failed to delete birthday:', err);
      const retryAction = () => handleConfirmDelete();
      handleApiError(err as ApiError, retryAction);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={handleAddClick} />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <BirthdayCardSkeleton key={i} />
            ))}
          </div>
        ) : birthdays.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No birthdays found</div>
            <div className="text-gray-400 text-sm">
              {activeTab === 'all' ? 'Add your first birthday to get started!' : `No ${activeTab} events found.`}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {birthdays.map((birthday) => (
              <BirthdayCard
                key={birthday.id}
                id={birthday.id}
                name={birthday.name}
                daysUntil={birthday.daysUntilNext || 0}
                targetDate={birthday.date}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BirthdayFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
        editingBirthday={editingBirthday}
      />

      <ConfirmDialog
        isOpen={!!deletingBirthday}
        title="Delete Birthday"
        message={`Are you sure you want to delete ${deletingBirthday?.name}'s birthday? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingBirthday(null)}
        type="danger"
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}