// import React from 'react';

// interface OptimizationResult {
//   skuName: string;
//   EOQ: number;
//   reorderPoint: number;
//   totalLeadTime: number;
// }

// interface Recommendation {
//   skuName: string;
//   recommendation: string;
// }

// interface RecommendationsProps {
//   optimizationResults: OptimizationResult[];
// }

// const Recommendations: React.FC<RecommendationsProps> = ({ optimizationResults }) => {
  
//   // Function to generate recommendations based on optimization results
//   const generateRecommendations = (): Recommendation[] => {
//     return optimizationResults.map((result) => {
//       let recommendation = '';

//       if (result.EOQ > result.reorderPoint) {
//         recommendation += `Consider placing larger orders to reduce the number of order cycles. `;
//       } else {
//         recommendation += `Consider placing smaller, more frequent orders to minimize holding costs. `;
//       }

//       if (result.reorderPoint > 0) {
//         recommendation += `Ensure orders are placed before stock reaches the Reorder Point to avoid stockouts. `;
//       }

//       if (result.totalLeadTime > 30) {
//         recommendation += `Review supplier lead times and consider working with suppliers to reduce delays. `;
//       }

//       return {
//         skuName: result.skuName,
//         recommendation,
//       };
//     });
//   };

//   const recommendations = generateRecommendations();

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
//       <ul className="list-disc pl-6">
//         {recommendations.map((rec) => (
//           <li key={rec.skuName}>
//             <strong>{rec.skuName}:</strong> {rec.recommendation}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Recommendations;