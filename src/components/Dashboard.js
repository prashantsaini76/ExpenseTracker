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
import Spinner from "./Spinner";
import { BsGraphUpArrow } from "react-icons/bs";
import NavigationBar from "./NavigationBar";

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
    category: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [expenseApiLoading, setExpenseApiLoading] = useState(false);
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

    if (filtered) {
      if (filterYear) {
        filtered = filtered.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === parseInt(filterYear);
        });
      }

      if (filterMonth) {
        filtered = filtered?.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() + 1 === parseInt(filterMonth);
        });
      }

      if (searchTerm) {
        filtered = filtered?.filter((expense) =>
          Object.values(expense).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      setFilteredExpenses(filtered);
      calculateTotalAmount(filtered);
      setCurrentPage(1);
    }
  };

  const calculateTotalAmount = (expensesArray) => {
    if (expensesArray) {
      const total = expensesArray?.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      setTotalAmount(total.toFixed(2));
    }
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
      category: "",
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

  /*  const years = [
    ...new Set(expenses?.map((expense) => new Date(expense.date).getFullYear())),
  ];
 */
  const categories = [
    "Groceries",
    "Food",
    "Rent",
    "EMI",
    "Bills",
    "Travel",
    "Shopping",
    "Fitness",
    "Beauty",
    "Deposit or Investment",
    "Subscription",
    "Medical",
    "Home Services",
    "Entertainment",
    "Offering",
    "Fuel",
    "Transfer to a person",
    "Gift",
    "Vacation",
    "Other",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // ... (JSX will follow in the next part)
  return (
    <Card>
      <NavigationBar expenses={expenses} />

      <div className="mb-4 flex items-center space-x-4 mx-auto">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="text-[12px] sm:text-[14px] px-4 py-2 border bg-[#212a31] text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="text-[12px] sm:text-[14px] px-4 py-2 border bg-[#212a31] text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Years</option>

          <option value="2024">2024</option>
        </select>
      </div>

      <div className="mb-4 mx-auto bg-[#212a31] p-2 rounded-lg border">
        <h3 className="text-sm sm:text-lg font-semibold text-white">
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
            className="pl-10 text-sm sm:text-lg bg-[#212a31] text-white pr-4 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-[130px] sm:w-[200px]"
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
          <span className="text-[12px] sm:text-sm bg-[#748d92] text-white p-2">
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
            <FaChevronRight className="size-[10px] sm:size-fit" />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto bg-[#181c2c] shadow-xl mx-auto w-[88%] max-h-[700px] sm:max-h-[600px] rounded-lg mb-10 p-2">
        {expenseApiLoading ? (
          <Spinner />
        ) : currentItems.length > 0 ? (
          <div className="flex flex-col gap-2 flex-wrap">
            {/* below div should come under looping */}

            {currentItems.map((expense) => (
              <div className="flex gap-2  justify-between items-center text-white bg-[#212a31] p-2 rounded-lg shadow-lg w-[98%] mx-auto">
                <div className="flex flex-col items-center justify-center text-center bg-black py-1 rounded-lg flex-wrap gap-1 w-[70px] sm:w-[100px]">
                  <div className="text-[12px] sm:text-[20px] font-bold shadow-lg rounded-full px-2 py-1 bg-green-900">
                    {formatDate(expense.date)?.split("-")[0]}
                  </div>
                  <div className="text-[10px]">
                    {formatDate(expense.date)?.split("-")[1]}
                  </div>
                  <div className="text-[10px]">
                    {formatDate(expense.date)?.split("-")[2]}
                  </div>
                </div>

                <div className="flex px-3  py-2 rounded-lg justify-center sm:justify-between items-center gap-2 sm:gap-4 flex-wrap w-[290px] sm:w-[600px] ">
                  <div className="flex flex-col  items-center justify-center text-center rounded-lg flex-wrap w-[100px] sm:w-[180px]">
                    <div className="text-[12px] sm:text-[14px] font-bold">{expense.item}</div>
                    <div className="text-[8px] sm:text-[10px]">{expense.category}</div>
                  </div>

                  <div className="flex flex-col  items-center px-2 sm:px-4 py-1 rounded-lg flex-wrap">
                    <div className="text-[12px] sm:text-[14px] font-bold">
                      {expense.transferMode}
                    </div>
                    <div className="text-[8px] sm:text-[10px]">{expense.bankName}</div>
                  </div>
                  <div className="py-2 border mx-auto px-6 text-[10px] sm:text-[12px] rounded-lg w-full sm:w-[110px] text-center  bg-[#1c4959] shadow-lg">
                    ₹ {expense.amount}
                  </div>
                </div>

                <div className="flex">
                  <div><button
                      onClick={() => handleDeleteClick(expense._id)}
                      className="bg-red-500 text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md mr-2 hover:bg-red-600 transition duration-200"
                    >
                      <MdDelete />
                    </button></div>
                  <div> <button
                      onClick={() => handleEditClick(expense)}
                      className="bg-blue-500 text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200"
                    >
                      <FaEdit />
                    </button></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-[200px] shadow-lg bg-gray-200 mx-auto mt-10 p-4 rounded-lg mb-10 text-center">
            No data found
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            {loading ? (
              <Spinner />
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
