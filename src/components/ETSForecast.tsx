// ETSForecast.tsx
import React, { useCallback, useState } from 'react';

interface SKU {
  skuName: string;
  historicalData: { value: number }[];
}

interface ETSForecastProps {
  skuData: SKU[];
  forecastPeriods: number;
  onForecastData: (data: any) => void;
}

// Helper function to calculate exponential smoothing
const calculateExponentialSmoothing = (data: number[], alpha: number): number[] => {
  const smoothedData: number[] = [];
  if (data.length === 0) return smoothedData;

  // Initialize the first smoothed value
  smoothedData[0] = data[0];

  // Calculate the rest of the smoothed values
  for (let i = 1; i < data.length; i++) {
    smoothedData[i] = alpha * data[i] + (1 - alpha) * smoothedData[i - 1];
  }

  return smoothedData;
};

const ETSForecast: React.FC<ETSForecastProps> = ({ skuData, forecastPeriods, onForecastData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleETSForecast = useCallback(async () => {
    console.log('Generating ETS forecast for forecastPeriods:', forecastPeriods);
    setIsLoading(true);

    try {
      const skuForecasts: { [skuName: string]: number[] } = {};

      for (let sku of skuData) {
        if (sku.skuName && sku.historicalData) {
          const historicalData = sku.historicalData.map((data) => data.value);

          if (historicalData.length < 3) {
            console.warn(`Not enough data to forecast for SKU: ${sku.skuName}`);
            continue;
          }

          // Apply custom exponential smoothing
          const alpha = 0.5; // Smoothing factor between 0 and 1
          const smoothedData = calculateExponentialSmoothing(historicalData, alpha);

          // Use the last smoothed value to forecast future periods
          const lastSmoothedValue = smoothedData[smoothedData.length - 1];
          const forecastedValues = Array(forecastPeriods).fill(lastSmoothedValue);

          // Ensure no negative forecasts
          skuForecasts[sku.skuName] = forecastedValues.map((value) => (value < 0 ? 0 : value));
        }
      }

      // Construct forecast data
      const newForecastData = Array.from({ length: forecastPeriods }, (_, index) => {
        const dataPoint: { [key: string]: number | string | null } = {};

        skuData.forEach((sku) => {
          if (sku.skuName && sku.historicalData) {
            const forecastedValues = skuForecasts[sku.skuName];
            dataPoint[sku.skuName] = forecastedValues ? forecastedValues[index] || null : null;
          }
        });

        return dataPoint;
      });

      console.log('Generated ETS forecast data:', newForecastData);
      onForecastData(newForecastData);
    } catch (error) {
      console.error('Error during ETS forecast:', error);
    } finally {
      setIsLoading(false);
    }
  }, [skuData, forecastPeriods, onForecastData]);

  return (
    <div>
      <button
        onClick={handleETSForecast}
        className={`px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Generating ETS Forecast...' : 'Generate ETS Forecast'}
      </button>
    </div>
  );
};

export default ETSForecast;