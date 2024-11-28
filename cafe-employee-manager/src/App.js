import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CafesPage from './components/pages/CafesPage';
import EmployeesPage from './components/pages/EmployeesPage';
import useHideUnimportantErrors from './components/hooks/useHideUnimportantErrors';
import Menu from './components/pages/Menu';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Alpine theme styles

const App = () => {
  useHideUnimportantErrors();
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<CafesPage />} />
        <Route path="/employees/:cafeId" element={<EmployeesPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
