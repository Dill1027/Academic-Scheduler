import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import SideBar from "../Home/SideBar";
function UpdateSupplier() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/supplier/${id}`);
        setInputs(response.data.supplier);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/supplier/${id}`, {
        supID: String(inputs.supID),
        name: String(inputs.name),
        email: String(inputs.email),
        phone: String(inputs.phone),
        address: String(inputs.address),
      })
      .then((res) => res.data);
  };
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
      window.alert(" Updated successfully!");
      history("/supplierDash");
    });
  };
  return (
    <div>
         <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Updte Supplier </h1>
          <form className="from_data" onSubmit={handleSubmit}>
            <div className="">
              <label className="form_lable"> ID:</label>
              <br />
              <input
                type="text"
                id="supID"
                name="supID"
                className="form_input"
                value={inputs.supID}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="">
              <label className="form_lable">name:</label>
              <br />
              <input
                type="text"
                id="name"
                name="name"
                className="form_input"
                value={inputs.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">email:</label>
              <br />
              <input
                type="text"
                id="email"
                name="email"
                className="form_input"
                value={inputs.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">phone:</label>
              <br />
              <input
                type="number"
                id="phone"
                name="phone"
                className="form_input"
                value={inputs.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">address:</label>
              <br />
              <input
                type="txet"
                id="address"
                name="address"
                className="form_input"
                value={inputs.address}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="frombtn">
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateSupplier
