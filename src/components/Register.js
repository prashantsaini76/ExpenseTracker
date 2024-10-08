import React, { useCallback, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Apiconfig from "../config/Apiconfig";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // Validate if password and confirm password match
    if (password !== confirmPassword) {
      setIsOpen(true);
      setIsLoading(false);
      setError("Passwords do not match");
      return;
    }

    setError(""); // Clear any previous error

    const registerRequest = {
      user: username,
      pwd: password,
    };

    try {
      // Make the registration API call
      const response = await axios.post(
        `${Apiconfig.BASE_URL}/register`,
        registerRequest
      );
      setIsLoading(false);
      // If registration is successful, show success message

      setSuccessMessage("Registration successful! You can now login.");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setIsLoading(false);
      console.error("Error during registration:", error);
      setError(error?.message);
      setIsOpen(true);
    }
  };

  const toggleModal = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    console.log("toggleModal called. New isOpen value:", !isOpen);
  }, [isOpen]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="sm:min-h-screen sm:bg-[#181c2c] flex justify-center items-center mt-[200px] sm:mt-0">
          <div className="p-8 rounded-lg shadow-lg w-[300px] sm:w-[400px] bg-[#080b17]">
            <h2 className="text-2xl font-bold text-white mb-6">
              {successMessage ? "Success" : "Create Account"}
            </h2>

            {successMessage && (
              <p className="text-green-500 mb-4">{successMessage}</p>
            )}
            {!successMessage && (
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                 
                  <input
                    type="text"
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                 
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#05aeee] text-white px-4 py-3 rounded-lg transition duration-200"
                >
                  Register
                </button>
                <br/><br/>
                <div className="text-white">Already have an account? <Link to='/login'><span className="underline text-blue-600">Login</span></Link> here </div>                     
              </form>
              
            )}
            {successMessage && (
              <p className="mt-4 text-sm text-gray-600">
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Click here to login
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[300px]">
            <div className="p-5 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Registration Failed</h2>
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

export default Register;
