import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ItemFormModal({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: '',
    expiry_date: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quantity: initialData.quantity || 1,
        unit: initialData.unit || '',
        expiry_date: initialData.expiry_date || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        quantity: 1,
        unit: '',
        expiry_date: '',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.expiry_date && new Date(formData.expiry_date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.expiry_date = 'Expiry date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to save item' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <Dialog.Title className="text-lg font-semibold text-slate-800">
                  {initialData ? 'Edit Item' : 'Add New Item'}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      transition-colors duration-200 ${errors.name ? 'border-danger-300' : 'border-slate-300'}
                    `}
                    placeholder="e.g., Organic Milk"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
                  )}
                </div>

                {/* Quantity and Unit Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                      min="0"
                      step="0.1"
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                        transition-colors duration-200 ${errors.quantity ? 'border-danger-300' : 'border-slate-300'}
                      `}
                      required
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-danger-600">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-slate-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="e.g., liters, kg"
                    />
                  </div>
                </div>

                {/* Expiry Date Field */}
                <div>
                  <label htmlFor="expiry_date" className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiry_date"
                    value={formData.expiry_date}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      transition-colors duration-200 ${errors.expiry_date ? 'border-danger-300' : 'border-slate-300'}
                    `}
                  />
                  {errors.expiry_date && (
                    <p className="mt-1 text-sm text-danger-600">{errors.expiry_date}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Optional notes about storage, usage, etc."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 disabled:opacity-50 flex items-center"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {initialData ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}