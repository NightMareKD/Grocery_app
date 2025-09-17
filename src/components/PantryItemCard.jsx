import { useState } from 'react';
import { PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { differenceInDays, formatDistanceToNow } from '../utils/dateUtils';

function buildExpiryMeta(expiryDate) {
  if (!expiryDate) {
    return {
      badge: 'No date',
      variant: 'neutral',
      daysLeft: null
    };
  }
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = differenceInDays(expiry, today);

  if (isNaN(daysLeft)) {
    return { badge: 'Invalid date', variant: 'neutral', daysLeft: null };
  }
  if (daysLeft < 0) return { badge: 'Expired', variant: 'danger', daysLeft };
  if (daysLeft === 0) return { badge: 'Today', variant: 'warn', daysLeft };
  if (daysLeft <= 3) return { badge: `${daysLeft}d left`, variant: 'warn', daysLeft };
  if (daysLeft <= 14) return { badge: `${daysLeft}d left`, variant: 'soon', daysLeft };
  return { badge: `${daysLeft}d left`, variant: 'ok', daysLeft };
}

const variantClasses = {
  danger: 'bg-red-100 text-red-700 border-red-300',
  warn: 'bg-amber-100 text-amber-700 border-amber-300',
  soon: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ok: 'bg-green-100 text-green-700 border-green-300',
  neutral: 'bg-slate-100 text-slate-600 border-slate-300'
};

export default function PantryItemCard({ item, onEdit, onDelete }) {
  const [hover, setHover] = useState(false);
  const expiryMeta = buildExpiryMeta(item.expiry_date);
  const isOut = item.quantity <= 0;

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm transition
        ${hover ? 'shadow-md translate-y-[-2px]' : ''}
        ${isOut ? 'opacity-80' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 leading-snug break-words">
                {item.name}
              </h3>
              {isOut && (
                <div className="mt-1 flex items-center text-xs font-medium text-red-600">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Out of stock
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                aria-label="Edit item"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete item"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
        </div>

        {/* Middle row: quantity + expiry badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-800 tabular-nums">
              {item.quantity}
            </span>
            {item.unit && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                {item.unit}
              </span>
            )}
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium
              ${variantClasses[expiryMeta.variant]}`}
          >
            {expiryMeta.badge}
          </span>
        </div>

        {/* Notes (optional) */}
        {item.notes && (
          <div className="text-sm text-slate-600 border-t border-slate-100 pt-3">
            {item.notes}
          </div>
        )}

        {/* Expiry detail (always show a line for clarity) */}
        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex flex-wrap gap-x-4 gap-y-1">
          <div>
            Added: {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
          </div>
          <div>
            Expires:{' '}
            {item.expiry_date
              ? `${new Date(item.expiry_date).toLocaleDateString()} (${formatDistanceToNow(item.expiry_date)})`
              : 'No date'}
          </div>
        </div>
      </div>
    </div>
  );
}