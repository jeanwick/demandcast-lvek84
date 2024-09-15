// EnsembleForecast.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ARIMAForecast from './ARIMAForecast';
import ETSForecast from './ETSForecast';
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

interface SKU {
  skuName: string;
  historicalData: { value: number }[];
}

interface EnsembleForecastProps {
  skuData: SKU[];
  forecastPeriods: number;
  onForecastData: (data: any[]) => void; // Add this prop to the interface
  onCrossValidationResult: (result: any) => void; // Add this prop to the interface
}

const EnsembleForecast: React.FC<EnsembleForecastProps> = ({ skuData, forecastPeriods, onForecastData, onCrossValidationResult }) => {
  const [arimaForecastData, setArimaForecastData] = useState<any[]>([]);
  const [etsForecastData, setEtsForecastData] = useState<any[]>([]);
  const [combinedForecastData, setCombinedForecastData] = useState<any[]>([]);
  const [crossValidationResults, setCrossValidationResults] = useState<any[]>([]);

  // Combine ARIMA and ETS Forecasts
  const combineForecasts = useCallback(() => {
    if (arimaForecastData.length === 0 || etsForecastData.length === 0) {
      return;
    }

    const combinedData = arimaForecastData.map((arimaDataPoint, index) => {
      const etsDataPoint = etsForecastData[index] || {};
      const combinedPoint: { [key: string]: number | string | null } = { month: arimaDataPoint.month };

      Object.keys(arimaDataPoint).forEach((skuName) => {
        if (skuName !== 'month') {
          const arimaValue = arimaDataPoint[skuName] as number;
          const etsValue = etsDataPoint[skuName] as number || 0;
          // Average the two forecasts
          combinedPoint[skuName] = (arimaValue + etsValue) / 2;
        }
      });

      return combinedPoint;
    });

    setCombinedForecastData(combinedData);
    onForecastData(combinedData); // Send the combined data back to the parent
  }, [arimaForecastData, etsForecastData, onForecastData]);

  // Handle ARIMA Forecast Data
  const handleArimaForecastData = (data: any[]) => {
    setArimaForecastData(data);
  };

  // Handle ETS Forecast Data
  const handleEtsForecastData = (data: any[]) => {
    setEtsForecastData(data);
  };

  // Handle ARIMA Cross-Validation Results
  const handleCrossValidationResult = (result: any) => {
    setCrossValidationResults((prevResults) => [...prevResults, result]);
    onCrossValidationResult(result); // Send cross-validation results back to the parent
  };

  // Combine forecasts when ARIMA or ETS data changes
  useEffect(() => {
    combineForecasts();
  }, [arimaForecastData, etsForecastData, combineForecasts]);

  return (
    <div>
      {/* ARIMA and ETS Forecast Components */}
      <ARIMAForecast
        skuData={skuData}
        forecastPeriods={forecastPeriods}
        onForecastData={handleArimaForecastData}
        onCrossValidationResult={handleCrossValidationResult} // Pass the cross-validation callback
      />
      <ETSForecast skuData={skuData} forecastPeriods={forecastPeriods} onForecastData={handleEtsForecastData} />

      {/* Combined Forecast Graph */}
      {combinedForecastData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Combined Forecast (ARIMA + ETS)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedForecastData}>
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
            {crossValidationResults.map((result, index) => (
              <li key={index}>
                <strong>SKU:</strong> {result.skuName}, <strong>Average Error:</strong>{' '}
                {result.averageError.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnsembleForecast;