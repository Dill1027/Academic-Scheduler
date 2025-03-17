import React from "react";
import SideBar from "../Home/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/notfound.jpg";
import Logo from "./img/companylogo.png"; // Ensure the path to the logo is correct
const URL = "http://localhost:8081/order";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function AllOrder() {
  const [order, setOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setOrder(data.order));
  }, []);

  // UseEffect to handle search query filtering
  useEffect(() => {
    fetchHandler().then((data) => {
      const filtered = data.order.filter((order) =>
        Object.values(order).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setOrder(filtered);
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
    
    // Add company logo (ensure the path is correct)
    const imgData = Logo; 
    doc.addImage(imgData, "PNG", 10, 10, 30, 30); // Place logo at (x: 10, y: 10), size 30x30

    // Add report title and date
    doc.setFontSize(18);
    doc.text("Order Report", 80, 20);
    
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 150, 30); // Place date at the top right corner

    const columns = ["OrderID", "SupplierID", "SupplierName", "QuantityOrder", "total"];
    const rows = order.map((item) => [
      item.OrderID,
      item.SupplierID,
      item.SupplierName,
      item.QuantityOrder,
      item.total,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 50, // Start after the logo and title
    });

    // Signature area
    doc.text("Authorized Signature: __________________", 20, doc.lastAutoTable.finalY + 20);

    // Save the generated PDF
    doc.save("order_report.pdf");
  };

  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <div className="">
            <h1 className="main_topic_function">Order Details</h1>
            <div className="action_set">
              <button
                className="function_btn"
                onClick={() => (window.location.href = "/addOrder")}
              >
                Add New Order
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
                      <th className="admin_table_th">OrderID</th>
                      <th className="admin_table_th">SupplierID</th>
                      <th className="admin_table_th">SupplierName</th>
                      <th className="admin_table_th">QuantityOrder</th>
                      <th className="admin_table_th">total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((item, index) => (
                      <tr className="" key={index}>
                        <td className="admin_table_td">{item.OrderID}</td>
                        <td className="admin_table_td">{item.SupplierID}</td>
                        <td className="admin_table_td">{item.SupplierName}</td>
                        <td className="admin_table_td">{item.QuantityOrder}</td>
                        <td className="admin_table_td">{item.total}</td>
                        <td className="admin_table_td tbl_btn">
                          <Link
                            className="update_btn"
                            to={`/updateOrder/${item._id}`}
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

export default AllOrder;
