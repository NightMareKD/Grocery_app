import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
}) {
  const [countdown, setCountdown] = useState(5);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3); // countdown seconds
      setCanProceed(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanProceed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!canProceed || loading) return;

    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation error:', error);
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
              <div className="p-6">
                {/* Icon + Title + Message */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <Dialog.Title className="text-lg font-medium text-slate-900">
                      {title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-slate-600">{message}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={!canProceed || loading}
                    className={`
                      px-4 py-2 rounded-lg transition-all duration-200 flex items-center
                      ${
                        canProceed && !loading
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {confirmLabel}
                    {!canProceed && !loading && (
                      <span className="ml-1">({countdown})</span>
                    )}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
