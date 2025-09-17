import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const sortOptions = [
  { value: 'expiry', label: 'Expiry Date', description: 'Soonest first' },
  { value: 'quantity', label: 'Quantity', description: 'Low to high' },
  { value: 'name', label: 'Name', description: 'A to Z' },
];

export default function SortFilterBar({
  sortBy,
  onSortChange,
  showExpiringOnly,
  onFilterChange,
  totalItems,
  expiringCount,
  filteredCount
}) {
  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side - Stats and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{filteredCount}</span>
            {filteredCount !== totalItems && (
              <span> of <span className="font-semibold text-slate-800">{totalItems}</span></span>
            )}
            {filteredCount === 1 ? ' item' : ' items'}
          </div>

          {expiringCount > 0 && (
            <button
              onClick={() => onFilterChange(!showExpiringOnly)}
              className={`
                inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${showExpiringOnly 
                  ? 'bg-warn-500 text-white shadow-md hover:bg-warn-600' 
                  : 'bg-warn-100 text-warn-700 hover:bg-warn-200'
                }
              `}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {expiringCount} expiring soon
              {showExpiringOnly && ' (filtered)'}
            </button>
          )}
        </div>

        {/* Right side - Sort */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg shadow-sm hover:shadow-md text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200">
            Sort by {currentSort?.label}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-white/30 focus:outline-none z-[9999]">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => onSortChange(option.value)}
                        className={`
                          group flex w-full items-center rounded-lg px-3 py-3 text-sm transition-colors duration-150
                          ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-700'}
                          ${sortBy === option.value ? 'bg-primary-100 text-primary-800 font-medium' : ''}
                        `}
                      >
                        <div className="flex-1 text-left">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.description}</div>
                        </div>
                        {sortBy === option.value && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full ml-2"></div>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}