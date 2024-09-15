// src/components/ARIMAForecast.tsx
import React, { useEffect } from 'react';
import Arima from 'arima'; // Import ArimaJS

interface ARIMAForecastProps {
  skuData: any[];
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
  // Simple function to find the best ARIMA parameters
  const findBestArimaParams = (data: number[]) => {
    let bestAIC = Infinity;
    let bestOrder = { p: 0, d: 0, q: 0 };

    // Define ranges for p, d, q
    const pValues = [0, 1, 2];
    const dValues = [0, 1];
    const qValues = [0, 1, 2];

    pValues.forEach((p) => {
      dValues.forEach((d) => {
        qValues.forEach((q) => {
          try {
            const arima = new Arima({ p, d, q });
            arima.train(data);
            const { aic } = arima.getParams();

            if (aic < bestAIC) {
              bestAIC = aic;
              bestOrder = { p, d, q };
            }
          } catch (e) {
            // Ignore models that fail to converge
          }
        });
      });
    });

    return bestOrder;
  };

  const handleForecast = () => {
    const months = Array.from({ length: forecastPeriods }, (_, index) => `Month ${index + 1}`);

    const skuForecasts: { [skuName: string]: number[] } = {};

    skuData.forEach((sku: any) => {
      if (sku.skuName && sku.historicalData) {
        const historicalData = sku.historicalData.map((data: { value: number }) => data.value);

        // Find the best ARIMA parameters for this SKU
        const bestOrder = findBestArimaParams(historicalData);

        // Train ARIMA with the best parameters
        const arima = new Arima(bestOrder);
        arima.train(historicalData);

        // Forecast for the next forecastPeriods
        const [forecastedValues] = arima.predict(forecastPeriods);

        skuForecasts[sku.skuName] = forecastedValues;
      }
    });

    const newForecastData = months.map((month, monthIndex) => {
      const monthData: any = { month };

      skuData.forEach((sku: any) => {
        if (sku.skuName && sku.historicalData) {
          const forecastedValues = skuForecasts[sku.skuName];
          monthData[sku.skuName] =
            forecastedValues[monthIndex] || sku.historicalData[sku.historicalData.length - 1]?.value || 0;
        }
      });

      return monthData;
    });

    onForecastData(newForecastData);
  };

  const handleCrossValidation = () => {
    skuData.forEach((sku: any) => {
      if (sku.skuName && sku.historicalData.length >= 6) {
        const historicalData = sku.historicalData.map((data: { value: number }) => data.value);
        const errors: number[] = [];

        // Rolling cross-validation
        for (let i = 3; i < historicalData.length - 1; i++) {
          const trainingData = historicalData.slice(0, i);
          const actualValue = historicalData[i];

          // Find the best ARIMA parameters for this SKU
          const bestOrder = findBestArimaParams(trainingData);

          const arima = new Arima(bestOrder);
          arima.train(trainingData);

          const [forecastedValue] = arima.predict(1);
          const error = Math.abs(forecastedValue - actualValue);
          errors.push(error);
        }

        const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;

        onCrossValidationResult({
          skuName: sku.skuName,
          averageError,
          errors,
        });
      }
    });
  };

  // Automatically retrain ARIMA and generate forecast whenever skuData changes
  useEffect(() => {
    handleForecast();
  }, [skuData, forecastPeriods]);

  return (
    <div>
      <button
        onClick={handleForecast}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Generate ARIMA Forecast
      </button>
      <button
        onClick={handleCrossValidation}
        className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Run Cross-Validation
      </button>
    </div>
  );
};

export default ARIMAForecast;