import React from "react";
import { Route, Routes } from "react-router";
import Home from "./Components/Home/Home";
import AddItem from "./Components/InventoryManagement/AddItem";
import ItemsDetails from "./Components/InventoryManagement/ItemsDetails";
import UpdateItem from "./Components/InventoryManagement/UpdateItem";
import './App.css'
import AddAttendance from "./Components/AttendanceManagement/AddAttendance";
import AllAttendance from "./Components/AttendanceManagement/AllAttendance";
import UpdateAttendance from "./Components/AttendanceManagement/UpdateAttendance";
import AddEmployee from "./Components/EmployeeManagement/AddEmployee";
import AllEmployee from "./Components/EmployeeManagement/AllEmployee";
import UpdateEmployee from "./Components/EmployeeManagement/UpdateEmployee";
import AddOrder from "./Components/OrderManagement/AddOrder";
import AllOrder from "./Components/OrderManagement/AllOrder";
import UpdateOrder from "./Components/OrderManagement/UpdateOrder";
import AddSupplier from "./Components/SupplierManagement/AddSupplier";
import AllSupplier from "./Components/SupplierManagement/AllSupplier";
import UpdateSupplier from "./Components/SupplierManagement/UpdateSupplier";
function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          {/*Attendance */}
          <Route path="/addAttendance" element={<AddAttendance />} />
          <Route path="/AttendanceDash" element={<AllAttendance />} />
          <Route path="/updateAttendance/:id" element={<UpdateAttendance />} />
          {/*Employee */}
          <Route path="/addEmployee" element={<AddEmployee />} />
          <Route path="/EmployeeDash" element={<AllEmployee />} />
          <Route path="/updateEmployee/:id" element={<UpdateEmployee />} />
          {/*Inventory */}
          <Route path="/additem" element={<AddItem />} />
          <Route path="/inventoryDash" element={<ItemsDetails />} />
          <Route path="/updateItem/:id" element={<UpdateItem />} />
          {/*Order */}
          <Route path="/addOrder" element={<AddOrder />} />
          <Route path="/orderDash" element={<AllOrder />} />
          <Route path="/updateOrder/:id" element={<UpdateOrder />} />
          {/*Supplier */}
          <Route path="/addSupplier" element={<AddSupplier />} />
          <Route path="/SupplierDash" element={<AllSupplier />} />
          <Route path="/updateSupplier/:id" element={<UpdateSupplier />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
