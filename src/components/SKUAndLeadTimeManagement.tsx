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
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">SKU and Lead Time Management</h2>

        {/* Form to Add SKU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="skuName" className="block text-sm font-medium text-gray-700">
              SKU Name
            </label>
            <input
              type="text"
              id="skuName"
              placeholder="SKU Name"
              value={newSKUName}
              onChange={(e) => setNewSKUName(e.target.value)}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              id="supplierName"
              placeholder="Supplier Name"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="leadTimeDays" className="block text-sm font-medium text-gray-700">
              Lead Time (Days)
            </label>
            <input
              type="number"
              id="leadTimeDays"
              placeholder="Lead Time (Days)"
              value={newLeadTimeDays}
              onChange={(e) => setNewLeadTimeDays(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddSKU}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus className="inline-block w-4 h-4 mr-2" /> Add SKU
        </button>

        {/* Button to Add More Months */}
        {skus.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleAddMonth}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <Plus className="inline w-4 h-4 mr-2" /> Add Month
            </button>
          </div>
        )}

        {/* Responsive Table to Display SKUs */}
        {skus.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">SKU Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Supplier Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Lead Time (Days)</th>
                  {Array.from({ length: monthCount }, (_, i) => (
                    <th key={i} className="border border-gray-300 px-4 py-2 text-left">{`Month ${i + 1}`}</th>
                  ))}
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-50 transition-all duration-150">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{sku.skuName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{sku.supplierName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{sku.leadTimeDays}</td>
                    {sku.historicalData.map((data, dataIndex) => (
                      <td key={dataIndex} className="border border-gray-300 px-4 py-2 text-gray-700">
                        <input
                          type="number"
                          value={data.value}
                          onChange={(e) => handleHistoricalDataChange(index, dataIndex, e.target.value)}
                          className="form-input px-2 py-1 border rounded-md w-full"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2 text-red-600 text-center">
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
    </div>
  );
};

export default SKUAndLeadTimeManagement;