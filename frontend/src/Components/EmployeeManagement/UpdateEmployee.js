import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import SideBar from "../Home/SideBar";
function UpdateEmployee() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/employee/${id}`
        );
        setInputs(response.data.employee);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/employee/${id}`, {
        empID: String(inputs.empID),
        name: String(inputs.name),
        nic: String(inputs.nic),
        address: String(inputs.address),
        email: String(inputs.email),
        department: String(inputs.department),

        jobTitle: String(inputs.jobTitle),
        salary: String(inputs.salary),
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
      history("/employeeDash");
    });
  };
  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Update Employee </h1>
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

export default UpdateEmployee;
