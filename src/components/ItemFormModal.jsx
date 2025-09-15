import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  isShopping // ✅ Use the existing prop
}) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'pcs',
    expirationDate: '',
    comments: ''
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quantity: initialData.quantity || 1,
        unit: initialData.unit || 'pcs',
        expirationDate: initialData.expirationDate || '',
        comments: initialData.comments || ''
      });
    } else {
      setFormData({
        name: '',
        quantity: 1,
        unit: 'pcs',
        expirationDate: '',
        comments: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Clean the form data
    const cleanData = {
      ...formData,
      name: formData.name.trim(),
      quantity: parseInt(formData.quantity) || 1
    };

    onSubmit(cleanData);
    // Parent handles closing after successful submission
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Dialog.Title className="text-lg font-medium text-gray-900 pr-8">
                  {initialData ? 'Edit Item' : 'Add Item'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter item name"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      disabled={loading}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Unit */}
                  {!isShopping && (
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                        Unit / Value
                      </label>
                      <select
                        name="unit"
                        id="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={loading}
                      >
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                  )}

                  {/* Expiration Date */}
                  {!isShopping && (
                    <div>
                      <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        name="expirationDate"
                        id="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Comments */}
                  {!isShopping && (
                    <div>
                      <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                        Comments
                      </label>
                      <textarea
                        name="comments"
                        id="comments"
                        rows={3}
                        value={formData.comments}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Any additional notes..."
                      />
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : initialData ? 'Update' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
