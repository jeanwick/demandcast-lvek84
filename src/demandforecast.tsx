import React, { useState, useEffect, ChangeEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Inbox, Plus, ChevronRight, DollarSign } from 'lucide-react';
import LeadTimeAnalysis, { SupplierSKUEntry } from './leadtime';

const Input: React.FC<{ label: string; [key: string]: any }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

const Button: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children, ...props }) => (
  <button {...props} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-500">
    {children}
  </button>
);

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Icon className="w-8 h-8 text-blue-500 mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

interface HistoricalData {
  month: string;
  [key: string]: number | string;
}

interface UpdatedSupplierSKUEntry extends SupplierSKUEntry {
  manufacturingTime: number;
  leadTime: number;
}

const DemandForecast: React.FC = () => {
  const [supplierSKUEntries, setSupplierSKUEntries] = useState<UpdatedSupplierSKUEntry[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([
    { month: 'Month 1' },
    { month: 'Month 2' },
    { month: 'Month 3' },
  ]);
  const [forecastPeriods, setForecastPeriods] = useState(3);
  const [sailingTime, setSailingTime] = useState(30);
  const [portDelays, setPortDelays] = useState(5);
  const [forecastData, setForecastData] = useState<HistoricalData[]>([]);

  // Supply Chain Optimization State
  const [annualDemand, setAnnualDemand] = useState(1000);
  const [orderCost, setOrderCost] = useState(50);
  const [holdingCost, setHoldingCost] = useState(2);

  useEffect(() => {
    // Update historical data when supplier/SKU entries change
    setHistoricalData(prevData => {
      return prevData.map(dataPoint => {
        const updatedDataPoint = { ...dataPoint };
        supplierSKUEntries.forEach(entry => {
          if (!(entry.sku in updatedDataPoint)) {
            updatedDataPoint[entry.sku] = 0;
          }
        });
        return updatedDataPoint;
      });
    });
  }, [supplierSKUEntries]);

  const handleAddHistoricalData = () => {
    setHistoricalData([...historicalData, {
      month: `Month ${historicalData.length + 1}`,
      ...Object.fromEntries(supplierSKUEntries.map(entry => [entry.sku, 0]))
    }]);
  };

  const handleUpdateHistoricalData = (index: number, sku: string, value: string) => {
    const newData = [...historicalData];
    newData[index][sku] = parseInt(value) || 0;
    setHistoricalData(newData);
  };

  const handleForecast = () => {
    const newForecastData = historicalData.concat([...Array(forecastPeriods)].map((_, i) => {
      const newDataPoint: HistoricalData = {
        month: `Month ${historicalData.length + i + 1}`,
      };
      supplierSKUEntries.forEach(entry => {
        const lastValue = Number(historicalData[historicalData.length - 1][entry.sku]) || 0;
        newDataPoint[entry.sku] = Math.floor(lastValue * (1 + (Math.random() * 0.2 - 0.1)));
      });
      return newDataPoint;
    }));
    setForecastData(newForecastData);

    // Update annual demand for supply chain optimization
    const totalDemand = newForecastData.reduce((sum, data) => 
      sum + supplierSKUEntries.reduce((skuSum, entry) => skuSum + (Number(data[entry.sku]) || 0), 0)
    , 0);
    setAnnualDemand(Math.floor(totalDemand * (12 / newForecastData.length)));
  };

  const calculateEOQ = (sku: UpdatedSupplierSKUEntry) => {
    const skuDemand = annualDemand * (historicalData.reduce((sum, data) => sum + (Number(data[sku.sku]) || 0), 0) / 
      historicalData.reduce((sum, data) => sum + Object.values(data).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0), 0));
    return Math.sqrt((2 * skuDemand * orderCost) / holdingCost);
  };

  const calculateReorderPoint = (sku: UpdatedSupplierSKUEntry) => {
    const skuDemand = annualDemand * (historicalData.reduce((sum, data) => sum + (Number(data[sku.sku]) || 0), 0) / 
      historicalData.reduce((sum, data) => sum + Object.values(data).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0), 0));
    const dailyDemand = skuDemand / 365;
    const totalLeadTime = (Number(sku.manufacturingTime) || 0) + (Number(sku.leadTime) || 0) + sailingTime + portDelays;
    const zScore = 1.645; // For 95% service level
    return Math.round(dailyDemand * totalLeadTime + zScore * Math.sqrt(totalLeadTime * dailyDemand));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Demand Forecasting & Supply Chain Optimization</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FeatureCard icon={Inbox} title="Supplier & SKU Information">
            <LeadTimeAnalysis
              onEntriesChange={setSupplierSKUEntries as (entries: SupplierSKUEntry[]) => void}
            />
          </FeatureCard>

          <FeatureCard icon={BarChart2} title="Forecast Configuration">
            <Input 
              label="Forecast Periods" 
              type="number" 
              value={forecastPeriods} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForecastPeriods(parseInt(e.target.value) || 3)} 
              placeholder="Number of periods" 
            />
            <Input 
              label="Sailing Time (days)" 
              type="number" 
              value={sailingTime} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSailingTime(parseInt(e.target.value) || 0)} 
              placeholder="Enter sailing time" 
            />
            <Input 
              label="Port Delays (days)" 
              type="number" 
              value={portDelays} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPortDelays(parseInt(e.target.value) || 0)} 
              placeholder="Enter port delays" 
            />
          </FeatureCard>

          <FeatureCard icon={DollarSign} title="Supply Chain Costs">
            <Input 
              label="Order Cost (R)" 
              type="number" 
              value={orderCost} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderCost(Number(e.target.value) || 0)} 
              placeholder="Enter order cost" 
            />
            <Input 
              label="Holding Cost (R per unit per year)" 
              type="number" 
              value={holdingCost} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHoldingCost(Number(e.target.value) || 0)} 
              placeholder="Enter holding cost" 
            />
          </FeatureCard>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Month</th>
                  {supplierSKUEntries.map(entry => (
                    <th key={entry.id} className="px-4 py-2">{entry.sku} Demand</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{data.month}</td>
                    {supplierSKUEntries.map(entry => (
                      <td key={entry.id} className="px-4 py-2">
                        <input
                          type="number"
                          value={Number(data[entry.sku])}
                          onChange={(e) => handleUpdateHistoricalData(index, entry.sku, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={handleAddHistoricalData} className="mt-4">
            <Plus className="w-4 h-4 mr-2" /> Add Month
          </Button>
        </div>

        <div className="text-center mb-8">
          <Button onClick={handleForecast}>
            Generate Forecast & Optimize Supply Chain <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {forecastData.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Forecast Results</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {supplierSKUEntries.map((entry, index) => (
                    <Line 
                      key={entry.id}
                      type="monotone" 
                      dataKey={entry.sku} 
                      stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                      name={entry.sku} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Supply Chain Optimization Results</h2>
            {supplierSKUEntries.map(sku => {
              const updatedSku = sku as UpdatedSupplierSKUEntry;
              return (
                <div key={sku.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{sku.sku}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">Economic Order Quantity (EOQ)</p>
                      <p className="text-2xl font-bold">{calculateEOQ(updatedSku).toFixed(2)} units</p>
                    </div>
                    <div>
                      <p className="font-medium">Reorder Point</p>
                      <p className="text-2xl font-bold">{calculateReorderPoint(updatedSku)} units</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Lead Time</p>
                      <p className="text-2xl font-bold">
                        {(Number(updatedSku.manufacturingTime) || 0) + (Number(updatedSku.leadTime) || 0) + sailingTime + portDelays} days
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="list-disc list-inside space-y-2">
              {supplierSKUEntries.map(sku => {
                const updatedSku = sku as UpdatedSupplierSKUEntry;
                return (
                  <li key={sku.id}>
                    For {sku.sku}: Order {calculateEOQ(updatedSku).toFixed(0)} units when inventory reaches {calculateReorderPoint(updatedSku)} units.
                    Total lead time is {(Number(updatedSku.manufacturingTime) || 0) + (Number(updatedSku.leadTime) || 0) + sailingTime + portDelays} days.
                  </li>
                );
              })}
              <li>Monitor daily demand and adjust reorder points if they deviate significantly from the calculated values.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  </div>
  );
};

export default DemandForecast;