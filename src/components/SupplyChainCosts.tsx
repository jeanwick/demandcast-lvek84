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
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-4">Supply Chain Costs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="transportCost" className="block text-sm font-medium text-gray-700">
            Transport Cost
          </label>
          <input
            type="number"
            id="transportCost"
            value={transportCost}
            onChange={(e) => setTransportCost(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="holdingCost" className="block text-sm font-medium text-gray-700">
            Holding Cost
          </label>
          <input
            type="number"
            id="holdingCost"
            value={holdingCost}
            onChange={(e) => setHoldingCost(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="orderCost" className="block text-sm font-medium text-gray-700">
            Order Cost
          </label>
          <input
            type="number"
            id="orderCost"
            value={orderCost}
            onChange={(e) => setOrderCost(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>
      <button
        onClick={handleCostsChange}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Update Costs
      </button>
    </div>
  );
};

export default SupplyChainCosts;