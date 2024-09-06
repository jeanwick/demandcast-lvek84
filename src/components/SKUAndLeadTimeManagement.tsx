import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SKUData {
  skuName: string;
  historicalData: { month: string; value: number }[];
  supplierName: string;
  leadTimeDays: number;
}

interface SKUAndLeadTimeManagementProps {
  onSkuDataChange: (skuData: SKUData[]) => void;
}

const SKUAndLeadTimeManagement: React.FC<SKUAndLeadTimeManagementProps> = ({ onSkuDataChange }) => {
  const [skus, setSkus] = useState<SKUData[]>([]);
  const [newSKUName, setNewSKUName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newLeadTimeDays, setNewLeadTimeDays] = useState(0);
  const [monthCount, setMonthCount] = useState(3);

  // Add a new SKU
  const handleAddSKU = () => {
    const newSKU: SKUData = {
      skuName: newSKUName,
      supplierName: newSupplierName,
      leadTimeDays: newLeadTimeDays,
      historicalData: Array.from({ length: monthCount }, (_, i) => ({
        month: `Month ${i + 1}`,
        value: 0,
      })),
    };
    const updatedSkus = [...skus, newSKU];
    setSkus(updatedSkus);
    onSkuDataChange(updatedSkus);
    setNewSKUName('');
    setNewSupplierName('');
    setNewLeadTimeDays(0);
  };

  // Remove an SKU
  const handleRemoveSKU = (index: number) => {
    const updatedSkus = [...skus];
    updatedSkus.splice(index, 1);
    setSkus(updatedSkus);
    onSkuDataChange(updatedSkus);
  };

  // Update historical data for a specific SKU and month
  const handleHistoricalDataChange = (skuIndex: number, dataIndex: number, value: string) => {
    const updatedSkus = [...skus];
    updatedSkus[skuIndex].historicalData[dataIndex].value = parseInt(value, 10) || 0;
    setSkus(updatedSkus);
    onSkuDataChange(updatedSkus);
  };

  // Add a new month to all SKUs
  const handleAddMonth = () => {
    const newMonthName = `Month ${monthCount + 1}`;
    const updatedSkus = skus.map((sku) => ({
      ...sku,
      historicalData: [...sku.historicalData, { month: newMonthName, value: 0 }],
    }));
    setSkus(updatedSkus);
    onSkuDataChange(updatedSkus);
    setMonthCount(monthCount + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">SKU and Lead Time Management</h2>

      {/* Form to Add SKU */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New SKU</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="SKU Name"
            value={newSKUName}
            onChange={(e) => setNewSKUName(e.target.value)}
            className="form-input px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Supplier Name"
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
            className="form-input px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Lead Time (Days)"
            value={newLeadTimeDays}
            onChange={(e) => setNewLeadTimeDays(Number(e.target.value))}
            className="form-input px-4 py-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleAddSKU}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="inline-block w-4 h-4" /> Add SKU
        </button>
      </div>

      {/* Button to Add More Months */}
      {skus.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleAddMonth}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <Plus className="inline w-4 h-4" /> Add Month
          </button>
        </div>
      )}

      {/* Responsive Table to Display SKUs */}
      {skus.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg" style={{ tableLayout: 'auto' }}>
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="border border-gray-200 px-4 py-2 text-left w-1/5">SKU Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left w-1/5">Supplier Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left w-1/5">Lead Time (Days)</th>
                {Array.from({ length: monthCount }, (_, i) => (
                  <th key={i} className="border border-gray-200 px-4 py-2 text-left w-auto">{`Month ${i + 1}`}</th>
                ))}
                <th className="border border-gray-200 px-4 py-2 w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50 transition-all duration-150">
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap text-gray-700">{sku.skuName}</td>
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap text-gray-700">{sku.supplierName}</td>
                  <td className="border border-gray-200 px-4 py-2">{sku.leadTimeDays}</td>
                  {sku.historicalData.map((data, dataIndex) => (
                    <td key={dataIndex} className="border border-gray-200 px-4 py-2 text-gray-700">
                      <input
                        type="number"
                        value={data.value}
                        onChange={(e) => handleHistoricalDataChange(index, dataIndex, e.target.value)}
                        className="form-input px-2 py-1 border rounded-md"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-200 px-4 py-2">
                    <button
                      onClick={() => handleRemoveSKU(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-150"
                    >
                      <X className="inline w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SKUAndLeadTimeManagement;