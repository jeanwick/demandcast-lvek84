import React, { useState, ChangeEvent } from 'react';
import { X, Plus } from 'lucide-react';  // Ensure Plus is imported along with X

interface SupplierLeadTime {
  supplierName: string;
  leadTimeDays: number;
}

const LeadTimeAnalysis: React.FC = () => {
  const [supplierLeadTimes, setSupplierLeadTimes] = useState<SupplierLeadTime[]>([]);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newLeadTimeDays, setNewLeadTimeDays] = useState('');

  const handleAddLeadTime = () => {
    if (newSupplierName && newLeadTimeDays) {
      const newEntry: SupplierLeadTime = {
        supplierName: newSupplierName,
        leadTimeDays: parseInt(newLeadTimeDays, 10)
      };
      setSupplierLeadTimes(prevTimes => [...prevTimes, newEntry]);
      setNewSupplierName('');
      setNewLeadTimeDays('');
    }
  };

  const handleSupplierNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewSupplierName(event.target.value);
  };

  const handleLeadTimeDaysChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewLeadTimeDays(event.target.value);
  };

  const handleDeleteLeadTime = (index: number) => {
    const updatedLeadTimes = supplierLeadTimes.filter((_, idx) => idx !== index);
    setSupplierLeadTimes(updatedLeadTimes);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Supplier Name"
          value={newSupplierName}
          onChange={handleSupplierNameChange}
          className="form-input px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Lead Time in Days"
          value={newLeadTimeDays}
          onChange={handleLeadTimeDaysChange}
          className="form-input px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAddLeadTime}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />  {/* Adjusted for visual balance */}
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Current Supplier Lead Times</h2>
      <ul>
        {supplierLeadTimes.map((leadTime, index) => (
          <li key={index} className="bg-white shadow rounded-lg p-4 mb-4 flex justify-between items-center">
            {`${leadTime.supplierName}: ${leadTime.leadTimeDays} days`}
            <button 
              onClick={() => handleDeleteLeadTime(index)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadTimeAnalysis;
//build test 