import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";
function AddAttendance() {
  const [inputs, setInputs] = useState({
    AttID: "",
    EmployeID: "",
    fullname: "",
    CheckIn: "",
    CheckOut: "",
    TotalHours: "",
    status: "",
    Leavetype: "",
  });
  const generateID = () => {
    const prefix = "AID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      AttID: generateID(),
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
    window.location.href = "./AttendanceDash";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/attendance", {
      AttID: inputs.AttID,
      EmployeID: inputs.EmployeID,
      fullname: inputs.fullname,
      date: inputs.date,
      CheckIn: inputs.CheckIn,
      CheckOut: inputs.CheckOut,
      TotalHours: inputs.TotalHours,
      status: inputs.status,
      Leavetype: inputs.Leavetype,
    });
  };

  return (
    <div>
      <div>
        <div className="main_function">
          <div>
            <SideBar />
          </div>
          <div className="lef_child">
            <h1 className="main_topic_function">Add Attendance </h1>
            <form className="from_data" onSubmit={handleSubmit}>
              <div className="">
                <label className="form_lable">Attendance ID:</label>
                <br />
                <input
                  type="text"
                  id="AttID"
                  name="AttID"
                  className="form_input"
                  value={inputs.AttID}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="">
                <label className="form_lable">EmployeID:</label>
                <br />
                <input
                  type="text"
                  id="EmployeID"
                  name="EmployeID"
                  className="form_input"
                  value={inputs.EmployeID}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="form_lable">Full Name:</label>
                <br />
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form_input"
                  value={inputs.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="">
                <label className="form_lable">date:</label>
                <br />
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form_input"
                  value={inputs.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="form_lable">CheckIn:</label>
                <br />
                <input
                  type="date"
                  id="CheckIn"
                  name="CheckIn"
                  className="form_input"
                  value={inputs.CheckIn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="form_lable">CheckOut:</label>
                <br />
                <input
                  type="date"
                  id="CheckOut"
                  name="CheckOut"
                  className="form_input"
                  value={inputs.CheckOut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="">
                <label className="form_lable">Total Hours:</label>
                <br />
                <input
                  type="number"
                  id="TotalHours"
                  name="TotalHours"
                  className="form_input"
                  value={inputs.TotalHours}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="form_lable">status:</label>
                <br />
                <input
                  type="text"
                  id="status"
                  name="status"
                  className="form_input"
                  value={inputs.status}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="form_lable">Leavetype:</label>
                <br />
                <input
                  type="text"
                  id="Leavetype"
                  name="Leavetype"
                  className="form_input"
                  value={inputs.Leavetype}
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
    </div>
  );
}

export default AddAttendance;
