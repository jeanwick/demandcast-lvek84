import React, { useState, useEffect, useCallback } from 'react';
import ForecastConfiguration from './components/ForecastConfiguration';
import SKUAndLeadTimeManagement from './components/SKUAndLeadTimeManagement';
import SupplyChainCosts from './components/SupplyChainCosts';
import EOQCalculator from './components/EOQCalculator';
import EnsembleForecast from './components/EnsembleForecast'; // Updated to use EnsembleForecast
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ExcelUpload from './components/ExcelUpload';
import AuthenticatedNavigationBar from './authnav';  // Import the new authenticated nav bar

interface ForecastData {
  month: string;
  [skuName: string]: number | string | null;
}

interface Recommendation {
  skuName: string;
  recommendation: string;
}

interface ForecastConfig {
  sailingTime: number;
  portDelays: number;
  forecastPeriods: number;
}

interface SKUData {
  skuName: string;
  historicalData: { value: number }[];
  leadTimeDays: number;
}

interface SupplyChainCosts {
  transportCost: number;
  holdingCost: number;
  orderCost: number;
}

interface CrossValidationResult {
  skuName: string;
  averageError: number;
  errors: number[];
}

interface OptimizationResult {
  skuName: string;
  EOQ: number;
  reorderPoint: number;
  totalLeadTime: number;
  totalCost: number;
  minStockHolding: number;
}

const DemandForecast: React.FC = () => {
  const [forecastConfig, setForecastConfig] = useState<ForecastConfig>({
    sailingTime: 30,
    portDelays: 0,
    forecastPeriods: 6,
  });

  const [skuData, setSkuData] = useState<SKUData[]>([]);
  const [supplyChainCosts, setSupplyChainCosts] = useState<SupplyChainCosts>({
    transportCost: 1000,
    holdingCost: 500,
    orderCost: 200,
  });

  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [crossValidationResults, setCrossValidationResults] = useState<CrossValidationResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);

  // Update forecastConfig when configuration changes
  const handleConfigChange = useCallback(
    (config: ForecastConfig) => {
      setForecastConfig(config);
    },
    [setForecastConfig]
  );

  // Reset cross-validation results when skuData changes
  useEffect(() => {
    setCrossValidationResults([]);
  }, [skuData]);

  const handleForecastData = useCallback(
    (data: ForecastData[]) => {
      console.log('Received forecast data:', data);
      setForecastData(data);
    },
    [setForecastData]
  );

  const handleCrossValidationResult = useCallback(
    (result: CrossValidationResult) => {
      setCrossValidationResults((prev) => [...prev, result]);
    },
    [setCrossValidationResults]
  );

  const generateRecommendations = useCallback(
    (optimizationResults: OptimizationResult[]): Recommendation[] => {
      return optimizationResults.map((result) => {
        const recommendations: string[] = [];

        if (result.EOQ > result.reorderPoint) {
          recommendations.push('Consider placing larger orders to reduce the number of order cycles.');
        } else {
          recommendations.push('Consider placing smaller, more frequent orders to minimize holding costs.');
        }

        if (result.reorderPoint > 0) {
          recommendations.push('Ensure orders are placed before stock reaches the Reorder Point to avoid stockouts.');
        }

        if (result.totalLeadTime > 30) {
          recommendations.push('Review supplier lead times and consider working with suppliers to reduce delays.');
        }

        return {
          skuName: result.skuName,
          recommendation: recommendations.join(' '),
        };
      });
    },
    []
  );

  const handleOptimizationResults = useCallback(
    (results: OptimizationResult[]) => {
      setOptimizationResults(results);
      setRecommendations(generateRecommendations(results));
    },
    [generateRecommendations]
  );

  // Prepare historical data
  const prepareHistoricalData = useCallback((): ForecastData[] => {
    const maxHistoricalLength = Math.max(...skuData.map((sku) => sku.historicalData.length));

    const months = Array.from({ length: maxHistoricalLength }, (_, index) => `Month ${index + 1}`);

    const historicalData = months.map((month, index) => {
      const monthData: ForecastData = { month };

      skuData.forEach((sku) => {
        if (sku.skuName) {
          monthData[sku.skuName] = sku.historicalData[index]?.value || null;
        }
      });

      return monthData;
    });

    return historicalData;
  }, [skuData]);

  const historicalData = prepareHistoricalData();

  // Combine historical and forecast data
  const combinedData = useCallback(() => {
    const lastHistoricalMonthIndex = historicalData.length;

    const adjustedForecastData = forecastData.map((dataPoint, index) => {
      const adjustedDataPoint: ForecastData = { month: `Month ${lastHistoricalMonthIndex + index + 1}` };

      skuData.forEach((sku) => {
        if (sku.skuName) {
          adjustedDataPoint[sku.skuName] = dataPoint[sku.skuName] || null;
        }
      });

      return adjustedDataPoint;
    });

    return [...historicalData, ...adjustedForecastData];
  }, [historicalData, forecastData, skuData]);

  const chartData = combinedData();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Add the authenticated navigation bar */}
      <AuthenticatedNavigationBar /> 

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Demand Forecasting & Supply Chain Optimization
        </h1>

        <SKUAndLeadTimeManagement onSkuDataChange={setSkuData} />
        <ExcelUpload />
        <ForecastConfiguration onConfigChange={handleConfigChange} />
        <SupplyChainCosts onCostsChange={setSupplyChainCosts} />

        {/* EOQ Calculator */}
        <EOQCalculator
          skuData={skuData}
          supplyChainCosts={supplyChainCosts}
          forecastConfig={forecastConfig}
          onOptimizationResults={handleOptimizationResults}
        />

        {/* EnsembleForecast (ARIMA + ETS) */}
        <EnsembleForecast
          skuData={skuData}
          forecastPeriods={forecastConfig.forecastPeriods}
          onForecastData={handleForecastData}
          onCrossValidationResult={handleCrossValidationResult}
        />

        {/* Forecast Graph */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Demand per SKU (Historical and Forecasted)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {skuData.map((sku, index) => (
                  <Line
                    key={sku.skuName}
                    type="monotone"
                    dataKey={sku.skuName}
                    name={sku.skuName}
                    stroke={`hsl(${(index * 75) % 360}, 70%, 50%)`}
                    dot={false}
                    strokeDasharray="0"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cross-Validation Results */}
        {crossValidationResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Cross-Validation Results</h2>
            <ul>
              {crossValidationResults.map((result) => (
                <li key={result.skuName}>
                  <strong>SKU:</strong> {result.skuName}, <strong>Average Error:</strong>{' '}
                  {result.averageError.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* EOQ Results */}
        {optimizationResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Supply Chain Optimization Results</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {['SKU', 'EOQ', 'Reorder Point', 'Total Lead Time', 'Minimum Stock Holding'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizationResults.map((result) => (
                  <tr key={result.skuName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.skuName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.EOQ.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.reorderPoint.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.totalLeadTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.minStockHolding.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default DemandForecast;