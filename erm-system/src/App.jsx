import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Registration from './components/Registration';
import PatientsList from './components/PatientsList';
import PatientDetail from './components/PatientDetail';
import { useSelector } from 'react-redux';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Registration />} />
        {isAuthenticated ? (
          <>
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="*" element={<Navigate to="/patients" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
