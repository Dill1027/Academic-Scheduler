import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";
function AddEmployee() {
  const [inputs, setInputs] = useState({
    empID: "",
    name: "",
    nic: "",
    address: "",
    email: "",
    department: "",
    jobTitle: "",
    salary: "",
  });
  const generateID = () => {
    const prefix = "EID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      empID: generateID(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    window.location.href = "./EmployeeDash";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/employee", {
      empID: inputs.empID,
      name: inputs.name,
      nic: inputs.nic,
      address: inputs.address,
      email: inputs.email,
      department: inputs.department,
      jobTitle: inputs.jobTitle,
      salary: inputs.salary,
    });
  };
  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Add Employee </h1>
          <form className="from_data" onSubmit={handleSubmit}>
            <div className="">
              <label className="form_lable">Employe ID:</label>
              <br />
              <input
                type="text"
                id="empID"
                name="empID"
                className="form_input"
                value={inputs.empID}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="">
              <label className="form_lable">Employe name:</label>
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
              <label className="form_lable">NIC:</label>
              <br />
              <input
                type="text"
                id="nic"
                name="nic"
                className="form_input"
                value={inputs.nic}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">address:</label>
              <br />
              <input
                type="text"
                id="address"
                name="address"
                className="form_input"
                value={inputs.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">email:</label>
              <br />
              <input
                type="email"
                id="email"
                name="email"
                className="form_input"
                value={inputs.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">department:</label>
              <br />
              <input
                type="department"
                id="department"
                name="department"
                className="form_input"
                value={inputs.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">job Title :</label>
              <br />
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="form_input"
                value={inputs.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">salary $:</label>
              <br />
              <input
                type="text"
                id="salary"
                name="salary"
                className="form_input"
                value={inputs.salary}
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
  );
}

export default AddEmployee;
