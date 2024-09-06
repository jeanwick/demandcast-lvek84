import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface SupplierSKUEntry {
  id: number;
  supplier: string;
  sku: string;
  manufacturingTime: number;
  leadTime: number;
}

interface Props {
  onEntriesChange: (entries: SupplierSKUEntry[]) => void;
}

const LeadTimeAnalysis: React.FC<Props> = ({ onEntriesChange }) => {
  const [entries, setEntries] = useState<SupplierSKUEntry[]>([
    { id: 1, supplier: '', sku: '', manufacturingTime: 0, leadTime: 0 }
  ]);

  useEffect(() => {
    onEntriesChange(entries);
  }, [entries, onEntriesChange]);

  const handleAddEntry = () => {
    const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
    setEntries([...entries, { id: newId, supplier: '', sku: '', manufacturingTime: 0, leadTime: 0 }]);
  };

  const handleRemoveEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleInputChange = (id: number, field: keyof SupplierSKUEntry, value: string | number) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, [field]: field === 'supplier' || field === 'sku' ? value : Number(value) } : entry
    ));
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <input
                type="text"
                value={entry.supplier}
                onChange={(e) => handleInputChange(entry.id, 'supplier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={entry.sku}
                onChange={(e) => handleInputChange(entry.id, 'sku', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Time (days)</label>
              <input
                type="number"
                value={entry.manufacturingTime}
                onChange={(e) => handleInputChange(entry.id, 'manufacturingTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter manufacturing time"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
              <input
                type="number"
                value={entry.leadTime}
                onChange={(e) => handleInputChange(entry.id, 'leadTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter lead time"
              />
            </div>
          </div>
          {entries.length > 1 && (
            <button
              onClick={() => handleRemoveEntry(entry.id)}
              className="mt-2 text-red-600 hover:text-red-800 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Remove
            </button>
          )}
        </div>
      ))}
      <button
        onClick={handleAddEntry}
        className="mt-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Supplier/SKU
      </button>
    </div>
  );
};

export default LeadTimeAnalysis;