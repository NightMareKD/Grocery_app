import { useState } from 'react';
import { PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, isAfter, differenceInDays } from '../utils/dateUtils';

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return { status: 'no-expiry', color: 'bg-slate-500', textColor: 'text-slate-700' };
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);
  
  if (daysUntilExpiry <= 0) {
    return { status: 'expired', color: 'bg-danger-500', textColor: 'text-danger-700' };
  } else if (daysUntilExpiry <= 3) {
    return { status: 'critical', color: 'bg-danger-500', textColor: 'text-danger-700' };
  } else if (daysUntilExpiry <= 14) {
    return { status: 'warning', color: 'bg-warn-500', textColor: 'text-warn-700' };
  } else {
    return { status: 'good', color: 'bg-emerald-500', textColor: 'text-emerald-700' };
  }
}

export default function PantryItemCard({ item, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const expiryStatus = getExpiryStatus(item.expiry_date);
  const isOutOfStock = item.quantity <= 0;

  return (
    <div
      className={`
        bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl 
        transition-all duration-300 overflow-hidden border border-white/30
        ${isHovered ? 'transform -translate-y-1 scale-[1.02]' : ''}
        ${isOutOfStock ? 'opacity-75' : ''}
        animate-fade-in
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header with name and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 truncate">
              {item.name}
            </h3>
            {isOutOfStock && (
              <div className="flex items-center mt-1 text-danger-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-3">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              aria-label="Edit item"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-2 text-slate-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
              aria-label="Delete item"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quantity and Unit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-slate-800">
              {item.quantity}
            </div>
            {item.unit && (
              <div className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                {item.unit}
              </div>
            )}
          </div>
          
          {/* Expiry Badge */}
          {item.expiry_date ? (
            <div className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${expiryStatus.color} text-white shadow-sm
            `}>
              {formatDistanceToNow(item.expiry_date)}
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-500 text-white shadow-sm">
              No expiry
            </div>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-sm text-slate-600 line-clamp-2">
              {item.notes}
            </p>
          </div>
        )}

        {/* Expiry Date */}
        {item.expiry_date && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className={`text-xs ${expiryStatus.textColor} font-medium`}>
              Expires: {new Date(item.expiry_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}