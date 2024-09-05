import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './YourComponentLibrary'; // Adjust this import based on where your Button component is defined

interface OpenAIForecastProps {
  historicalData: { month: string; sku1: number; sku2: number }[];
  sku1Name: string;
  sku2Name: string;
  sailingTime: number;
  portDelays: number;
  forecastPeriods: number;
  onForecastGenerated: (forecast: any[]) => void;
}

const OpenAIForecast: React.FC<OpenAIForecastProps> = ({
  historicalData,
  sku1Name,
  sku2Name,
  sailingTime,
  portDelays,
  forecastPeriods,
  onForecastGenerated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForecast = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Given the historical demand data for two SKUs:
        ${sku1Name}: ${historicalData.map(d => d.sku1).join(', ')}
        ${sku2Name}: ${historicalData.map(d => d.sku2).join(', ')}
        Sailing time: ${sailingTime} days
        Port delays: ${portDelays} days
        Forecast the demand for the next ${forecastPeriods} periods for both SKUs.
        Provide the response as a JSON array with objects containing month, ${sku1Name}, and ${sku2Name} properties.`;

      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: prompt,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.5,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const forecastResult = JSON.parse(response.data.choices[0].text);
      onForecastGenerated(forecastResult);
    } catch (err) {
      setError('Failed to generate forecast. Please try again.');
      console.error('Forecast error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleForecast} disabled={isLoading}>
        {isLoading ? 'Generating Forecast...' : 'Generate AI Forecast'}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default OpenAIForecast;