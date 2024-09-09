import React, { useState } from 'react';
import ForecastConfiguration from './components/ForecastConfiguration';
import SKUAndLeadTimeManagement from './components/SKUAndLeadTimeManagement';
import SupplyChainCosts from './components/SupplyChainCosts';
import EOQCalculator from './components/EOQCalculator'; // Import the EOQ calculator
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastData {
  month: string;
  [skuName: string]: number | string;
}

interface Recommendation {
  skuName: string;
  recommendation: string;
}

const DemandForecast: React.FC = () => {
  const [forecastConfig, setForecastConfig] = useState({
    sailingTime: 30,
    portDelays: 0,
    forecastPeriods: 6,
  });

  const [skuData, setSkuData] = useState<any[]>([]);
  const [supplyChainCosts, setSupplyChainCosts] = useState({
    transportCost: 1000,
    holdingCost: 500,
    orderCost: 200,
  });

  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);

  const handleForecast = () => {
    const forecastPeriods = forecastConfig.forecastPeriods;
    const alpha = 0.2;
    const months = Array.from({ length: forecastPeriods }, (_, index) => `Month ${index + 1}`);

    const newForecastData: ForecastData[] = months.map((month, monthIndex) => {
      const monthData: ForecastData = { month };

      skuData.forEach((sku: any) => {
        if (sku.skuName && sku.historicalData) {
          if (sku.historicalData[monthIndex]) {
            monthData[sku.skuName] = sku.historicalData[monthIndex].value;
          } else {
            const historicalData = sku.historicalData.map((data: { value: number }) => data.value);
            let smoothedValue = historicalData[0];
            for (let i = 1; i < historicalData.length; i++) {
              smoothedValue = alpha * historicalData[i] + (1 - alpha) * smoothedValue;
            }
            smoothedValue = alpha * historicalData[historicalData.length - 1] + (1 - alpha) * smoothedValue;
            monthData[sku.skuName] = smoothedValue;
          }
        }
      });

      return monthData;
    });

    setForecastData(newForecastData);
  };

  const generateRecommendations = (optimizationResults: any[]): Recommendation[] => {
    return optimizationResults.map((result) => {
      let recommendation = '';

      if (result.EOQ > result.reorderPoint) {
        recommendation += `Consider placing larger orders to reduce the number of order cycles. `;
      } else {
        recommendation += `Consider placing smaller, more frequent orders to minimize holding costs. `;
      }

      if (result.reorderPoint > 0) {
        recommendation += `Ensure orders are placed before stock reaches the Reorder Point to avoid stockouts. `;
      }

      if (result.totalLeadTime > 30) {
        recommendation += `Review supplier lead times and consider working with suppliers to reduce delays. `;
      }

      return {
        skuName: result.skuName,
        recommendation,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Demand Forecasting & Supply Chain Optimization
        </h1>

        <SKUAndLeadTimeManagement onSkuDataChange={setSkuData} />
        <ForecastConfiguration onConfigChange={setForecastConfig} />
        <SupplyChainCosts onCostsChange={setSupplyChainCosts} />

        {/* EOQ Calculator */}
        <EOQCalculator
          skuData={skuData}
          supplyChainCosts={supplyChainCosts}
          forecastConfig={forecastConfig}
          onOptimizationResults={(results) => {
            setOptimizationResults(results);
            setRecommendations(generateRecommendations(results)); // Generate recommendations
          }}
        />

        <div className="mb-4">
          <button
            onClick={handleForecast}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Forecast
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Forecasted Demand per SKU</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {forecastData.length > 0 &&
                Object.keys(forecastData[0])
                  .filter(key => key !== 'month')
                  .map((skuName, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={skuName}
                      name={skuName}
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                      dot={false}
                    />
                  ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EOQ Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
  <h2 className="text-xl font-semibold mb-4">Supply Chain Optimization Results</h2>
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          SKU
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          EOQ
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Reorder Point
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Lead Time
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Minimum Stock Holding
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {optimizationResults.map((result) => (
        <tr key={result.skuName}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.skuName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.EOQ.toFixed(2)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.reorderPoint.toFixed(2)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.totalLeadTime}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.minStockHolding.toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Display Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <ul className="list-disc pl-6">
            {recommendations.map((rec) => (
              <li key={rec.skuName}>
                <strong>{rec.skuName}:</strong> {rec.recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast;