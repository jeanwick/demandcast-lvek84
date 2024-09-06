import React, { useState } from 'react';
import ForecastConfiguration from './components/ForecastConfiguration';
import SKUAndLeadTimeManagement from './components/SKUAndLeadTimeManagement';
import SupplyChainCosts from './components/SupplyChainCosts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DemandForecast: React.FC = () => {
  const [forecastConfig, setForecastConfig] = useState({
    sailingTime: 30,
    portDelays: 5,
    forecastPeriods: 6, // Adjust the number of forecast periods based on configuration
  });

  const [skuData, setSkuData] = useState<any[]>([]);  // SKU data will be an array of objects for each SKU
  const [supplyChainCosts, setSupplyChainCosts] = useState({
    transportCost: 1000,
    holdingCost: 500,
    orderCost: 200,
  });

  const [forecastData, setForecastData] = useState<any[]>([]);

  // Handle generating the forecast with Exponential Smoothing
  const handleForecast = () => {
    const totalTime = forecastConfig.sailingTime + forecastConfig.portDelays;
    const forecastPeriods = forecastConfig.forecastPeriods;  // Get forecast periods from configuration

    const alpha = 0.2; // Smoothing factor for Exponential Smoothing (between 0 and 1)

    // Log SKU data to inspect the structure
    console.log('SKU Data:', skuData);

    // Initialize an array of months, including future forecast periods
    const months = Array.from({ length: forecastPeriods }, (_, index) => `Month ${index + 1}`);

    // Create forecast data structure where each object represents a month and contains the demand for each SKU
    const newForecastData = months.map((month, monthIndex) => {
      const monthData: { month: string; [skuName: string]: number } = { month };

      // For each SKU, add its demand for the current month
      skuData.forEach((sku) => {
        if (sku.skuName && sku.historicalData) {
          if (sku.historicalData[monthIndex]) {
            // Use user-entered demand for this SKU and month if available
            monthData[sku.skuName] = sku.historicalData[monthIndex].value;
          } else {
            // Exponential smoothing logic for forecasting future periods
            const historicalData = sku.historicalData.map((data) => data.value);

            // Initialize the first smoothed value using the first historical value
            let smoothedValue = historicalData[0];
            for (let i = 1; i < historicalData.length; i++) {
              smoothedValue = alpha * historicalData[i] + (1 - alpha) * smoothedValue;
            }

            // Forecast the future period by using the last smoothed value
            smoothedValue = alpha * historicalData[historicalData.length - 1] + (1 - alpha) * smoothedValue;

            monthData[sku.skuName] = smoothedValue;
          }
        } else {
          console.warn('SKU without a name or demand data found:', sku);
        }
      });

      return monthData;
    });

    setForecastData(newForecastData); // Update the state with the new forecast data
    console.log('Generated Forecast Data:', newForecastData); // Log the forecast data for debugging
  };

  // Function to calculate Economic Order Quantity (EOQ), Reorder Point, and Total Lead Time
  const calculateOptimizationResults = () => {
    const results = skuData.map((sku) => {
      const demandRate = sku.historicalData.reduce((total, entry) => total + entry.value, 0) / sku.historicalData.length; // Average demand rate
      const orderingCost = supplyChainCosts.orderCost;
      const holdingCost = supplyChainCosts.holdingCost;

      // EOQ calculation
      const EOQ = Math.sqrt((2 * demandRate * orderingCost) / holdingCost);

      // Reorder Point
      const dailyDemandRate = demandRate / 30;  // Assuming 30 days per month
      const totalLeadTime = forecastConfig.sailingTime + forecastConfig.portDelays + sku.leadTimeDays;
      const reorderPoint = dailyDemandRate * totalLeadTime;

      return {
        skuName: sku.skuName,
        EOQ,
        reorderPoint,
        totalLeadTime,
      };
    });

    return results;
  };

  const optimizationResults = calculateOptimizationResults(); // Get optimization results

  // Function to generate recommendations based on optimization results
  const generateRecommendations = () => {
    return optimizationResults.map((result) => {
      let recommendation = '';

      // Stocking strategy based on EOQ
      if (result.EOQ > result.reorderPoint) {
        recommendation += `Consider placing larger orders to reduce the number of order cycles. `;
      } else {
        recommendation += `Consider placing smaller, more frequent orders to minimize holding costs. `;
      }

      // Reorder timing
      if (result.reorderPoint > 0) {
        recommendation += `Ensure orders are placed before stock reaches the Reorder Point to avoid stockouts. `;
      }

      // Lead time optimization
      if (result.totalLeadTime > 30) {
        recommendation += `Review supplier lead times and consider working with suppliers to reduce delays. `;
      }

      return {
        skuName: result.skuName,
        recommendation,
      };
    });
  };

  const recommendations = generateRecommendations(); // Get recommendations

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Demand Forecasting & Supply Chain Optimization
        </h1>

        {/* SKU and Lead Time Management */}
        <SKUAndLeadTimeManagement onSkuDataChange={setSkuData} />

        {/* Forecast Configuration Section */}
        <ForecastConfiguration onConfigChange={setForecastConfig} />

        {/* Supply Chain Costs */}
        <SupplyChainCosts onCostsChange={setSupplyChainCosts} />

        {/* Generate Forecast Button */}
        <div className="mb-4">
          <button
            onClick={handleForecast}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Forecast
          </button>
        </div>

        {/* Forecasted Demand Graph */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Forecasted Demand per SKU</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Generate a Line for each SKU */}
              {forecastData.length > 0 &&
                Object.keys(forecastData[0])
                  .filter(key => key !== 'month')
                  .map((skuName, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={skuName}  // The SKU name as the data key for each Line
                      name={skuName}  // Display the SKU name in the legend
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}  // Random color for each line
                      dot={false}
                    />
                  ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Supply Chain Optimization Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Supply Chain Optimization Results</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr

>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {optimizationResults.map((result) => (
                <tr key={result.skuName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.skuName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.EOQ.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.reorderPoint.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.totalLeadTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
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