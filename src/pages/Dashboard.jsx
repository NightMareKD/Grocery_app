import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import PantryList from '../components/PantryList';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationToast from '../components/NotificationToast';
import { pantryApi, shoppingApi } from '../api/api'; // Make sure shoppingApi is implemented

const TABS = [
  { key: 'pantry', label: 'Pantry List' },
  { key: 'shopping', label: 'Shopping List' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pantry');
  //Login Logic
  // Pantry state
  const [pantryItems, setPantryItems] = useState([]);
  const [pantryLoading, setPantryLoading] = useState(true);

  // Shopping state
  const [shoppingItems, setShoppingItems] = useState([]);
  const [shoppingLoading, setShoppingLoading] = useState(true);

  // Shared modal/dialog/toast state
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showUndo: false,
    onUndo: null,
    deletedItem: null
  });

  // Load pantry items
  const loadPantryItems = async () => {
    try {
      setPantryLoading(true);
      const data = await pantryApi.getAll();
      setPantryItems(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to load pantry items',
        message: error.message
      });
    } finally {
      setPantryLoading(false);
    }
  };

  // Floating Add Button (show for both tabs, or only shopping tab)
{activeTab === 'shopping' && (
  <button
    onClick={handleAddItem}
    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center"
    aria-label="Add shopping item"
  >
    <PlusIcon className="h-6 w-6" />
  </button>
)}

  // Load shopping items
  const loadShoppingItems = async () => {
    try {
      setShoppingLoading(true);
      const data = await shoppingApi.getAll();
      setShoppingItems(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to load shopping items',
        message: error.message
      });
    } finally {
      setShoppingLoading(false);
    }
  };

  useEffect(() => {
    loadPantryItems();
    loadShoppingItems();
  }, []);

  // Toast helpers
  const showToast = (config) => {
    setToast({
      isOpen: true,
      type: 'info',
      showUndo: false,
      onUndo: null,
      deletedItem: null,
      ...config
    });
  };
  const hideToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  // Add/Edit handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };
  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };
  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setConfirmDialogOpen(true);
  };

  // Form submit handler (pantry or shopping)
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    const api = activeTab === 'pantry' ? pantryApi : shoppingApi;
    const itemsSetter = activeTab === 'pantry' ? setPantryItems : setShoppingItems;
    const items = activeTab === 'pantry' ? pantryItems : shoppingItems;

    try {
      if (editingItem) {
        const updatedItem = await api.update(editingItem.id, formData);
        itemsSetter(items.map(item => item.id === editingItem.id ? updatedItem : item));
        showToast({
          type: 'success',
          title: 'Item updated',
          message: `${updatedItem.name} has been updated successfully.`
        });
      } else {
        const newItem = await api.create(formData);
        itemsSetter([...items, newItem]);
        showToast({
          type: 'success',
          title: 'Item added',
          message: `${newItem.name} has been added.`
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Form error',
        message: error.message
      });
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // Delete handler (pantry or shopping)
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    const api = activeTab === 'pantry' ? pantryApi : shoppingApi;
    const itemsSetter = activeTab === 'pantry' ? setPantryItems : setShoppingItems;
    const items = activeTab === 'pantry' ? pantryItems : shoppingItems;

    try {
      await api.delete(deletingItem.id);
      itemsSetter(items.filter(item => item.id !== deletingItem.id));
      showToast({
        type: 'success',
        title: 'Item deleted',
        message: `${deletingItem.name} has been removed.`,
        showUndo: true,
        deletedItem: deletingItem,
        onUndo: () => handleUndoDelete(deletingItem)
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Delete error',
        message: error.message
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Undo delete handler (pantry or shopping)
  const handleUndoDelete = async (deletedItem) => {
    const api = activeTab === 'pantry' ? pantryApi : shoppingApi;
    const itemsSetter = activeTab === 'pantry' ? setPantryItems : setShoppingItems;
    const items = activeTab === 'pantry' ? pantryItems : shoppingItems;

    try {
      const { id, created_at, ...itemData } = deletedItem;
      const restoredItem = await api.create(itemData);
      itemsSetter([...items, restoredItem]);
      showToast({
        type: 'info',
        title: 'Item restored',
        message: `${restoredItem.name} has been restored.`
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to restore item',
        message: 'Please try adding the item again manually.'
      });
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-accent-50/20">
      <Header />

      {/* Dashboard Tabs */}
      <div className="flex justify-center mt-8 mb-4 gap-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-6 py-3 rounded-lg font-semibold shadow transition ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-white text-primary-700 hover:bg-primary-100'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="pb-16">
        {activeTab === 'pantry' ? (
          <PantryList
            items={pantryItems}
            loading={pantryLoading}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ) : (
          <PantryList
            items={shoppingItems}
            loading={shoppingLoading}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            isShopping // Optionally pass a prop to distinguish
          />
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={handleAddItem}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center"
        aria-label="Add new item"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Modals */}
      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        loading={formLoading}
        isShopping={activeTab === 'shopping'}
      />

      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        loading={formLoading}
        isShopping={activeTab === 'shopping'} // Pass this prop
      />

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
      />

      {/* Toast Notification */}
      <NotificationToast
        isOpen={toast.isOpen}
        onClose={hideToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        showUndo={toast.showUndo}
        onUndo={toast.onUndo}
        duration={toast.showUndo ? 10000 : 5000}
      />
    </div>
  );
}