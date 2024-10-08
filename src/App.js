import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import AddExpensePage from "./components/AddExpensePage";
import MonthlyAnalysisPage from "./components/MonthlyAnalysisPage";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <Router>
      <>
        {/*   <h1>Expense Tracker</h1> */}
     
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AddExpensePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/monthly-analysis"
            element={
              <ProtectedRoute>
                <MonthlyAnalysisPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
