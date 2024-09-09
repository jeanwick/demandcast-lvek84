import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ForecastConfigurationProps {
  onConfigChange: (config: { sailingTime: number; portDelays: number; forecastPeriods: number }) => void;
}

// Hardcoded congestion data for now
const congestionReport = {
  ZADUR: {
    weeklyMedian: 9.00,
    monthlyMedian: 8.25
  },
  ZAZBA: {
    weeklyMedian: 7.00,
    monthlyMedian: 7.00
  },
  ZACPT: {
    weeklyMedian: 8.88,
    monthlyMedian: 8.29
  }
};

const ForecastConfiguration: React.FC<ForecastConfigurationProps> = ({ onConfigChange }) => {
  const [sailingTime, setSailingTime] = useState(30);
  const [portDelays, setPortDelays] = useState(0);  // Port delays will be calculated based on the hardcoded data
  const [forecastPeriods, setForecastPeriods] = useState(6);
  const [port, setPort] = useState("");  // Start with an empty port selection
  const [congestionData, setCongestionData] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);  // Store API data separately

  // Fetch congestion data from API when port changes
  useEffect(() => {
    const fetchApiData = async () => {
      if (port === "") return;  // Do not fetch data if no port is selected

      try {
        const response = await axios.get(`https://api.sinay.ai/congestion/api/v1/congestion`, {
          headers: {
            'API_KEY': '6aee23aa-0a6e-4cf7-b801-3a88290c1c51',  // Use API_KEY header instead of Authorization
            'Content-Type': 'application/json'
          },
          params: {
            portCode: port  // Pass only the port code
          }
        });

        if (response.data && Object.keys(response.data).length > 0) {
          setApiData(response.data);  // Store API data
        } else {
          setApiData(null);  // Reset API data if none found
        }

      } catch (error) {
        console.error("Error fetching API congestion data:", error);
      }
    };

    fetchApiData();
  }, [port]);

  // Calculate port delays based on hardcoded congestion report
  useEffect(() => {
    if (port && congestionReport[port]) {
      const weeklyMedian = congestionReport[port].weeklyMedian;
      const monthlyMedian = congestionReport[port].monthlyMedian;
      const averageDelays = (weeklyMedian + monthlyMedian) / 2;

      setPortDelays(averageDelays);
      setCongestionData({
        weeklyMedian,
        monthlyMedian
      });

      // Call the onConfigChange with updated values, including port delays (ignoring API for lead time calculation)
      onConfigChange({
        sailingTime,
        portDelays: averageDelays,  // Use only the hardcoded data for port delays
        forecastPeriods
      });

    } else {
      setPortDelays(0);
      setCongestionData(null);
    }
  }, [port, sailingTime, forecastPeriods]);

  return (
    <div className="mb-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Forecast Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port of Discharge</label>
            <select
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="form-select mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Port</option>  {/* Default empty option */}
              <option value="ZADUR">Durban (ZADUR)</option>
              <option value="ZAZBA">Coega (ZAZBA)</option>
              <option value="ZACPT">Cape Town (ZACPT)</option>
            </select>
          </div>

          <div>
            <label htmlFor="sailingTime" className="block text-sm font-medium text-gray-700">Sailing Time (days)</label>
            <input
              type="number"
              id="sailingTime"
              value={sailingTime}
              onChange={(e) => setSailingTime(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="portDelays" className="block text-sm font-medium text-gray-700">Port Delays (days)</label>
            <input
              type="number"
              id="portDelays"
              value={portDelays}
              readOnly
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="forecastPeriods" className="block text-sm font-medium text-gray-700">Forecast Periods</label>
            <input
              type="number"
              id="forecastPeriods"
              value={forecastPeriods}
              onChange={(e) => setForecastPeriods(Number(e.target.value))}
              className="form-input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Display Congestion Data from Hardcoded Report */}
        {congestionData && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Hardcoded Congestion Data for {port}</h3>
            <ul className="list-disc ml-6">
              <li><strong>Weekly Median Port Congestion Delay (Days):</strong> {congestionData.weeklyMedian}</li>
              <li><strong>Monthly Median Port Congestion Delay (Days):</strong> {congestionData.monthlyMedian}</li>
            </ul>
          </div>
        )}

        {/* Display API Congestion Data */}
        {apiData && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">API Congestion Data for {port}</h3>
            <ul className="list-disc ml-6">
              <li><strong>Congestion (%):</strong> {apiData.congestion}</li>
              <li><strong>Gap with Mean:</strong> {apiData.gapWithMean}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastConfiguration;