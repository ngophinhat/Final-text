import React from "react";
import LoginForm from "../component/LoginForm";

const LoginPage = () => {
  const handleLogin = ({ username, password }) => {
    console.log("Dữ liệu login từ form:", username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
