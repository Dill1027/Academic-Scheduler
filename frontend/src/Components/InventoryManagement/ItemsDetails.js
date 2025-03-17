import React from "react";
import SideBar from "../Home/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/notfound.jpg";
const URL = "http://localhost:8081/inventory";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function ItemsDetails() {
  //fetch data
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setInventory(data.inventory));
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
      const filtered = data.inventory.filter((inventory) =>
        Object.values(inventory).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setInventory(filtered);
      setNoResults(filtered.length === 0);
    });
  };
  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("inventory Report", 20, 10);

    const columns = [
      "Item ID",
      "Item Name",
      "Type",
      "quantity",
      "Supplire",
      "Price",
    ];

    const rows = inventory.map((item) => [
      item.InevnID,
      item.name,
      item.type,
      item.quantity,
      item.Supplire,
      item.Price,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("Inventory Item Data.pdf");
  };
  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <div className="">
            <h1 className="main_topic_function">Inventory Details</h1>
            <div className="action_set">
              <button
                className="function_btn"
                onClick={() => (window.location.href = "/additem")}
              >
                Add New Item
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
              <table className="admin_table">
                <thead>
                  <tr className="">
                    <th className="admin_table_th">ID</th>
                    <th className="admin_table_th">Name</th>
                    <th className="admin_table_th">Type</th>
                    <th className="admin_table_th">Quantity</th>
                    <th className="admin_table_th">Supplire</th>
                    <th className="admin_table_th">Price</th>
                    <th className="admin_table_th">action</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item, index) => (
                    <tr className="" key={index}>
                      <td className="admin_table_td">{item.InevnID}</td>
                      <td className="admin_table_td">{item.name}</td>
                      <td className="admin_table_td">{item.type}</td>
                      <td className="admin_table_td">{item.quantity}</td>
                      <td className="admin_table_td">{item.Supplire}</td>
                      <td className="admin_table_td">${item.Price}</td>
                      <td className="admin_table_td tbl_btn">
                        <Link
                          className="update_btn"
                          to={`/updateItem/${item._id}`}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsDetails;
