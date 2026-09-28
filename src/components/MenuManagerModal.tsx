import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { MenuItem, ItemCategory } from '../types';
import { formatCurrency } from '../utils/format';
import {
  Utensils,
  Plus,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sliders,
  DollarSign,
  Store,
  Save,
} from 'lucide-react';

export const MenuManagerModal: React.FC = () => {
  const {
    menuItems,
    toggleItemAvailability,
    updateMenuItem,
    addMenuItem,
    resetMenuToDefault,
    settings,
    updateSettings,
  } = useBilling();

  const [activeSubTab, setActiveSubTab] = useState<'items' | 'settings'>('items');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // New Item State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('burgers');
  const [newItemPrice, setNewItemPrice] = useState('7.99');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(false);
  const [newItemSpicy, setNewItemSpicy] = useState(false);

  // Settings State
  const [formSettings, setFormSettings] = useState(settings);

  const handleStartPriceEdit = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setTempPrice(item.price.toFixed(2));
  };

  const handleSavePriceEdit = (item: MenuItem) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      updateMenuItem({ ...item, price: val });
    }
    setEditingPriceId(null);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MenuItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 5.0,
      description: newItemDesc.trim() || 'Freshly made cafe specialty',
      isVeg: newItemVeg,
      isSpicy: newItemSpicy,
      isAvailable: true,
    };

    addMenuItem(newItem);
    setIsAddingNew(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    alert('Cafe Settings & Receipt details saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-lg font-bold text-white">Menu & Store Management</h1>
          <p className="text-xs text-neutral-400">
            Control item availability, update prices, add new items and configure receipt details
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveSubTab('items')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeSubTab === 'items'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Menu Items ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeSubTab === 'settings'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Store & Receipt Config
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'items' && (
        <div className="space-y-4">
          {/* Top Actions: Add New Item & Reset */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isAddingNew ? 'Close Form' : 'Add New Item'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset menu items to factory defaults?')) {
                  resetMenuToDefault();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Menu Defaults</span>
            </button>
          </div>

          {/* Add New Item Expandable Form */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateItem}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 animate-in fade-in"
            >
              <h3 className="text-sm font-bold text-white">Create New Cafe Menu Item</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Crispy Jalapeno Broasted Wrap"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 capitalize cursor-pointer"
                  >
                    <option value="burgers">Burgers</option>
                    <option value="broasted">Broasted Chicken</option>
                    <option value="tea">Tea & Chai</option>
                    <option value="juices">Fresh Juices</option>
                    <option value="sides">Sides & Fries</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Price ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="e.g. Hand-rolled soft tortilla, spicy broasted fillet, garlic toum"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={newItemVeg}
                    onChange={(e) => setNewItemVeg(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={newItemSpicy}
                    onChange={(e) => setNewItemSpicy(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500"
                  />
                  <span>Spicy</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs"
                >
                  Save Item to Menu
                </button>
              </div>
            </form>
          )}

          {/* Items Stock & Price Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-center">Stock Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {menuItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-850/50 transition-colors text-neutral-300"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-neutral-500 truncate max-w-sm">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-neutral-400">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        {editingPriceId === item.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-neutral-500">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              step="0.01"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-16 bg-neutral-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePriceEdit(item)}
                              className="p-1 rounded bg-amber-500 text-neutral-950 hover:bg-amber-400"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 rounded text-neutral-500 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span>{formatCurrency(item.price, settings.currencySymbol)}</span>
                            <button
                              onClick={() => handleStartPriceEdit(item)}
                              className="opacity-40 hover:opacity-100 text-neutral-400 hover:text-amber-400 p-0.5"
                              title="Edit Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                            item.isAvailable
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            item.isAvailable
                              ? 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 border border-neutral-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {item.isAvailable ? 'Mark Sold Out' : 'Restore In Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STORE & RECEIPT SETTINGS TAB */}
      {activeSubTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-5 max-w-2xl"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-400" />
            <span>Cafe Branding & Thermal Printer Setup</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Cafe Name</label>
              <input
                type="text"
                value={formSettings.cafeName}
                onChange={(e) => setFormSettings({ ...formSettings, cafeName: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Store Phone</label>
              <input
                type="text"
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">Address / Location</label>
            <input
              type="text"
              value={formSettings.address}
              onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Tax / GST (%)</label>
              <input
                type="number"
                step="0.1"
                value={formSettings.taxPercent}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    taxPercent: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Currency Symbol</label>
              <input
                type="text"
                value={formSettings.currencySymbol}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, currencySymbol: e.target.value })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">UPI ID for QR</label>
              <input
                type="text"
                value={formSettings.upiId}
                onChange={(e) => setFormSettings({ ...formSettings, upiId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">
              Receipt Footer Thank You Message
            </label>
            <input
              type="text"
              value={formSettings.receiptFooterMessage}
              onChange={(e) =>
                setFormSettings({ ...formSettings, receiptFooterMessage: e.target.value })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
