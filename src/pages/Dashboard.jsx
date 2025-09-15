import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import PantryList from '../components/PantryList';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationToast from '../components/NotificationToast';
import { pantryApi, shoppingApi } from '../api/api';

const TABS = [
  { key: 'pantry', label: 'Pantry List' },
  { key: 'shopping', label: 'Shopping List' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pantry');

  // Pantry state
  const [pantryItems, setPantryItems] = useState([]);
  const [pantryLoading, setPantryLoading] = useState(true);

  // Shopping state
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState('');
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

  // ===== Loaders =====
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

  const loadShoppingLists = async () => {
    setShoppingLoading(true);
    try {
      const lists = await shoppingApi.getLists();
      setShoppingLists(lists);
      if (lists.length && !selectedListId) setSelectedListId(lists[0].id);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to load shopping lists',
        message: error.message
      });
    } finally {
      setShoppingLoading(false);
    }
  };

  useEffect(() => {
    loadPantryItems();
    loadShoppingLists();
  }, []);

  // ===== Shopping list handlers =====
  const handleAddList = async () => {
    if (!newListName.trim()) return;
    const list = await shoppingApi.createList(newListName.trim());
    setShoppingLists(prev => [...prev, list]);
    setSelectedListId(list.id);
    setNewListName('');
  };

  const handleDeleteList = async (listId) => {
    await shoppingApi.deleteList(listId);
    const updatedLists = shoppingLists.filter(l => l.id !== listId);
    setShoppingLists(updatedLists);

    // Reset selection
    if (selectedListId === listId) {
      setSelectedListId(updatedLists.length ? updatedLists[0].id : null);
    }
  };

  const handleAddShoppingItem = async (item) => {
    await shoppingApi.addItem(selectedListId, item);
    loadShoppingLists();
  };

  const handleToggleItem = async (itemId, checked) => {
    await shoppingApi.updateItem(selectedListId, itemId, { checked });
    loadShoppingLists();
  };

  const handleDeleteShoppingItem = async (itemId) => {
    await shoppingApi.deleteItem(selectedListId, itemId);
    loadShoppingLists();
  };

  // ===== Pantry form submit handler =====
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        const updatedItem = await pantryApi.update(editingItem.id, formData);
        setPantryItems(pantryItems.map(i => i.id === editingItem.id ? updatedItem : i));
      } else {
        const newItem = await pantryApi.create(formData);
        setPantryItems([...pantryItems, newItem]);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Form error',
        message: error.message
      });
    } finally {
      setFormLoading(false);
    }
  };

  // ===== Pantry delete handler =====
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await pantryApi.delete(deletingItem.id);
      setPantryItems(pantryItems.filter(item => item.id !== deletingItem.id));
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

  // ===== Toast helpers =====
  const showToast = (opts) => setToast({ ...toast, isOpen: true, ...opts });
  const hideToast = () => setToast({ ...toast, isOpen: false });

  // ===== Render =====
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
            onEdit={setEditingItem}
            onDelete={setDeletingItem}
          />
        ) : (
          <div className="max-w-xl mx-auto">
            {/* List Selector + Delete List */}
            <div className="flex items-center gap-2 mb-4">
              <select
                value={selectedListId || ''}
                onChange={e => setSelectedListId(Number(e.target.value))}
                className="px-3 py-2 border rounded"
              >
                {shoppingLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>

              {/* Delete selected list */}
              {selectedListId && (
                <button
                  onClick={() => handleDeleteList(selectedListId)}
                  className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete List
                </button>
              )}
            </div>

            {/* New List input */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="New list name"
                className="px-3 py-2 border rounded flex-1"
              />
              <button
                onClick={handleAddList}
                className="px-4 py-2 bg-primary-500 text-white rounded"
              >
                Add List
              </button>
            </div>

            {/* Items */}
            {shoppingLoading ? (
              <div>Loading...</div>
            ) : (
              <ul className="bg-white rounded shadow p-4">
                {(shoppingLists.find(l => l.id === selectedListId)?.items || []).map(item => (
                  <li key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={e => handleToggleItem(item.id, e.target.checked)}
                      />
                      <span className={item.checked ? 'line-through text-gray-400' : ''}>
                        {item.name} {item.quantity ? `- Qty: ${item.quantity}` : ''}
                      </span>
                    </label>
                    <button
                      onClick={() => handleDeleteShoppingItem(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Floating Add Button */}
            {selectedListId && (
              <button
                onClick={() => setModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40 flex items-center justify-center"
                aria-label="Add shopping item"
              >
                <PlusIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={activeTab === 'shopping' ? handleAddShoppingItem : handleFormSubmit}
        initialData={editingItem}
        loading={formLoading}
        isShopping={activeTab === 'shopping'}
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
