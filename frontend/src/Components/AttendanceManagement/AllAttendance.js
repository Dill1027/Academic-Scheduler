import React from "react";
import SideBar from "../Home/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/notfound.jpg";

const URL = "http://localhost:8081/attendance";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function AllAttendance() {
  //fetch data
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setAttendance(data.attendance));
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
      const filtered = data.attendance.filter((attendance) =>
        Object.values(attendance).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setAttendance(filtered);
      setNoResults(filtered.length === 0);
    });
  };
  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("attendance Report", 20, 10);

    const columns = [
      "Attendance ID",
      "EmployeID",
      "Full name",
      "Date",
      "CheckIn",
      "CheckOut",

      "TotalHours",
      "status",
      "Leavetype",
    ];

    const rows = attendance.map((item) => [
      item.AttID,
      item.EmployeID,
      item.fullname,
      item.date,
      item.CheckIn,
      item.CheckOut,
      item.TotalHours,
      item.status,
      item.Leavetype,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("attendance.pdf");
  };
  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <div className="">
            <h1 className="main_topic_function">Attendance Details</h1>
            <div className="action_set">
              <button
                className="function_btn"
                onClick={() => (window.location.href = "/addAttendance")}
              >
                Add New Attendance
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
                      <th className="admin_table_th">Attendance ID</th>
                      <th className="admin_table_th">EmployeID</th>
                      <th className="admin_table_th">full name</th>
                      <th className="admin_table_th">date</th>
                      <th className="admin_table_th">CheckIn</th>
                      <th className="admin_table_th">CheckOut</th>
                      <th className="admin_table_th">TotalHours</th>

                      <th className="admin_table_th">status</th>
                      <th className="admin_table_th">Leavetype</th>
                      <th className="admin_table_th">action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((item, index) => (
                      <tr className="" key={index}>
                        <td className="admin_table_td">{item.AttID}</td>
                        <td className="admin_table_td">{item.EmployeID}</td>
                        <td className="admin_table_td">{item.fullname}</td>
                        <td className="admin_table_td">{item.date}</td>
                        <td className="admin_table_td">{item.CheckIn}</td>
                        <td className="admin_table_td">{item.CheckOut}</td>

                        <td className="admin_table_td">{item.TotalHours}</td>
                        <td className="admin_table_td">{item.status}</td>
                        <td className="admin_table_td">{item.Leavetype}</td>
                        <td className="admin_table_td tbl_btn">
                          <Link
                            className="update_btn"
                            to={`/updateAttendance/${item._id}`}
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
  );
}

export default AllAttendance;
