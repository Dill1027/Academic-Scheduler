import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";

function AddOrder() {
  const [inputs, setInputs] = useState({
    OrderID: "",
    SupplierID: "",
    SupplierName: "",
    QuantityOrder: "",
    total: "",
  });

  const generateID = () => {
    const prefix = "OID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      OrderID: generateID(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "SupplierName") {
      // Allow only alphabetic characters and spaces for Supplier Name
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) return; // Prevent invalid input
    }

    if (name === "QuantityOrder" || name === "total") {
      // Allow only numbers for Quantity Order and total
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return; // Prevent invalid input
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    window.alert("Submit successfully!");
    window.location.href = "./orderDash";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/order", {
      OrderID: inputs.OrderID,
      SupplierID: inputs.SupplierID,
      SupplierName: inputs.SupplierName,
      QuantityOrder: inputs.QuantityOrder,
      total: inputs.total,
    });
  };

  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Add Order </h1>
          <form className="from_data" onSubmit={handleSubmit}>
            <div className="">
              <label className="form_lable">Order ID:</label>
              <br />
              <input
                type="text"
                id="OrderID"
                name="OrderID"
                className="form_input"
                value={inputs.OrderID}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="">
              <label className="form_lable">Supplier ID:</label>
              <br />
              <input
                type="text"
                id="SupplierID"
                name="SupplierID"
                className="form_input"
                value={inputs.SupplierID}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">Supplier Name:</label>
              <br />
              <input
                type="text"
                id="SupplierName"
                name="SupplierName"
                className="form_input"
                value={inputs.SupplierName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">Quantity Order:</label>
              <br />
              <input
                type="number"
                id="QuantityOrder"
                name="QuantityOrder"
                className="form_input"
                value={inputs.QuantityOrder}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">Total $:</label>
              <br />
              <input
                type="number"
                id="total"
                name="total"
                className="form_input"
                value={inputs.total}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="frombtn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddOrder;
