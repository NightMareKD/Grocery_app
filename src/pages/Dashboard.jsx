import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  TagIcon, 
  PlusIcon, 
  UserIcon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import PantryList from '../components/PantryList';
import ItemFormModal from '../components/ItemFormModal';
import { pantryApi, shoppingApi } from '../api/api';
import bgImage from '../images/pexels-reneterp-1358900.jpg';

const TABS = [
  { key: 'pantry', label: 'Pantry Inventory', icon: HomeIcon },
  { key: 'shopping', label: 'Shopping Lists', icon: TagIcon }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
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
  const [userInfoOpen, setUserInfoOpen] = useState(false);

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
    } catch (e) {
      console.error(e);
    } finally {
      setShoppingLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const list = await shoppingApi.createList(newListName.trim());
      setShoppingLists(prev => [...prev, list]);
      setSelectedListId(list.id);
      setNewListName('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddShoppingItem = async (item) => {
    if (!selectedListId) return;
    try {
      await shoppingApi.addItem(selectedListId, item);
      await loadShoppingLists();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedListId) return;
    try {
      await shoppingApi.deleteList(selectedListId);
      setShoppingLists(prev => prev.filter(l => l.id !== selectedListId));
      const remaining = shoppingLists.filter(l => l.id !== selectedListId);
      setSelectedListId(remaining[0]?.id ?? null);
    } catch (e) {
      console.error(e);
    }
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
    } catch (e) {
      console.error(e);
    }
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmitPantry = async (data) => {
  setFormLoading(true);
  try {
    // Map expirationDate to expiry_date
    const itemData = {
      ...data,
      expiry_date: data.expirationDate, // <-- map here
    };
    delete itemData.expirationDate; // Remove the form field

    if (editingItem) {
      const updated = await pantryApi.update(editingItem.id, itemData);
      setPantryItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
    } else {
      const created = await pantryApi.create(itemData);
      setPantryItems(prev => [...prev, created]);
    }
    setModalOpen(false);
    setEditingItem(null);
  } catch (e) {
    console.error(e);
  } finally {
    setFormLoading(false);
  }
};

  const handleDeletePantryItem = async (itemId) => {
    try {
      await pantryApi.delete(itemId);
      setPantryItems(prev => prev.filter(i => i.id !== itemId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const currentList = shoppingLists.find(l => l.id === selectedListId);

  return (
  <div className="relative min-h-screen pb-24">
    {/* Background image, ~30% blur */}
    <div className="fixed inset-0 -z-10">
      <img
        src={bgImage}
        alt=""
        className="h-full w-full object-cover filter blur-[4px]" // ~30% blur
      />
      <div className="absolute inset-0 bg-white/10"></div>
    </div>

    <header className="p-4 shadow bg-slate-600 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setUserInfoOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <UserIcon className="w-6 h-6" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-white hover:text-gray-800"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>

      <nav className="flex gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded flex items-center gap-1 ${
                activeTab === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </nav>
    </header>

    {/* User Info Modal */}
    {userInfoOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User Information</h2>
            <button
              onClick={() => setUserInfoOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {user?.name && (
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            )}
            {user?.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setUserInfoOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    <main className="p-4">
      {activeTab === "pantry" && (
        <div className="max-w-6xl mx-auto">
          <PantryList
            items={pantryItems}
            loading={pantryLoading}
            onEdit={(item) => {
              setEditingItem(item);
              setModalOpen(true);
            }}
            onDelete={(item) => handleDeletePantryItem(item.id)}
          />
        </div>
      )}

      {activeTab === "shopping" && (
        <div className="max-w-xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <select
              value={selectedListId || ""}
              onChange={(e) => setSelectedListId(Number(e.target.value))}
              className="border px-2 py-2 rounded flex-1 min-w-[200px]"
            >
              {shoppingLists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name"
              className="border px-2 py-2 rounded flex-1 min-w-[200px]"
            />
            <button
              onClick={handleAddList}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Add List
            </button>
            <button
              onClick={handleDeleteList}
              disabled={!selectedListId}
              className="px-3 py-2 rounded border border-red-300 text-red-600 disabled:opacity-50"
            >
              Delete List
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              disabled={!selectedListId}
              className="px-3 py-2 rounded border border-slate-300 disabled:opacity-50"
            >
              Add Item
            </button>
          </div>
          {shoppingLoading ? (
            <div>Loading...</div>
          ) : !currentList ? (
            <div>No lists yet.</div>
          ) : (
            <ul className="bg-white rounded shadow divide-y">
              {currentList.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!item.checked}
                      onChange={(e) =>
                        handleToggleItem(item.id, e.target.checked)
                      }
                    />
                    <span
                      className={
                        item.checked ? "line-through text-gray-400" : ""
                      }
                    >
                      {item.name}
                      {item.quantity ? ` (x${item.quantity})` : ""}
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
      onClick={() => {
        setEditingItem(null);
        setModalOpen(true);
      }}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow"
    >
      <PlusIcon className="w-6 h-6" />
    </button>

    <ItemFormModal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen(false);
        setEditingItem(null);
      }}
      onSubmit={
        activeTab === "shopping" ? handleAddShoppingItem : handleFormSubmitPantry
      }
      initialData={editingItem}
      loading={formLoading}
      isShopping={activeTab === "shopping"}
    />
  </div>
);
}