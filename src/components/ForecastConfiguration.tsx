import React, { useState } from 'react';

interface ForecastConfigurationProps {
  onConfigChange: (config: { sailingTime: number; portDelays: number; forecastPeriods: number }) => void;
}

const ForecastConfiguration: React.FC<ForecastConfigurationProps> = ({ onConfigChange }) => {
  const [sailingTime, setSailingTime] = useState(30);
  const [portDelays, setPortDelays] = useState(5);
  const [forecastPeriods, setForecastPeriods] = useState(6);  // Updated to match latest implementation

  const handleConfigChange = () => {
    onConfigChange({ sailingTime, portDelays, forecastPeriods });
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-4">Forecast Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sailingTime" className="block text-sm font-medium text-gray-700">
            Sailing Time (days)
          </label>
          <input
            type="number"
            id="sailingTime"
            value={sailingTime}
            onChange={(e) => setSailingTime(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="portDelays" className="block text-sm font-medium text-gray-700">
            Port Delays (days)
          </label>
          <input
            type="number"
            id="portDelays"
            value={portDelays}
            onChange={(e) => setPortDelays(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="forecastPeriods" className="block text-sm font-medium text-gray-700">
            Forecast Periods
          </label>
          <input
            type="number"
            id="forecastPeriods"
            value={forecastPeriods}
            onChange={(e) => setForecastPeriods(Number(e.target.value))}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>
      <button
        onClick={handleConfigChange}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Update Configuration
      </button>
    </div>
  );
};

export default ForecastConfiguration;