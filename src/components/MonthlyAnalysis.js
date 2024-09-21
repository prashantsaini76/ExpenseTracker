import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyAnalysis = ({ expenses, selectedMonth, selectedYear }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() + 1 === parseInt(selectedMonth) &&
               expenseDate.getFullYear() === parseInt(selectedYear);
      });

      const categoryTotals = filteredExpenses.reduce((acc, expense) => {
        const category = expense.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      const data = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2))
      }));

      setCategoryData(data);
      setError(null);
    } catch (err) {
      console.error('Error in MonthlyAnalysis:', err);
      setError('An error occurred while processing the data.');
    }
  }, [expenses, selectedMonth, selectedYear]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-xl font-semibold">Monthly Category Analysis</h3>
      </div>
      <div className="p-4">
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
    </div>
  );
};

export default MonthlyAnalysis;