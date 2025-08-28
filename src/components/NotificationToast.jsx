import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XMarkIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

const toastTypes = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-800'
  },
  error: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-danger-50',
    borderColor: 'border-danger-200',
    iconColor: 'text-danger-600',
    textColor: 'text-danger-800'
  },
  info: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    iconColor: 'text-primary-600',
    textColor: 'text-primary-800'
  }
};

export default function NotificationToast({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  showUndo = false,
  onUndo,
  undoLabel = 'Undo'
}) {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  
  const config = toastTypes[type];
  const Icon = config.icon;

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(duration / 1000);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, duration, onClose]);

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`
          max-w-sm w-full bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border
          ${config.bgColor} ${config.borderColor}
        `}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>
              
              <div className="ml-3 w-0 flex-1">
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {title}
                </p>
                {message && (
                  <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
                    {message}
                  </p>
                )}
                
                {showUndo && (
                  <div className="mt-3 flex items-center space-x-3">
                    <button
                      onClick={handleUndo}
                      className={`
                        inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
                        ${config.textColor} hover:bg-white/50 transition-colors duration-200
                      `}
                    >
                      <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
                      {undoLabel}
                    </button>
                    <div className="text-xs opacity-75">
                      {Math.ceil(timeLeft)}s
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={onClose}
                  className={`
                    inline-flex rounded-md p-1 hover:bg-white/50 transition-colors duration-200
                    ${config.textColor} opacity-75 hover:opacity-100
                  `}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 bg-white/30 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ease-linear ${
                  type === 'success' ? 'bg-emerald-500' : 
                  type === 'error' ? 'bg-danger-500' : 'bg-primary-500'
                }`}
                style={{ width: `${(timeLeft / (duration / 1000)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}