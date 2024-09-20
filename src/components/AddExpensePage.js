import React, { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Apiconfig from '../config/Apiconfig'

const AddExpensePage = () => {
  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [modeOfTransfer, setmodeOfTransfer] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddExpense = useCallback(async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    if (!date || !item || !amount) {
      setError("All fields are required.");
      return;
    }

    try {
      const newExpense = {
        date: date,
        transferMode: modeOfTransfer,
        bankName: bankName,
        item: item,
        amount: parseFloat(amount),
      };

      // Send POST request to add expense
      await axios.post(`${Apiconfig.BASE_URL}/expenses`, newExpense, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Navigate back to the dashboard after successfully adding the expense
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError(error?.message);
      setIsOpen(true);
      setIsLoading(false);
    }
  });

  const toggleModal = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    console.log("toggleModal called. New isOpen value:", !isOpen);
  }, [isOpen]);

  // Get today's date to disable future dates in the date picker
  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // returns in 'YYYY-MM-DD' format
  };

  const handleCancel = () => {
    navigate("/dashboard"); // Navigate back to dashboard on cancel
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="sm:min-h-screen sm:bg-gray-100 flex justify-center items-center mt-[100px] sm:mt-0">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Expense
            </h2>

            <form onSubmit={handleAddExpense}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getMaxDate()} // Disable future dates
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Debit Item</label>
                <input
                  type="text"
                  value={item}
                  placeholder="Groceries, Laundry etc"
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Mode of Transfer
                </label>
                <select
                  value={modeOfTransfer}
                  onChange={(e) => setmodeOfTransfer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  placeholder="HDFC, SBI etc"
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  placeholder="Enter Amount Spent"
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[300px]">
            <div className="p-5 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Failed to add expense</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExpensePage;
