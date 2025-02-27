import React from "react";
import SideBar from "../Home/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/notfound.jpg";
import './AllSupplier.css';
import Logo from "./img/companylogo.png"; // Ensure the logo path is correct

const URL = "http://localhost:8081/supplier";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function AllSupplier() {
  const [supplier, setSupplier] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setSupplier(data.supplier));
  }, []);

  // UseEffect to handle search query filtering
  useEffect(() => {
    fetchHandler().then((data) => {
      const filtered = data.supplier.filter((supplier) =>
        Object.values(supplier).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSupplier(filtered);
      setNoResults(filtered.length === 0);
    });
  }, [searchQuery]); // Trigger search on searchQuery change

  const deleteHandler = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Data?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Delete successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting details:", error);
      }
    }
  };

  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    // Add company logo (place logo at top-left)
    const imgData = Logo;
    doc.addImage(imgData, "PNG", 10, 10, 30, 30); // x, y, width, height
    
    // Add report title
    doc.setFontSize(18);
    doc.text("Supplier Report", 80, 20);
    
    // Add current date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 150, 30); // Place date at top-right
    
    // Table columns and rows
    const columns = ["Supplier ID", "Name", "Email", "Phone", "Address"];
    const rows = supplier.map((item) => [
      item.supID,
      item.name,
      item.email,
      item.phone,
      item.address,
    ]);

    // Generate table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 50, // Start below the title and logo
    });

    // Add space for signature
    doc.text("Authorized Signature: __________________", 20, doc.lastAutoTable.finalY + 20);

    // Save the generated PDF
    doc.save("supplier_report.pdf");
  };

  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <div className="">
            <h1 className="main_topic_function">Supplier Details</h1>
            <div className="action_set">
              <button
                className="function_btn"
                onClick={() => (window.location.href = "/addSupplier")}
              >
                Add New Supplier
              </button>
              <tr>
                <td className="">
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)} // Updates search query as user types
                    type="text"
                    name="search"
                    className="search_bar"
                    placeholder="Search Here..."
                  ></input>
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
                      <th className="admin_table_th">Supplier ID</th>
                      <th className="admin_table_th">Name</th>
                      <th className="admin_table_th">Email</th>
                      <th className="admin_table_th">Phone</th>
                      <th className="admin_table_th">Address</th>
                    </tr>
                  </thead>

                  <tbody>
                    {supplier.map((item, index) => (
                      <tr className="" key={index}>
                        <td className="admin_table_td">{item.supID}</td>
                        <td className="admin_table_td">{item.name}</td>
                        <td className="admin_table_td">{item.email}</td>
                        <td className="admin_table_td">{item.phone}</td>
                        <td className="admin_table_td">{item.address}</td>
                        <td className="admin_table_td tbl_btn">
                          <Link
                            className="update_btn"
                            to={`/updateSupplier/${item._id}`}
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

export default AllSupplier;
