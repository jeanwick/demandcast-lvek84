// ARIMAForecast.tsx
import React, { useCallback, useState } from 'react';
import Arima from 'arima'; // Import ArimaJS

interface SKU {
  skuName: string;
  historicalData: { value: number }[];
}

interface ARIMAForecastProps {
  skuData: SKU[];
  forecastPeriods: number;
  onForecastData: (data: any) => void;
  onCrossValidationResult: (result: any) => void;
}

const ARIMAForecast: React.FC<ARIMAForecastProps> = ({
  skuData,
  forecastPeriods,
  onForecastData,
  onCrossValidationResult,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the function to prevent recreation on every render
  const findBestArimaParams = useCallback((data: number[]) => {
    let bestAIC = Infinity;
    let bestOrder = { p: 0, d: 0, q: 0 };

    // Define ranges for p, d, q
    const pValues = [0, 1, 2, 3, 4];
    const dValues = [0, 1, 2];
    const qValues = [0, 1, 2, 3, 4];

    for (let p of pValues) {
      for (let d of dValues) {
        for (let q of qValues) {
          try {
            const arima = new Arima({ p, d, q, verbose: false });
            arima.train(data);
            const { aic } = arima.getParams();

            if (aic < bestAIC) {
              bestAIC = aic;
              bestOrder = { p, d, q };
            }
          } catch (e) {
            // Ignore models that fail to converge
          }
        }
      }
    }

    return bestOrder;
  }, []);

  const handleForecast = useCallback(async () => {
    console.log('Generating forecast with forecastPeriods:', forecastPeriods);
    setIsLoading(true);
    try {
      const skuForecasts: { [skuName: string]: number[] } = {};

      for (let sku of skuData) {
        if (sku.skuName && sku.historicalData) {
          const historicalData = sku.historicalData.map((data) => data.value);

          // Check for sufficient data
          if (historicalData.length < 3) {
            console.warn(`Not enough data to forecast for SKU: ${sku.skuName}`);
            continue;
          }

          // Find the best ARIMA parameters for this SKU
          const bestOrder = findBestArimaParams(historicalData);

          // Train ARIMA with the best parameters
          const arima = new Arima({
            p: bestOrder.p,
            d: bestOrder.d,
            q: bestOrder.q,
            verbose: false,
          });
          arima.train(historicalData);

          // Forecast for the next forecastPeriods
          const [forecastedValues] = arima.predict(forecastPeriods) as [number[]];

          // Ensure no negative forecasts
          skuForecasts[sku.skuName] = forecastedValues.map((value: number) => (value < 0 ? 0 : value));
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

      console.log('Generated forecast data:', newForecastData);
      onForecastData(newForecastData);
    } catch (error) {
      console.error('Error during forecast:', error);
    } finally {
      setIsLoading(false);
    }
  }, [skuData, forecastPeriods, onForecastData, findBestArimaParams]);

  const handleCrossValidation = useCallback(async () => {
    setIsLoading(true);
    try {
      for (let sku of skuData) {
        if (sku.skuName && sku.historicalData && sku.historicalData.length >= 6) {
          const historicalData = sku.historicalData.map((data) => data.value);
          const errors: number[] = [];

          // Rolling cross-validation
          for (let i = 3; i < historicalData.length - 1; i++) {
            const trainingData = historicalData.slice(0, i);
            const actualValue = historicalData[i];

            // Find the best ARIMA parameters for this SKU
            const bestOrder = findBestArimaParams(trainingData);

            const arima = new Arima({
              p: bestOrder.p,
              d: bestOrder.d,
              q: bestOrder.q,
              verbose: false,
            });
            arima.train(trainingData);

            const [forecastedValue] = arima.predict(1) as [number[]];
            const error = Math.abs(forecastedValue[0] - actualValue);
            errors.push(error);
          }

          const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;

          onCrossValidationResult({
            skuName: sku.skuName,
            averageError,
            errors,
          });
        }
      }
    } catch (error) {
      console.error('Error during cross-validation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [skuData, onCrossValidationResult, findBestArimaParams]);

  return (
    <div>
      <button
        onClick={handleForecast}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Generating Forecast...' : 'Generate ARIMA Forecast'}
      </button>
      <button
        onClick={handleCrossValidation}
        className={`ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Running Validation...' : 'Run Cross-Validation'}
      </button>
    </div>
  );
};

export default ARIMAForecast;