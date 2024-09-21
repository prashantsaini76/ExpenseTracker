// ExportToPdf.js
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GrDocumentPdf } from "react-icons/gr";

const ExportToPdf = ({ tableData }) => {
  const exportPDF = () => {
    const doc = new jsPDF();

    // Define the table column headers from the data
   // const tableColumn = Object.keys(tableData[0]);

   const tableColumn = ["DATE", "TRANSFER MODE", "ITEM", "BANK NAME", "AMOUNT"];

    // Map the table data to an array of arrays (table rows)
    //const tableRows = tableData.map((row) => Object.values(row));

      // Helper function to format date
      const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
      };



    const tableRows = tableData.map((row) => [
        formatDate(row.date),
        row.transferMode,
        row.item,
        row.bankName,
        row.amount,
      ]);

      const totalAmount = tableData.reduce((acc, row) => acc + parseFloat(row.amount), 0);

    // Add a title to the PDF
    doc.text(`Expense Data (Total Amount Rs:${totalAmount}/-)`, 14, 16);



    // Create the table in the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the generated PDF
    doc.save("Expense_Data.pdf");
  };

  return (
    <div>
      <button onClick={exportPDF} className="bg-red-700 text-white px-2 sm:px-2 py-1 rounded-md">
       <GrDocumentPdf/>
      </button>
    </div>
  );
};

export default ExportToPdf;
