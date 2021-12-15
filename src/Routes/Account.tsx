import React from "react";
import { Outlet } from "react-router-dom";

const Account = () => {
  return (
    <div>
      <Outlet />
      <h1>Account Management</h1>
    </div>
  );
};

export default Account;
