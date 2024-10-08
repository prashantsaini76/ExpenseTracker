import { useState } from 'react';
import { VscGraph } from "react-icons/vsc";
import { IoAddCircle, IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { GrPowerShutdown } from "react-icons/gr";
import ExportToPdf from "./ExportToPdf";
import ExportToExcel from "./ExportToExcel";
import { Navigate, useNavigate } from "react-router";
const NavigationBar = ({expenses}) => {
    const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="bg-[#05aeee] p-4 mt-4 w-[90%] mx-auto mb-4 text-white shadow-lg rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Title */}
        <div className="text-white text-lg font-bold">
          Expense Manager
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="hidden lg:flex lg:space-x-6">
        <button className="p-2 rounded-lg shadow-xl bg-[#1c4959]"   onClick={() => navigate("/add-expense")}>
            <div className="flex items-center gap-1">
              <IoAddCircle />
              <div className="sm:text-[12px] text-[10px]">Add Expenses</div>
            </div>
          </button>
          <button className="p-2 rounded-lg shadow-xl bg-[#1c4959]"  onClick={() => navigate("/monthly-analysis")} >
            <div className="flex items-center gap-1">
              <VscGraph />
              <div className="sm:text-[12px] text-[10px]">Monthly Analysis</div>
            </div>
          </button>
          <button className="p-2 rounded-lg shadow-xl bg-[#1c4959]">
            <div className="flex items-center gap-1">
              <ExportToExcel tableData={expenses} />
             
            </div>
          </button>
        </div>

        {/* Right Section: Logout */}
        <div className="hidden lg:block">
        <button className="p-2 rounded-lg shadow-xl bg-[#921f1f]" onClick={handleLogout}>
            <div className="flex items-center gap-1">
              <GrPowerShutdown />
              <div className="sm:text-[12px] text-[10px]">Logout</div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-4 mt-4">
         
        <button className="p-2 rounded-lg block"   onClick={() => navigate("/add-expense")}>
            <div className="flex items-center gap-1">
              <IoAddCircle />
              <div className="sm:text-[12px] text-[10px]">Add Expenses</div>
            </div>
          </button>

         <button className="p-2 rounded-lg block"  onClick={() => navigate("/monthly-analysis")} >
            <div className="flex items-center gap-1">
              <VscGraph />
              <div className="sm:text-[12px] text-[10px]">Monthly Analysis</div>
            </div>
          </button>
          <button className="p-2 rounded-lg block">
            <div className="flex items-center gap-1">
              <ExportToExcel tableData={expenses} />
            
            </div>
          </button>
         <button className="p-2 rounded-lg block" onClick={handleLogout}>
				<div className="flex items-center gap-1">
				  <GrPowerShutdown />
				  <div className="sm:text-[12px] text-[10px]">Logout</div>
				</div>
			  </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
