import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import SideBar from "../Home/SideBar";
function UpdateOrder() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/order/${id}`);
        setInputs(response.data.order);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/order/${id}`, {
        OrderID: String(inputs.OrderID),
        SupplierID: String(inputs.SupplierID),
        SupplierName: String(inputs.SupplierName),
        QuantityOrder: String(inputs.QuantityOrder),
        total: String(inputs.total),
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
      history("/orderDash");
    });
  };
  return (
    <div>
      {" "}
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Add Order </h1>
          <form className="from_data" onSubmit={handleSubmit}>
            <div className="">
              <label className="form_lable">Order ID:</label>
              <br />
              <input
                type="text"
                id="OrderID"
                name="OrderID"
                className="form_input"
                value={inputs.OrderID}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="">
              <label className="form_lable">SupplierID:</label>
              <br />
              <input
                type="text"
                id="SupplierID"
                name="SupplierID"
                className="form_input"
                value={inputs.SupplierID}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">Supplier Name:</label>
              <br />
              <input
                type="text"
                id="SupplierName"
                name="SupplierName"
                className="form_input"
                value={inputs.SupplierName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">Quantity Order:</label>
              <br />
              <input
                type="number"
                id="QuantityOrder"
                name="QuantityOrder"
                className="form_input"
                value={inputs.QuantityOrder}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">total $:</label>
              <br />
              <input
                type="number"
                id="total"
                name="total"
                className="form_input"
                value={inputs.total}
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

export default UpdateOrder;
