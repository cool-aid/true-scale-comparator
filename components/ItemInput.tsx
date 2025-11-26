import React, { useState } from 'react';
import { ComparisonItem } from '../types';

interface ItemInputProps {
  items: ComparisonItem[];
  setItems: React.Dispatch<React.SetStateAction<ComparisonItem[]>>;
  disabled: boolean;
}

const ItemInput: React.FC<ItemInputProps> = ({ items, setItems, disabled }) => {
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ComparisonItem = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      sizeOverride: newSize.trim() || undefined,
    };

    setItems([...items, newItem]);
    setNewName('');
    setNewSize('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Comparison Items
        </h2>
        
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-grow">
            <label htmlFor="itemName" className="block text-xs font-medium text-slate-500 mb-1">Item Name (e.g., "Blue Whale")</label>
            <input
              id="itemName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter item name..."
              disabled={disabled}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="sm:w-1/3">
            <label htmlFor="itemSize" className="block text-xs font-medium text-slate-500 mb-1">Size (Optional)</label>
            <input
              id="itemSize"
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="e.g. 30 meters long"
              disabled={disabled}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={disabled || !newName.trim()}
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {items.length === 0 && (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
              <p>No items added yet.</p>
              <p className="text-sm">Add at least two items to compare.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-indigo-200 transition-colors">
              <div>
                <span className="font-medium text-slate-800">{item.name}</span>
                {item.sizeOverride ? (
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {item.sizeOverride}
                  </span>
                ) : (
                  <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    Auto-Size
                  </span>
                )}
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={disabled}
                className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemInput;