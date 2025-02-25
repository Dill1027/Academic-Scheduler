import React from "react";
import SideBar from "../Home/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/notfound.jpg";
const URL = "http://localhost:8081/employee";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function AllEmployee() {
  //fetch data
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setEmployee(data.employee));
  }, []);
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Data?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert(" Delete successfully!");
        window.location.reload();
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };
  /*Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.employee.filter((employee) =>
        Object.values(employee).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setEmployee(filtered);
      setNoResults(filtered.length === 0);
    });
  };
  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("Employee Report", 20, 10);

    const columns = [
      "EmployeID",
      "Full name",
      "NIC",
      "address",
      "email",

      "department",
      "jobTitle",
      "salary",
    ];

    const rows = employee.map((item) => [
      item.empID,
      item.name,
      item.nic,
      item.address,
      item.email,
      item.department,
      item.jobTitle,
      item.salary,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("employee.pdf");
  };
  return (
    <div>
      <div>
        <div className="main_function">
          <div>
            <SideBar />
          </div>
          <div className="lef_child">
            <div className="">
              <h1 className="main_topic_function">Employe Details</h1>
              <div className="action_set">
                <button
                  className="function_btn"
                  onClick={() => (window.location.href = "/addEmployee")}
                >
                  Add New Employe
                </button>
                <tr>
                  <td className="">
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      name="search"
                      className="search_bar"
                      placeholder="Search Here..."
                    ></input>
                  </td>

                  <td>
                    <button onClick={handleSearch} className="search_btn">
                      Search
                    </button>
                  </td>
                </tr>
                <button className="function_btn" onClick={handleGenerateReport}>
                  Generate Report
                </button>
              </div>
              <br /> <br />
              {noResults ? (
                <div className="">
                  <img src={NotFound} alt="noimg" className="nofoundimg" />
                  <p className="nopeara">No Details Found</p>
                </div>
              ) : (
                <div className="table_container">
                  <table className="admin_table">
                    <thead>
                      <tr className="">
                        <th className="admin_table_th">EmployeID</th>
                        <th className="admin_table_th">full name</th>
                        <th className="admin_table_th">nic</th>
                        <th className="admin_table_th">address</th>
                        <th className="admin_table_th">email</th>
                        <th className="admin_table_th">department</th>

                        <th className="admin_table_th">jobTitle</th>
                        <th className="admin_table_th">salary</th>
                        <th className="admin_table_th">action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {employee.map((item, index) => (
                        <tr className="" key={index}>
                          <td className="admin_table_td">{item.empID}</td>
                          <td className="admin_table_td">{item.name}</td>
                          <td className="admin_table_td">{item.nic}</td>
                          <td className="admin_table_td">{item.address}</td>
                          <td className="admin_table_td">{item.email}</td>
                          <td className="admin_table_td">{item.department}</td>

                          <td className="admin_table_td">{item.jobTitle}</td>
                          <td className="admin_table_td">{item.salary}</td>
                          <td className="admin_table_td tbl_btn">
                            <Link
                              className="update_btn"
                              to={`/updateEmployee/${item._id}`}
                            >
                              Update
                            </Link>
                            <button
                              onClick={() => deleteHandler(item._id)}
                              className="dltbtn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllEmployee;
