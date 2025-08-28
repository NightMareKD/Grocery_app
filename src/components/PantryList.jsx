import { useState, useMemo } from 'react';
import PantryItemCard from './PantryItemCard';
import SortFilterBar from './SortFilterBar';
import { differenceInDays } from '../utils/dateUtils';

export default function PantryList({ items, loading, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry', 'quantity', 'name'
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Filter by expiring soon (7 days)
    if (showExpiringOnly) {
      filtered = filtered.filter(item => {
        if (!item.expiry_date) return false;
        const daysUntilExpiry = differenceInDays(new Date(item.expiry_date), new Date());
        return daysUntilExpiry <= 7;
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'quantity':
          if (a.quantity !== b.quantity) {
            return a.quantity - b.quantity; // Low to high
          }
          return a.name.localeCompare(b.name); // Secondary sort by name
          
        case 'name':
          return a.name.localeCompare(b.name);
          
        case 'expiry':
        default:
          // Items without expiry go to bottom
          if (!a.expiry_date && !b.expiry_date) {
            return a.name.localeCompare(b.name); // Alphabetical for no-expiry items
          }
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          
          // Sort by expiry date (ascending - soonest first)
          const dateA = new Date(a.expiry_date);
          const dateB = new Date(b.expiry_date);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          return a.name.localeCompare(b.name); // Secondary sort by name
      }
    });

    return filtered;
  }, [items, sortBy, showExpiringOnly]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading your pantry items...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🥫</span>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Your pantry is empty</h3>
          <p className="text-slate-600 mb-6">Start adding items to keep track of your groceries and their expiry dates.</p>
        </div>
      </div>
    );
  }

  const expiringCount = items.filter(item => {
    if (!item.expiry_date) return false;
    const daysUntilExpiry = differenceInDays(new Date(item.expiry_date), new Date());
    return daysUntilExpiry <= 7;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SortFilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        showExpiringOnly={showExpiringOnly}
        onFilterChange={setShowExpiringOnly}
        totalItems={items.length}
        expiringCount={expiringCount}
        filteredCount={filteredAndSortedItems.length}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredAndSortedItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PantryItemCard
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      {showExpiringOnly && filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No items expiring soon</h3>
          <p className="text-slate-600">Great! All your items are fresh and have plenty of time before expiring.</p>
        </div>
      )}
    </div>
  );
}