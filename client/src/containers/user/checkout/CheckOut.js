import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { loadStripe } from "@stripe/stripe-js";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id");

  const [form, setForm] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: ""
  });

  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
  axios
    .get(`http://localhost:8082/cart?userId=${userId}`)
    .then((res) => {
      const items = res.data.cartItems;
      setCartItems(items); // ✅ Save for Stripe session

      const total = items.reduce((sum, item) => {
        return sum + item.product.price * item.count;
      }, 0);
      setGrandTotal(total);
    })
    .catch((err) => {
      console.error("Failed to fetch cart:", err);
      alert("Unable to calculate total.");
    });
}, [userId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  
const stripePromise = loadStripe("pk_test_51PiBQCCcB85XwIzQOosAOE9SPqyyfjaqcj6sVnfFJC51abzzvxpO5ZAO9ms9QvKRKJlwuhYiPEfxtgYLzmsMLEe400MWG4TLIP");

const handlePay = async () => {
  const stripe = await stripePromise;
  const res = await axios.post("http://localhost:8082/create-checkout-session", {
    userId,
    shippingInfo: form,
    cartItems // include count and product data
  });
localStorage.setItem("shippingInfo", JSON.stringify(form));
  await stripe.redirectToCheckout({ sessionId: res.data.id });
};


  return (
    <>
      <Header />
      <div className="container mt-4">
        <h3 className="btb btn-primary">Shipping Details</h3>
        <div className="card p-4 shadow-sm mb-4">
          <div className="form-group row">
            <label class="col-4">Name</label>
            <div class="col-8">
            <input 
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            </div>
          </div>
          <div className="form-group row">
            <label class="col-4">Street Address</label>
            <div class="col-8">
            <input
              className="form-control"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
            />
            </div>
          </div>
          <div className="form-group row ">
              <label class="col-4">City</label>
               <div class="col-8">
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
              </div>
          
            </div>
              <div className="form-group row ">
        
              <label class="col-4">State</label>
               <div class="col-8">
              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
              </div>
            </div>
        
             <div className="form-group row ">
              <label class="col-4">Postal Code</label>
               <div class="col-8">
              <input
                className="form-control"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
              </div>
            </div>
        
          <div className="form-group row">
            <label class="col-4">Phone Number</label>
             < div class="col-8">
            <input
              className="form-control"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
            </div>
          </div>

          <h5 className="text-end">Grand Total: ₹{grandTotal}</h5>
       <button className="btn btn-success w-100" onClick={handlePay}>
  Pay ₹{grandTotal}
</button>
        </div>
      
</div>
    </>
  );
}

export default Checkout;