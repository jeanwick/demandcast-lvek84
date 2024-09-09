// import React, { useState } from 'react';
// import { saveAs } from 'file-saver';
// import Papa from 'papaparse';

// const CSVUploadComponent: React.FC = () => {
//   const [csvData, setCsvData] = useState<any[]>([]);

//   // Sample CSV template for download
//   const csvTemplate = [
//     ['SKU Name', 'Supplier Name', 'Lead Time (Days)', 'Month 1', 'Month 2', 'Month 3'],
//     ['SKU001', 'SupplierA', '10', '100', '120', '140'],
//     ['SKU002', 'SupplierB', '8', '90', '110', '130'],
//   ];

//   // Download CSV template
//   const downloadTemplate = () => {
//     const csv = Papa.unparse(csvTemplate);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'sku_template.csv');
//   };

//   // Handle CSV file upload
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       Papa.parse(file, {
//         header: true,
//         complete: (result) => {
//           setCsvData(result.data);
//           console.log('Parsed CSV Data:', result.data);
//         },
//       });
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">CSV Upload</h2>

//       <div className="mb-6">
//         <button
//           onClick={downloadTemplate}
//           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Download CSV Template
//         </button>
//       </div>

//       <div className="mb-6">
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileUpload}
//           className="file-input border rounded-md px-4 py-2"
//         />
//       </div>

//       {csvData.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-4">Uploaded CSV Data:</h3>
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {Object.keys(csvData[0]).map((key) => (
//                   <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {key}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {csvData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Object.values(row).map((value, cellIndex) => (
//                     <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {value}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CSVUploadComponent;