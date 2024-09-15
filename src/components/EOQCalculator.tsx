// EOQCalculator.tsx
import React, { useEffect, useCallback } from 'react';

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
  minStockHolding: number;
}

interface EOQCalculatorProps {
  skuData: SKUData[];
  supplyChainCosts: SupplyChainCosts;
  forecastConfig: ForecastConfig;
  onOptimizationResults: (results: OptimizationResult[]) => void;
}

const EOQCalculator: React.FC<EOQCalculatorProps> = ({
  skuData,
  supplyChainCosts,
  forecastConfig,
  onOptimizationResults,
}) => {
  // Memoize the calculation function to prevent unnecessary recalculations
  const calculateOptimizationResults = useCallback((): OptimizationResult[] => {
    return skuData.map((sku) => {
      const { orderCost, holdingCost, transportCost } = supplyChainCosts;
      const { sailingTime, portDelays } = forecastConfig;
      const totalLeadTime = sailingTime + portDelays + sku.leadTimeDays;

      // Calculate total demand and mean demand
      const totalDemand = sku.historicalData.reduce((sum, { value }) => sum + value, 0);
      const demandRate = totalDemand / sku.historicalData.length;
      const dailyDemand = demandRate / 30;

      // Calculate variance and standard deviation
      const variance =
        sku.historicalData.reduce((sum, { value }) => {
          const deviation = value - demandRate;
          return sum + deviation * deviation;
        }, 0) / sku.historicalData.length;
      const demandStdDev = Math.sqrt(variance);

      // Economic Order Quantity (EOQ)
      const EOQ = Math.sqrt((2 * demandRate * orderCost) / holdingCost);

      // Safety Stock Calculation
      const serviceLevelFactor = 1.65; // 95% service level
      const demandStdDevDuringLeadTime = demandStdDev * Math.sqrt(totalLeadTime);
      const safetyStock = serviceLevelFactor * demandStdDevDuringLeadTime;

      // Reorder Point Calculation
      const reorderPoint = dailyDemand * totalLeadTime + safetyStock;

      // Total Cost Calculation (Adjusted to standard EOQ total cost formula)
      const totalCost =
        (demandRate / EOQ) * orderCost + // Annual ordering cost
        (EOQ / 2) * holdingCost + // Annual holding cost
        transportCost; // Transport cost (assumed per order)

      return {
        skuName: sku.skuName,
        EOQ,
        reorderPoint,
        totalLeadTime,
        totalCost,
        minStockHolding: safetyStock,
      };
    });
  }, [skuData, supplyChainCosts, forecastConfig]);

  useEffect(() => {
    const optimizationResults = calculateOptimizationResults();
    onOptimizationResults(optimizationResults);
  }, [calculateOptimizationResults, onOptimizationResults]);

  return null;
};

export default EOQCalculator;