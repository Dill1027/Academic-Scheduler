import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";
function AddItem() {
  const [inputs, setInputs] = useState({
    InevnID: "",
    name: "",
    type: "",
    quantity: "",
    Supplire: "",
    Price: "",
  });
  const generateItemID = () => {
    const prefix = "IID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      InevnID: generateItemID(),
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
    window.alert("Item Added successfully!");
    window.location.href = "./inventoryDash";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/inventory", {
      InevnID: inputs.InevnID,
      name: inputs.name,
      type: inputs.type,
      quantity: inputs.quantity,
      Supplire: inputs.Supplire,
      Price: inputs.Price,
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
                value={inputs.name}onChange={handleChange}
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
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
