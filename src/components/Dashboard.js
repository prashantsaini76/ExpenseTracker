import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Apiconfig from "../config/Apiconfig";
import { IoAddCircle } from "react-icons/io5";
import { GrPowerShutdown } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "./Card";
import ExportToPdf from "./ExportToPdf";
import ExportToExcel from "./ExportToExcel";
import Spinner from './Spinner'
import { BsGraphUpArrow } from "react-icons/bs";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isEditBox, setIsEditBox] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [editData, setEditData] = useState({
    date: "",
    transferMode: "",
    bankName: "",
    item: "",
    category:"",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [expenseApiLoading, setExpenseApiLoading]=useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(60);
  const navigate = useNavigate();

  // ... (useEffect hooks and other functions will follow in the next parts)

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpenseApiLoading(true);
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
        setFilteredExpenses(response.data);
        calculateTotalAmount(response.data);
        setExpenseApiLoading(false);
      } catch (error) {
        setFetchError(
          `Error Occurred! ${error.response?.data?.message || error.message}`
        );
        setShowModal(true);
        setExpenseApiLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    filterExpenses();
  }, [filterMonth, filterYear, expenses, searchTerm]);

  const filterExpenses = () => {
    let filtered = expenses;
    if (filterYear) {
      filtered = filtered.filter((expense) => {
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

    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        Object.values(expense).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredExpenses(filtered);
    calculateTotalAmount(filtered);
    setCurrentPage(1);
  };

  const calculateTotalAmount = (expensesArray) => {
    const total = expensesArray.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    setTotalAmount(total.toFixed(2));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ... (handler functions will follow in the next part)
  const handleDeleteClick = (expenseId) => {
    setIsEditBox(false);
    setExpenseToDelete(expenseId);
    setShowModal(true);
    setError("");
    setSuccessMessage("");
  };

  const handleDeleteConfirm = async () => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      await axios.delete(`${Apiconfig.BASE_URL}/expenses`, {
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
      setSuccessMessage("Successfully deleted");
      setError("");
    } catch (error) {
      setError(
        `Error Occurred! ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsEditBox(false);
    setExpenseToDelete(null);
    setShowModal(false);
    setError("");
    setSuccessMessage("");
    setFetchError("");
  };

  const handleEditClick = (expense) => {
    setIsEditBox(true);
    setExpenseToEdit(expense._id);
    setEditData({
      date: expense.date.split("T")[0],
      transferMode: expense.transferMode,
      bankName: expense.bankName,
      item: expense.item,
      category: expense.category,
      amount: expense.amount,
    });
    setShowModal(true);
    setError("");
    setSuccessMessage("");
  };

  const handleEditConfirm = async () => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const updatedExpense = {
        id: expenseToEdit,
        ...editData,
      };

      await axios.put(`${Apiconfig.BASE_URL}/expenses`, updatedExpense, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseToEdit ? { ...expense, ...editData } : expense
        )
      );
      setSuccessMessage("Successfully updated");
      setError("");
    } catch (error) {
      setError(
        `Error Occurred! ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setExpenseToEdit(null);
    setShowModal(false);
    setError("");
    setSuccessMessage("");
    setEditData({
      date: "",
      transferMode: "",
      bankName: "",
      item: "",
      category:"",
      amount: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const years = [
    ...new Set(expenses.map((expense) => new Date(expense.date).getFullYear())),
  ];

  const categories = [
    "Food",
    "Rent",
    "EMI",
    "Bills",
    "Travel",
    "Shopping",
    "Fitness",
    "Beauty",
    "Groceries",
    "Medical",
    "Home Services",
    "Entertainment",
    "Offering",
    "Fuel",
    "Transfer to a person",
    "Other"
  ];

  // ... (JSX will follow in the next part)
  return (
    <Card>
      <div className="flex justify-center gap-4 items-center mb-6 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard
        </h2>
      
        <div className="flex gap-1 items-center">
          <button
            onClick={() => navigate("/add-expense")}
            className="bg-blue-500 text-white px-2 sm:px-2 py-1 rounded-md  hover:bg-blue-600"
          >
            <IoAddCircle />
          </button>
          <button
            onClick={() => navigate("/monthly-analysis")}
            className="bg-green-500 text-white px-2 sm:px-2 py-1 rounded-md hover:bg-green-600"
          >
           <BsGraphUpArrow/>
          </button>
          <ExportToPdf tableData={expenses} />
          <ExportToExcel tableData={expenses}/>
         

         
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 sm:px-2 py-1 rounded-md hover:bg-red-600"
          >
            <GrPowerShutdown />
            
          </button>
          </div>
         
        </div>
      

      <div className="mb-4 flex items-center space-x-4 mx-auto">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="text-[12px] sm:text-[14px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(2000, month - 1, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="text-[12px] sm:text-[14px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Years</option>
          {[
            ...new Set(
              expenses.map((expense) => new Date(expense.date).getFullYear())
            ),
          ].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 mx-auto">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
          Total Amount: ₹{totalAmount}
        </h3>
      </div>

      <div className="flex justify-between gap-2 items-center mx-auto w-[90%] p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-lg pr-4 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-[130px] sm:w-[200px]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-1 sm:px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <FaChevronLeft className="size-[10px] sm:size-fit" />
            </button>
            <span className="text-[12px] sm:text-sm text-gray-600 p-2">
              Results {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredExpenses.length)} of{" "}
              {filteredExpenses.length}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-1 sm:px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <FaChevronRight className="size-[10px] sm:size-fit"/>
            </button>
          </div>
        </div>

      <div className="flex-grow overflow-auto bg-white shadow-md mx-auto w-[90%] rounded-lg max-h-[500px] sm:max-h-[450px] mb-10">
       
            {expenseApiLoading ? <Spinner/> :  currentItems.length > 0 ? (
               <table className="min-w-full divide-y">
               <thead>
                 <tr>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Date
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Debit Item
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Category
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Mode
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Debit From
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Amount (₹)
                   </th>
                   <th className="px-5 py-3 bg-gray-100 text-gray-600 text-wrap text-left text-[12px] sm:text-sm uppercase font-semibold">
                     Operation
                   </th>
                 </tr>
               </thead>
             
              {currentItems.map((expense) => (
                  <tbody>
                <tr key={expense._id} className="border-b">
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {expense.item}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {expense.category}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {expense.transferMode}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {expense.bankName}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-wrap text-left text-[12px] sm:text-sm">
                    {expense.amount}
                  </td>
                  <td className="px-5 py-3 flex space-x-2">
                    <button
                      onClick={() => handleDeleteClick(expense._id)}
                      className="bg-red-500 text-white px-2 sm:px-2 py-1 sm:py-2 rounded-md mr-2 hover:bg-red-600 transition duration-200"
                    >
                      <MdDelete />
                    </button>
                    <button
                      onClick={() => handleEditClick(expense)}
                      className="bg-blue-500 text-white px-2 sm:px-2 py-1 sm:py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
             
            
          </tbody>
           ))}
        </table>
            ) :(<div className="w-[200px] shadow-lg bg-gray-200 mx-auto mt-10 p-4 rounded-lg mb-10 text-center">No data found</div>)}
       
          
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            {loading ? (
             <Spinner/>
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
                    {isEditBox
                      ? ""
                      : "Are you sure you want to delete this expense?"}
                  </h3>
                )}
                {!successMessage && !error && expenseToEdit && isEditBox && (
                  <form onSubmit={handleEditConfirm}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) =>
                          setEditData({ ...editData, date: e.target.value })
                        }
                        max={getTodayDate()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Mode of Transfer
                      </label>
                      <select
                        value={editData.transferMode}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            transferMode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Online">Online</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={editData?.bankName?.toUpperCase()}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            bankName: e.target.value?.toUpperCase(),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Item</label>
                      <input
                        type="text"
                        value={editData.item}
                        onChange={(e) =>
                          setEditData({ ...editData, item: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>


                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editData.category}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Select</option>
                        {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                      </select>
                    </div>


                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Amount</label>
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) =>
                          setEditData({ ...editData, amount: e.target.value })
                        }
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
                      {expenseToEdit && isEditBox && (
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
    </Card>
  );
};

export default Dashboard;
