// ExportToExcel.js
import React from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";

const ExportToExcel = ({ tableData }) => {
  const exportToExcel = () => {
    // Helper function to format date
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    };

    // Map the table data to the required format for Excel
    const formattedData = tableData.map((row) => ({
      DATE: formatDate(row.date),
      "TRANSFER MODE": row.transferMode,
      ITEM: row.item,
      "BANK NAME": row.bankName,
      AMOUNT: row.amount,
    }));

    // Calculate total amount
    const totalAmount = tableData.reduce((acc, row) => acc + parseFloat(row.amount), 0);

    // Add a row for total amount
    formattedData.push({
      DATE: "Total",
      "TRANSFER MODE": "",
      ITEM: "",
      "BANK NAME":"",
      AMOUNT: `₹${totalAmount.toFixed(2)}`,
    });

    // Create a worksheet and a workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseData");

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, "Expense Report.xlsx");
  };

  return (
    <div>
      <button onClick={exportToExcel} className="bg-green-600 text-white px-2 sm:px-2 py-1 rounded-md">
        <SiMicrosoftexcel/>
      </button>
    </div>
  );
};

export default ExportToExcel;
