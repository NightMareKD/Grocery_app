import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
                Smart Grocery
              </h1>
              <p className="text-sm text-slate-600 font-medium">Pantry Manager</p>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <div className="text-sm text-slate-600">
              Keep track of your pantry items and expiry dates
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}