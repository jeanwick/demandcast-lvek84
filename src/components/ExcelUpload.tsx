import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelUpload: React.FC = () => {
    const [fileData, setFileData] = useState<any>(null);

    // Handle file change event
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = event.target?.result;

                // Parse Excel data
                const workbook = XLSX.read(data, { type: 'binary' });

                // Assuming the first sheet is the one we want to work with
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convert sheet to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Update state with the parsed data
                setFileData(jsonData);
            };

            reader.readAsBinaryString(file);
        }
    };

    // Function to render the uploaded data
    const renderFileData = () => {
        if (!fileData) return null;

        return (
            <table className="min-w-full">
                <thead>
                    <tr>
                        {fileData[0].map((header: string, idx: number) => (
                            <th key={idx} className="px-6 py-3 border-b border-gray-200">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {fileData.slice(1).map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex}>
                            {row.map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} className="px-6 py-4 border-b border-gray-200">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="mb-4"
            />
            {fileData ? (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Uploaded Data:</h2>
                    <div className="overflow-x-auto">{renderFileData()}</div>
                </div>
            ) : (
                <p>No file uploaded yet.</p>
            )}
        </div>
    );
};

export default ExcelUpload;