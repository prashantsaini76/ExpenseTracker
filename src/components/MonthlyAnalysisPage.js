import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Apiconfig from "../config/Apiconfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import Spinner from "./Spinner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import PieChartComponent from "./PieChartComponent";

const MonthlyAnalysisPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${Apiconfig.BASE_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          `Error Occurred! ${error.response?.data?.message || error.message}`
        );
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === parseInt(selectedMonth) &&
          expenseDate.getFullYear() === parseInt(selectedYear)
        );
      });

      const categoryTotals = filteredExpenses.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      const data = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount: parseFloat(amount.toFixed(2)),
        }))
        .sort((a, b) => b.amount - a.amount); // Sort in descending order

      setCategoryData(data);
    }
  }, [expenses, selectedMonth, selectedYear]);

  const years = [
    ...new Set(expenses.map((expense) => new Date(expense.date).getFullYear())),
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
      "default",
      { month: "long" }
    );
    const title = `Monthly Analysis - ${monthName} ${selectedYear}`;

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add the graph to the PDF
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 30, 190, 100);
    }

    const tableColumn = ["Category", "Amount"];
    const tableRows = categoryData.map((item) => [
      item.category,
      item.amount.toFixed(2),
    ]);

    doc.autoTable({
      startY: 140,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headerStyles: { fillColor: [66, 135, 245], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`monthly_analysis_${selectedMonth}_${selectedYear}.pdf`);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className=" w-[95%] mx-auto mt-8 p-4 mb-8 rounded-lg shadow-lg bg-[#151a30] text-white">
      <div className="flex flex-col gap-2 justify-center items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-3 py-3 rounded-full hover:bg-blue-600"
        >
          <IoChevronBackCircleSharp />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Monthly Analysis
        </h2>
        <div className="flex space-x-2">
          {selectedMonth && selectedYear && categoryData.length > 0 && (
            <button
              onClick={exportToPDF}
              className="bg-red-700 text-white px-4 py-2 rounded-md"
            >
             <GrDocumentPdf/>
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 bg-[#181c2c] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(2000, month - 1, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-[#181c2c] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {selectedMonth && selectedYear && categoryData.length > 0 && (
        <div>
          <div className="mb-8 text-white" ref={chartRef} >
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Category-Wise Expenses (Sorted by Amount)
            </h3>
            <div className="overflow-y-auto h-[500px]">
             <PieChartComponent categoryData={categoryData}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAnalysisPage;
