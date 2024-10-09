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
    <nav className="bg-[#212a31] p-4 mt-4 w-[90%] mx-auto mb-8 text-white shadow-lg rounded-lg">
      <div className="container mx-auto flex justify-center items-center">
        {/* Left Section: Title */}
       

        {/* Middle Section: Navigation Links */}
        <div className="flex lg:flex gap-1 lg:space-x-6">
        <button className="p-1 sm:p-2 rounded-lg shadow-xl bg-[#1c4959]"   onClick={() => navigate("/add-expense")}>
            <div className="flex items-center gap-1">
              <IoAddCircle />
              <div className="sm:text-[12px] text-[10px]">Add Expenses</div>
            </div>
          </button>
          <button className="p-1 sm:p-2 rounded-lg shadow-xl bg-[#1c4959] "  onClick={() => navigate("/monthly-analysis")} >
            <div className="flex items-center gap-1">
              <VscGraph />
              <div className="sm:text-[12px] text-[10px]">Monthly Analysis</div>
            </div>
          </button>
          <button className="p-1 sm:p-2 rounded-lg shadow-xl bg-[#1c4959]">
            <div className="flex items-center gap-1">
              <ExportToExcel tableData={expenses} />
             
            </div>
          </button>

          <button className="p-1 sm:p-2 rounded-lg shadow-xl bg-[#921f1f]" onClick={handleLogout}>
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
