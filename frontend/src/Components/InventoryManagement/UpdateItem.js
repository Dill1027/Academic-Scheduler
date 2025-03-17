import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import SideBar from "../Home/SideBar";

function UpdateItem() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/inventory/${id}`
        );
        setInputs(response.data.inventory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/inventory/${id}`, {
        InevnID: String(inputs.InevnID),
        name: String(inputs.name),
        type: String(inputs.type),
        quantity: String(inputs.quantity),
        Supplire: String(inputs.Supplire),
        Price: String(inputs.Price),
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
      history("/inventoryDash");
    });
  };
  return (
    <div>
      <div className="main_function">
        <div>
          <SideBar />
        </div>
        <div className="lef_child">
          <h1 className="main_topic_function">Add New Item </h1>
          <form className="from_data" onSubmit={handleSubmit}>
            <div className="">
              <label className="form_lable">Item ID:</label>
              <br />
              <input
                type="text"
                id="InevnID"
                name="InevnID"
                className="form_input"
                value={inputs.InevnID}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="">
              <label className="form_lable">Item Name:</label>
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
              <label className="form_lable" htmlFor="type">
                type:
              </label>
              <br />
              <input
                type="text"
                id="type"
                name="type"
                className="form_input"
                value={inputs.type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="">
              <label className="form_lable">quantity:</label>
              <br />
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form_input"
                value={inputs.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">Supplire Name:</label>
              <br />
              <input
                type="text"
                id="Supplire"
                name="Supplire"
                className="form_input"
                value={inputs.Supplire}
                onChange={handleChange}
                required
              />
            </div>
            <div className="">
              <label className="form_lable">Price $:</label>
              <br />
              <input
                type="number"
                id="Price"
                name="Price"
                className="form_input"
                value={inputs.Price}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="frombtn">
              Update Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateItem;
