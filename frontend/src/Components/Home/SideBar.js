import React from "react";
import Logo from "./img/logo.png";

import { useLocation } from "react-router-dom";
function SideBar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_item_set_active" : "";

  return (
    <div className="side_bar_full">
      <div className="logo_set">
        <img src={Logo} alt="Logo" className="logo_side" />
        <p className="sub_logo">AMMS</p>
      </div>
      <p
        className={`nav_item_set ${isActive("/")}`}
        onClick={() => (window.location.href = "/")}
      >
        Home
      </p>
      <p
        className={`nav_item_set ${isActive("/AttendanceDash")}`}
        onClick={() => (window.location.href = "/AttendanceDash")}
      >
        Attendance
      </p>
      <p
        className={`nav_item_set ${isActive("/employeeDash")}`}
        onClick={() => (window.location.href = "/employeeDash")}
      >
        Employee
      </p>
      <p
        className={`nav_item_set ${isActive("/inventoryDash")}`}
        onClick={() => (window.location.href = "/inventoryDash")}
      >
        Inventory
      </p>
      <p
        className={`nav_item_set ${isActive("/orderDash")}`}
        onClick={() => (window.location.href = "/orderDash")}
      >
        Order
      </p>
      <p
        className={`nav_item_set ${isActive("/supplierDash")}`}
        onClick={() => (window.location.href = "/supplierDash")}
      >
        Supplier
      </p>
    </div>
  );
}

export default SideBar;
