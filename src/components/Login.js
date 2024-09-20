import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Apiconfig from "../config/Apiconfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Debug useEffect to log state changes
 /*  useEffect(() => {
    console.log("isOpen state changed:", isOpen);
  }, [isOpen]); */

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log("Login attempt started");

    const loginRequest = {
      user: username,
      pwd: password,
    };

    try {
      const response = await axios.post(
        `${Apiconfig.BASE_URL}/auth`,
        loginRequest
      );

     // console.log("Login response:", response.data);
      localStorage.setItem("authToken", response?.data?.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in", error);
      setIsOpen(true);
      setError(error?.message);
      console.log("Modal should open now. isOpen set to:", true);
    } finally {
      setIsLoading(false);
      console.log("Login attempt finished. isLoading set to:", false);
    }
  }, [username, password, navigate]);

  const toggleModal = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    console.log("toggleModal called. New isOpen value:", !isOpen);
  }, [isOpen]);

  //console.log("Rendering Login component. isOpen:", isOpen);

  return (
    <div className="sm:min-h-screen sm:bg-gray-100 flex justify-center items-center mt-[200px] sm:mt-0">
      <div className="flex flex-col flex-shrink gap-4 mx-auto w-[300px] sm:w-[500px] shadow-lg items-center justify-center bg-white rounded-lg px-8 py-[50px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="w-full">
          <div className="w-full mb-4">
            
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={username}
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="w-full mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="border-none w-full p-3 rounded-2xl bg-black text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        
        </form>
        <div>Not having an account? <Link to='/Register'><span className="underline text-blue-600">Sign Up</span></Link> here </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[300px]">
            <div className="p-5 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Login Failed</h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
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
    </div>
  );
};

export default Login;