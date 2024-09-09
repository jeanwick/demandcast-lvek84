// EOQCalculator.tsx
import React, { useEffect } from 'react';

interface SKUData {
  skuName: string;
  historicalData: { value: number }[];
  leadTimeDays: number;
}

interface SupplyChainCosts {
  orderCost: number;
  holdingCost: number;
  transportCost: number;
}

interface ForecastConfig {
  sailingTime: number;
  portDelays: number;
}

interface OptimizationResult {
  skuName: string;
  EOQ: number;
  reorderPoint: number;
  totalLeadTime: number;
  totalCost: number;
  minStockHolding: number; // Add minimum stock holding
}

interface EOQCalculatorProps {
  skuData: SKUData[];
  supplyChainCosts: SupplyChainCosts;
  forecastConfig: ForecastConfig;
  onOptimizationResults: (results: OptimizationResult[]) => void;
}

const EOQCalculator: React.FC<EOQCalculatorProps> = ({ skuData, supplyChainCosts, forecastConfig, onOptimizationResults }) => {
  const calculateOptimizationResults = (): OptimizationResult[] => {
    return skuData.map((sku: any) => {
      const demandRate = sku.historicalData.reduce(
        (total: number, entry: { value: number }) => total + entry.value, 0
      ) / sku.historicalData.length;

      const orderingCost = supplyChainCosts.orderCost;
      const holdingCost = supplyChainCosts.holdingCost;
      const transportCost = supplyChainCosts.transportCost;
      const leadTime = forecastConfig.sailingTime + forecastConfig.portDelays + sku.leadTimeDays;

      const EOQ = Math.sqrt((2 * demandRate * orderingCost) / holdingCost);

      const dailyDemand = demandRate / 30;

      const demandStandardDeviation = Math.sqrt(
        sku.historicalData.reduce((variance: number, entry: { value: number }) => {
          const demandDeviation = entry.value - demandRate;
          return variance + Math.pow(demandDeviation, 2);
        }, 0) / sku.historicalData.length
      );

      const demandStandardDeviationDuringLeadTime = demandStandardDeviation * Math.sqrt(leadTime);

      const serviceLevelFactor = 1.65;

      const safetyStock = serviceLevelFactor * demandStandardDeviationDuringLeadTime;

      const reorderPoint = (dailyDemand * leadTime) + safetyStock;

      const totalCost = orderingCost + holdingCost * EOQ + transportCost;

      return {
        skuName: sku.skuName,
        EOQ,
        reorderPoint,
        totalLeadTime: leadTime,
        totalCost,
        minStockHolding: safetyStock, // Include the safety stock as the minimum stock holding
      };
    });
  };

  // Call onOptimizationResults with the results
  useEffect(() => {
    const optimizationResults = calculateOptimizationResults();
    onOptimizationResults(optimizationResults);
  }, [skuData, supplyChainCosts, forecastConfig]);

  return null;
};

export default EOQCalculator;