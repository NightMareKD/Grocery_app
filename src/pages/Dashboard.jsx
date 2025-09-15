import React, { useState, useEffect } from 'react';
import { HomeIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import PantryList from '../components/PantryList';
import ItemFormModal from '../components/ItemFormModal';
import { pantryApi, shoppingApi } from '../api/api'; // adjust if different

const TABS = [
  { key: 'pantry', label: 'Pantry Inventory', icon: HomeIcon },
  { key: 'shopping', label: 'Shopping Lists', icon: TagIcon }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pantry');

  // Pantry
  const [pantryItems, setPantryItems] = useState([]);
  const [pantryLoading, setPantryLoading] = useState(true);

  // Shopping
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [shoppingLoading, setShoppingLoading] = useState(true);

  // UI
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadPantryItems();
    loadShoppingLists();
  }, []);

  const loadPantryItems = async () => {
    setPantryLoading(true);
    try {
      const data = await pantryApi.getAll();
      setPantryItems(data);
    } catch (e) {
      console.error(e);
    } finally { setPantryLoading(false); }
  };

  const loadShoppingLists = async () => {
    setShoppingLoading(true);
    try {
      const lists = await shoppingApi.getLists();
      setShoppingLists(lists);
      if (lists.length && !selectedListId) setSelectedListId(lists[0].id);
    } catch (e) {
      console.error(e);
    } finally { setShoppingLoading(false); }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const list = await shoppingApi.createList(newListName.trim());
      setShoppingLists(prev => [...prev, list]);
      setSelectedListId(list.id);
      setNewListName('');
    } catch (e) { console.error(e); }
  };

  const handleAddShoppingItem = async (item) => {
    if (!selectedListId) return;
    try {
      await shoppingApi.addItem(selectedListId, item);
      await loadShoppingLists();
    } catch (e) { console.error(e); }
  };

  const handleToggleItem = async (itemId, checked) => {
    try {
      await shoppingApi.updateItem(selectedListId, itemId, { checked });
      setShoppingLists(prev =>
        prev.map(l =>
          l.id === selectedListId
            ? { ...l, items: l.items.map(it => it.id === itemId ? { ...it, checked } : it) }
            : l
        )
      );
    } catch (e) { console.error(e); }
  };

  const handleDeleteShoppingItem = async (itemId) => {
    try {
      await shoppingApi.deleteItem(selectedListId, itemId);
      setShoppingLists(prev =>
        prev.map(l =>
          l.id === selectedListId
            ? { ...l, items: l.items.filter(it => it.id !== itemId) }
            : l
        )
      );
    } catch (e) { console.error(e); }
  };

  const handleFormSubmitPantry = async (data) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        const updated = await pantryApi.update(editingItem.id, data);
        setPantryItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const created = await pantryApi.create(data);
        setPantryItems(prev => [...prev, created]);
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (e) { console.error(e); }
    finally { setFormLoading(false); }
  };

  const currentList = shoppingLists.find(l => l.id === selectedListId);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="p-4 shadow bg-white flex justify-between">
        <h1 className="font-semibold">Welcome {user?.name || user?.email}</h1>
        <nav className="flex gap-2">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
              >
                <Icon className="w-4 h-4 inline-block mr-1" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="p-4">
        {activeTab === 'pantry' && (
          <div className="max-w-2xl mx-auto">
            <PantryList
              items={pantryItems}
              loading={pantryLoading}
              onEdit={(item)=>{ setEditingItem(item); setModalOpen(true); }}
              onDelete={(item)=>{ /* implement delete pantry item if needed */}}
            />
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="max-w-xl mx-auto">
            <div className="flex gap-2 mb-4">
              <select
                value={selectedListId || ''}
                onChange={e => setSelectedListId(Number(e.target.value))}
                className="border px-2 py-2 rounded flex-1"
              >
                {shoppingLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <input
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="New list name"
                className="border px-2 py-2 rounded flex-1"
              />
              <button onClick={handleAddList} className="bg-blue-600 text-white px-3 py-2 rounded">
                Add
              </button>
            </div>
            {shoppingLoading ? (
              <div>Loading...</div>
            ) : !currentList ? (
              <div>No lists yet.</div>
            ) : (
              <ul className="bg-white rounded shadow divide-y">
                {currentList.items.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!item.checked}
                        onChange={e => handleToggleItem(item.id, e.target.checked)}
                      />
                      <span className={item.checked ? 'line-through text-gray-400' : ''}>
                        {item.name}{item.quantity ? ` (x${item.quantity})` : ''}
                      </span>
                    </label>
                    <button
                      onClick={() => handleDeleteShoppingItem(item.id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
                {currentList.items.length === 0 && (
                  <li className="p-3 text-gray-400 text-sm">No items yet.</li>
                )}
              </ul>
            )}
          </div>
        )}
      </main>

      <button
        onClick={() => { setEditingItem(null); setModalOpen(true); }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null); }}
        onSubmit={activeTab === 'shopping' ? handleAddShoppingItem : handleFormSubmitPantry}
        initialData={editingItem}
        loading={formLoading}
        isShopping={activeTab === 'shopping'}
      />
    </div>
  );
}