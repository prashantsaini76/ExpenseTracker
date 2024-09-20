import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isEditBox, setIsEditBox] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [editData, setEditData] = useState({ date: '', transferMode:'', bankName: '', item: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // ... (useEffect hooks and other functions will follow in the next parts)

  useEffect(() => {
    const fetchExpenses = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3500/expenses', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setExpenses(response.data);
        setFilteredExpenses(response.data);
        calculateTotalAmount(response.data);
      } catch (error) {
        setFetchError(`Error Occurred! ${error.response?.data?.message || error.message}`);
        setShowModal(true);
      }
    };

    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    filterExpenses();
  }, [filterMonth, filterYear, expenses]);

  const filterExpenses = () => {
    let filtered = expenses;
    if (filterYear) {
      filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(filterYear);
      });
    }
    
    if (filterMonth) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() + 1 === parseInt(filterMonth);
      });
    }
    
    setFilteredExpenses(filtered);
    calculateTotalAmount(filtered);
  };

  const calculateTotalAmount = (expensesArray) => {
    const total = expensesArray.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    setTotalAmount(total.toFixed(2));
  };

  // ... (handler functions will follow in the next part)
  const handleDeleteClick = (expenseId) => {
    setIsEditBox(false);
    setExpenseToDelete(expenseId);
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDeleteConfirm = async () => {
    const authToken = localStorage.getItem('authToken');
    setLoading(true);
    try {
      await axios.delete('http://localhost:3500/expenses', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          id: expenseToDelete,
        },
      });

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseToDelete)
      );
      setSuccessMessage('Successfully deleted');
      setError('');
    } catch (error) {
      setError(`Error Occurred! ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
    setShowModal(false);
    setError('');
    setSuccessMessage('');
    setFetchError('');
  };

  const handleEditClick = (expense) => {
    setIsEditBox(true);
    setExpenseToEdit(expense._id);
    setEditData({
      date: expense.date.split('T')[0],
      transferMode: expense.transferMode,
      bankName: expense.bankName,
      item: expense.item,
      amount: expense.amount,
    });
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEditConfirm = async () => {
    const authToken = localStorage.getItem('authToken');
    setLoading(true);
    try {
      const updatedExpense = {
        id: expenseToEdit,
        ...editData,
      };

      await axios.put('http://localhost:3500/expenses', updatedExpense, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseToEdit ? { ...expense, ...editData } : expense
        )
      );
      setSuccessMessage('Successfully updated');
      setError('');
    } catch (error) {
      setError(`Error Occurred! ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setExpenseToEdit(null);
    setShowModal(false);
    setError('');
    setSuccessMessage('');
    setEditData({ date: '', transferMode:'', bankName: '', item: '', amount: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const years = [...new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))];

  // ... (JSX will follow in the next part)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <div>
            <button
              onClick={() => navigate('/add-expense')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
            >
              Add Expense
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
  
        <div className="mb-4 flex items-center space-x-4">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Total Amount: ₹{totalAmount}</h3>
        </div>
  
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
  <table className="min-w-full leading-normal">
    <thead>
      <tr>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
          Date
        </th>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
          Debit Item
        </th>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
         Mode of Transfer
        </th>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
          Debit Bank Account
        </th>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
          Amount (₹)
        </th>
        <th className="px-5 py-3 bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
          Operation
        </th>
      </tr>
    </thead>
    <tbody>
      {filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <tr key={expense._id} className="border-b">
            <td className="px-5 py-3 text-gray-700">
              {new Date(expense.date).toLocaleDateString()}
            </td>
            <td className="px-5 py-3 text-gray-700">{expense.item}</td>
            <td className="px-5 py-3 text-gray-700">{expense.transferMode}</td>
            <td className="px-5 py-3 text-gray-700">{expense.bankName}</td>
            <td className="px-5 py-3 text-gray-700">{expense.amount}</td>
            <td className="px-5 py-3 flex space-x-2">
              <button
                onClick={() => handleDeleteClick(expense._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditClick(expense)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="px-5 py-5 text-center text-gray-500">
            No expenses found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{showModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
      {loading ? (
        <div className="text-center">Processing...</div>
      ) : (
        <>
          {error && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error Occurred!
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Success
              </h3>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
          )}
          {!successMessage && !error && expenseToDelete && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isEditBox ? "":"Are you sure you want to delete this expense?"}
            </h3>
          )}
          {!successMessage && !error && expenseToEdit && (
            <form onSubmit={handleEditConfirm}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  max={getTodayDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mode of Transfer</label>
                <input
                  type="text"
                  value={editData.transferMode}
                  onChange={(e) => setEditData({ ...editData, transferMode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={editData.bankName}
                  onChange={(e) => setEditData({ ...editData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Item</label>
                <input
                  type="text"
                  value={editData.item}
                  onChange={(e) => setEditData({ ...editData, item: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </form>
          )}
          <div className="flex justify-end space-x-4">
            {(successMessage || error) && (
              <button
                onClick={handleCancelDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            )}
            {!successMessage && !error && (
              <>
                {expenseToDelete && !isEditBox && (
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Yes
                  </button>
                )}
                {expenseToEdit && (
                  <button
                    onClick={handleEditConfirm}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  </div>
)}
      </div>
    </div>
   );
};

export default Dashboard;