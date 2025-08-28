import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import PantryList from '../components/PantryList';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationToast from '../components/NotificationToast';
import { pantryApi } from '../api/api';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showUndo: false,
    onUndo: null,
    deletedItem: null
  });

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

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await pantryApi.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
      showToast({
        type: 'error',
        title: 'Failed to load items',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

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

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await pantryApi.update(editingItem.id, formData);
        setItems(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        showToast({
          type: 'success',
          title: 'Item updated',
          message: `${updatedItem.name} has been updated successfully.`
        });
      } else {
        // Create new item
        const newItem = await pantryApi.create(formData);
        setItems(prev => [...prev, newItem]);
        showToast({
          type: 'success',
          title: 'Item added',
          message: `${newItem.name} has been added to your pantry.`
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error; // Re-throw to be handled by the form
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    
    setDeleteLoading(true);
    try {
      await pantryApi.delete(deletingItem.id);
      
      // Remove from UI optimistically
      setItems(prev => prev.filter(item => item.id !== deletingItem.id));
      
      // Show undo toast
      showToast({
        type: 'success',
        title: 'Item deleted',
        message: `${deletingItem.name} has been removed from your pantry.`,
        showUndo: true,
        deletedItem: deletingItem,
        onUndo: () => handleUndoDelete(deletingItem)
      });
      
    } catch (error) {
      console.error('Delete error:', error);
      showToast({
        type: 'error',
        title: 'Failed to delete item',
        message: error.message
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUndoDelete = async (deletedItem) => {
    try {
      // Re-create the item (simulate undo)
      const { id, created_at, ...itemData } = deletedItem;
      const restoredItem = await pantryApi.create(itemData);
      setItems(prev => [...prev, restoredItem]);
      
      showToast({
        type: 'info',
        title: 'Item restored',
        message: `${restoredItem.name} has been restored to your pantry.`
      });
    } catch (error) {
      console.error('Undo error:', error);
      showToast({
        type: 'error',
        title: 'Failed to restore item',
        message: 'Please try adding the item again manually.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-accent-50/20">
      <Header />
      
      <main className="pb-16">
        <PantryList 
          items={items}
          loading={loading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
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