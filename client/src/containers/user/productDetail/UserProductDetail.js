import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function useQuery(){
    const{search}=useLocation();
  return React.useMemo(()=>
    new URLSearchParams(search),[search]);
}


function UserProductDetails() {
  const query=useQuery();
  const navigate=useNavigate();
  const[productDet,setProductDet]=useState(null);
  const [quantity, setQuantity] = useState(1);

  function getProductDetail()
  {
    axios.get("http://localhost:8082/productDetails?id=" + query.get("id")).then((d)=>{
      setProductDet(d.data.prdData)
    }).catch(error=>{
      alert(error?.message)
    })
    
  }
   useEffect(() => {
       getProductDetail();
       }, []);

       function renderimages()
       {
           return productDet?.images.map((item)=>{
            return(
              <img src={'http://localhost:8082/' + item}
              height="150px"  width="150px" />
            )
           })
       }

  function handleAddToCart() {
  const userId = sessionStorage.getItem("id");

  axios.post("http://localhost:8082/cart", {
    user: userId,
    product: query.get("id"),
    count: quantity
  })
  .then((res) => {
    alert("Product added to cart");
    navigate("/cart");
  })
  .catch((err) => {
    console.error("Add to cart error:", err);
    alert("Failed to add to cart");
  });
}

  return (
    <>
      <Header/>
      <div className='row p-2 m-2'>
        <div class="card mx-auto">
 <div style={{display:"flex", flexDirection:"row"}}>
  {renderimages()}
 </div>
  <div class="card-body">
    <h5 class="card-title">Product Name:{productDet?.name}</h5>
       <h5 class="card-title">Product Description:{productDet?.description}</h5>
          <h5 class="card-title">Product Price:{productDet?.price}</h5>
      <div className="form-group">
  <label>Quantity</label>
  <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    min="1"
    max={productDet?.qty}
    className="form-control"
  />
</div>
 <button className="btn btn-primary text-white" onClick={handleAddToCart}>
  Add to cart
</button>
  </div>
</div>
      </div>
    </>
  )
}

export default UserProductDetails