import React, { useState, ChangeEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Inbox, Plus, ChevronRight, DollarSign} from 'lucide-react';
import LeadTimeAnalysis from './leadtime';

const Input = ({ label, ...props }: { label: string, [key: string]: any }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

const Button = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <button {...props} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-500">
    {children}
  </button>
);

const FeatureCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Icon className="w-8 h-8 text-blue-500 mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const DemandForecastApp = () => {
  // Demand Forecast State
  const [sku1Name, setSku1Name] = useState('SKU 01');
  const [sku2Name, setSku2Name] = useState('SKU 02');
  const [historicalData, setHistoricalData] = useState([
    { month: 'Month 1', sku1: 100, sku2: 150 },
    { month: 'Month 2', sku1: 120, sku2: 160 },
    { month: 'Month 3', sku1: 110, sku2: 155 },
  ]);
  const [forecastPeriods, setForecastPeriods] = useState(3);
  const [sailingTime, setSailingTime] = useState(30);
  const [portDelays, setPortDelays] = useState(5);
  const [forecastData, setForecastData] = useState<any[]>([]);

  // Supply Chain Optimization State
  const [annualDemand, setAnnualDemand] = useState(1000);
  const [orderCost, setOrderCost] = useState(50);
  const [holdingCost, setHoldingCost] = useState(2);
  const [leadTime, setLeadTime] = useState(14);

  const handleAddHistoricalData = () => {
    setHistoricalData([...historicalData, {
      month: `Month ${historicalData.length + 1}`,
      sku1: 0,
      sku2: 0
    }]);
  };

  const handleUpdateHistoricalData = (index: number, sku: 'sku1' | 'sku2', value: string) => {
    const newData = [...historicalData];
    newData[index][sku] = parseInt(value) || 0;
    setHistoricalData(newData);
  };

  const handleForecast = () => {
    const newForecastData = historicalData.concat([...Array(forecastPeriods)].map((_, i) => ({
      month: `Month ${historicalData.length + i + 1}`,
      sku1: Math.floor((historicalData[i % historicalData.length].sku1 * 1.05) + (Math.random() * 50 - 25)),
      sku2: Math.floor((historicalData[i % historicalData.length].sku2 * 1.03) + (Math.random() * 40 - 20)),
    })));
    setForecastData(newForecastData);

    // Update annual demand for supply chain optimization
    const totalDemand = newForecastData.reduce((sum, data) => sum + data.sku1 + data.sku2, 0);
    setAnnualDemand(Math.floor(totalDemand * (12 / newForecastData.length)));
    setLeadTime(sailingTime + portDelays);
  };

  const calculateEOQ = () => {
    return Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
  };

  const calculateReorderPoint = () => {
    const dailyDemand = annualDemand / 365;
    const zScore = 1.645; // For 95% service level
    return Math.round(dailyDemand * leadTime + zScore * Math.sqrt(leadTime * dailyDemand));
  };

  const eoq = calculateEOQ();
  const reorderPoint = calculateReorderPoint();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Demand Forecasting & Supply Chain Optimization</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FeatureCard icon={Plus} title="Lead Time Analysis">
            <LeadTimeAnalysis />
          </FeatureCard>

          <FeatureCard icon={Inbox} title="SKU Information">
            <Input label="SKU 1 Name" value={sku1Name} onChange={(e: ChangeEvent<HTMLInputElement>) => setSku1Name(e.target.value)} placeholder="Enter SKU 1 name" />
            <Input label="SKU 2 Name" value={sku2Name} onChange={(e: ChangeEvent<HTMLInputElement>) => setSku2Name(e.target.value)} placeholder="Enter SKU 2 name" />
          </FeatureCard>

          <FeatureCard icon={BarChart2} title="Forecast Configuration">
            <Input label="Forecast Periods" type="number" value={forecastPeriods} onChange={(e: ChangeEvent<HTMLInputElement>) => setForecastPeriods(parseInt(e.target.value))} placeholder="Number of periods" />
            <Input label="Sailing Time (days)" type="number" value={sailingTime} onChange={(e: ChangeEvent<HTMLInputElement>) => setSailingTime(parseInt(e.target.value))} placeholder="Enter sailing time" />
            <Input label="Port Delays (days)" type="number" value={portDelays} onChange={(e: ChangeEvent<HTMLInputElement>) => setPortDelays(parseInt(e.target.value))} placeholder="Enter port delays" />
          </FeatureCard>

          <FeatureCard icon={DollarSign} title="Supply Chain Costs">
            <Input label="Order Cost (R)" type="number" value={orderCost} onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderCost(Number(e.target.value))} placeholder="Enter order cost" />
            <Input label="Holding Cost (R per unit per year)" type="number" value={holdingCost} onChange={(e: ChangeEvent<HTMLInputElement>) => setHoldingCost(Number(e.target.value))} placeholder="Enter holding cost" />
          </FeatureCard>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">{sku1Name} Demand</th>
                  <th className="px-4 py-2">{sku2Name} Demand</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{data.month}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={data.sku1}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateHistoricalData(index, 'sku1', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={data.sku2}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateHistoricalData(index, 'sku2', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
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
                  <Line type="monotone" dataKey="sku1" stroke="#8884d8" name={sku1Name} />
                  <Line type="monotone" dataKey="sku2" stroke="#82ca9d" name={sku2Name} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Supply Chain Optimization Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Economic Order Quantity (EOQ)</p>
                  <p className="text-2xl font-bold">{eoq.toFixed(2)} units</p>
                </div>
                <div>
                  <p className="font-medium">Reorder Point</p>
                  <p className="text-2xl font-bold">{reorderPoint} units</p>
                </div>
                <div>
                  <p className="font-medium">Total Lead Time</p>
                  <p className="text-2xl font-bold">{leadTime} days</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Order {eoq.toFixed(0)} units when inventory reaches {reorderPoint} units.</li>
                <li>Total lead time (sailing + port delays) is {leadTime} days. Plan accordingly.</li>
                <li>Monitor daily demand and adjust reorder point if it deviates significantly from {(annualDemand / 365).toFixed(2)} units.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DemandForecastApp;