import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = sessionStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/cart?userId=${userId}`);
      setCartItems(res.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQty = (id, newQty) => {
  axios.put("http://localhost:8082/cart", { id, count: newQty })
    .then(() => fetchCart())
    .catch(err => alert("Failed to update quantity"));
};

const removeItem = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete("http://localhost:8082/cart", { data: { id } });
      fetchCart();
      Swal.fire(
        'Removed!',
        'Your item has been removed from cart.',
        'success'
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire(
        'Error!',
        'Failed to remove item from cart.',
        'error'
      );
    }
  }
};

  // const removeItem = async (id) => {
  //   if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

  //   try {
  //     await axios.delete("http://localhost:8082/cart", { data: { id } });
  //     fetchCart();
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //     alert("Failed to delete item.");
  //   }
  // };

  const renderCartItems = () => {
    let grandTotal = 0;

    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
            <h5>Shopping Cart</h5>
            <button className="btn btn-light btn-sm" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>

          <div className="card-body">
            {cartItems.map((item) => {
              const total = item.product.price * item.count;
              grandTotal += total;

              return (
                <div key={item._id} className="row border-bottom py-3">
                  <div className="col-md-1 d-none d-md-block">
                    <img
                      src={`http://localhost:8082/${item.product.images[0]}`}
                      width="60"
                      alt={item.product.name}
                      className="rounded"
                    />
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-1">{item.product.name}</h6>
                    <p className="text-muted mb-2">{item.product.description}</p>
                  </div>
                  <div className="col-md-3 text-md-end">
                    ₹{item.product.price} × {item.count} = ₹{total}
                  </div>
                <div className="d-flex align-items-center gap-2">
  <button
    className="btn btn-primary  m-2 p-2"
    disabled={item.count <= 1}
    onClick={() => updateQty(item._id, item.count - 1)}
  > <FontAwesomeIcon icon={faMinus} /></button>
  <button
    className="btn btn-warning m-2 p-2"
    onClick={() => updateQty(item._id, item.count + 1)}
  > <FontAwesomeIcon icon={faPlus} /></button>
</div>
 <button
    className="btn btn-danger  m-2 p-2"
    onClick={() => removeItem(item._id)}
  >
    <FontAwesomeIcon icon={faTrash} />
  </button>

                </div>
              );
            })}

            <div className="row mt-4">
              <div className="col text-end">
                <h5>Grand Total: ₹{grandTotal}</h5>
              </div>
            </div>
          </div>

          <div className="card-footer text-end">
            <button className="btn btn-success" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      {renderCartItems()}
    </>
  );
}

export default Cart;