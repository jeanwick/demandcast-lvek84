import React, { useState } from 'react';

interface SupplyChainCostsProps {
  onCostsChange: (costs: { transportCost: number; holdingCost: number; orderCost: number }) => void;
}

const SupplyChainCosts: React.FC<SupplyChainCostsProps> = ({ onCostsChange }) => {
  const [transportCost, setTransportCost] = useState(1000);
  const [holdingCost, setHoldingCost] = useState(500);
  const [orderCost, setOrderCost] = useState(200);

  const handleCostsChange = () => {
    onCostsChange({ transportCost, holdingCost, orderCost });
  };

  return (
    <div className="mb-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Supply Chain Costs (ZAR)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="transportCost" className="block text-sm font-medium text-gray-700">
              Transport Cost (R)
            </label>
            <input
              type="number"
              id="transportCost"
              value={transportCost}
              onChange={(e) => setTransportCost(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="holdingCost" className="block text-sm font-medium text-gray-700">
              Holding Cost (R)
            </label>
            <input
              type="number"
              id="holdingCost"
              value={holdingCost}
              onChange={(e) => setHoldingCost(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="orderCost" className="block text-sm font-medium text-gray-700">
              Order Cost (R)
            </label>
            <input
              type="number"
              id="orderCost"
              value={orderCost}
              onChange={(e) => setOrderCost(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleCostsChange}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update Costs
        </button>
      </div>
    </div>
  );
};

export default SupplyChainCosts;