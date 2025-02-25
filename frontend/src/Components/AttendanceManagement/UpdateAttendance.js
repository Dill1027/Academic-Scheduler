import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import SideBar from "../Home/SideBar";
function UpdateAttendance() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/attendance/${id}`
        );
        setInputs(response.data.attendance);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/attendance/${id}`, {
        AttID: String(inputs.AttID),
        EmployeID: String(inputs.EmployeID),
        fullname: String(inputs.fullname),
        date: String(inputs.date),
        CheckIn: String(inputs.CheckIn),
        CheckOut: String(inputs.CheckOut),

        TotalHours: String(inputs.TotalHours),
        status: String(inputs.status),
        Leavetype: String(inputs.Leavetype),
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
      history("/AttendanceDash");
    });
  };
  return (
    <div>
      {" "}
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
               Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAttendance;
