// import React, { useState } from 'react';
// import * as XLSX from 'xlsx'; // Statically import xlsx library

// interface FileUploadComponentProps {
//   onFileUpload: (fileData: any) => void;
// }

// const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileUpload }) => {
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       const file = event.target.files?.[0];
//       if (!file) {
//         setError('No file selected');
//         return;
//       }

//       const fileSize = file.size / 1024 / 1024; // size in MB
//       console.log("Selected file size:", fileSize);

//       const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

//       if (fileSize > 2) {
//         setError('File size exceeds the 2MB limit');
//         return;
//       }

//       if (!allowedFileTypes.includes(file.type)) {
//         setError('Invalid file type. Only Excel files are allowed.');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const arrayBuffer = e.target?.result as ArrayBuffer;
//           console.log("File read successfully, processing data...");
//           const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//           console.log("Workbook loaded", workbook);

//           const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//           const fileData = XLSX.utils.sheet_to_json(firstSheet);
//           console.log("Parsed file data:", fileData);

//           onFileUpload(fileData);
//           setError(null); // Clear previous errors if successful
//         } catch (err) {
//           console.error("Error during file parsing:", err);
//           setError('Failed to parse the file. Please check if it is a valid Excel spreadsheet.');
//         }
//       };

//       reader.onerror = (err) => {
//         console.error("Error reading file:", err);
//         setError('Failed to read the file. Please try again.');
//       };

//       reader.readAsArrayBuffer(file);
//     } catch (err) {
//       console.error("File handling error:", err);
//       setError('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="my-4">
//       <input 
//         type="file" 
//         accept=".xlsx, .xls" 
//         onChange={handleFileChange} 
//         className="file-input"
//       />
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default FileUploadComponent;