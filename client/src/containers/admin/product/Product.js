import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation } from "react-router-dom";
import axios from "axios";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search, [search]));
}

function Product() {
  const query = useQuery();
  const [products, setProducts] = useState(null);
  const [productId, setProductId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    images: null,
    departmentId: query.get("id"),
    description: "",
    qty: 10,
    price: 0,
  });
  const [formError, setFormError] = useState({
    name: "",
    images: "",
    description: "",
    qty: "",
    price: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function getProductsByDepartment() {
    try {
      axios
        .get("http://localhost:8082/product?departmentId=" + query.get("id"))
        .then((d) => {
          setProducts(d.data.prdData);
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  useEffect(() => {
    getProductsByDepartment();
  }, []);

  function saveProduct() {
    try {
      const formData = new FormData();
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i], form.images[i].name);
      }
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("qty", form.qty);
      formData.append("price", form.price);
      formData.append("departmentId", form.departmentId);

     axios.post("http://localhost:8082/product", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  }
})

        .then((d) => {
          alert(d.data.message);
          getProductsByDepartment();
          resetForm();
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  function updateProduct() {
    try {
      const formData = new FormData();
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i], form.images[i].name);
      }
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("qty", form.qty);
      formData.append("price", form.price);
      formData.append("departmentId", form.departmentId);
      formData.append("id", productId);
    axios.put("http://localhost:8082/product", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  }
})

        .then((d) => {
          alert(d.data.message);
          getProductsByDepartment();
          resetForm();
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  function deleteProduct(id) {
    try {
      {
        let ans = window.confirm("want to delte product?");
        if (!ans) return;
        axios
          .delete("http://localhost:8082/product", { data: { id: id } })
          .then((d) => {
            alert(d.data.message);
            getProductsByDepartment();
          });
      }
    } catch (error) {
      alert(error?.message);
    }
  }

  function resetForm() {
    setForm({
      ...form,
      name: "",
      images: null,
      departmentId: query.get("id"),
      description: "",
      qty: 10,
      price: 0,
    });
  }

  function onProductSubmit(){
    let errors=false;
    let error={
      name:"",
      images:null,
      description:"",
      qty:"",
      price:""
    };
    if(form.name.trim().length==0)
    {
      errors=true
      error={...error,name:"pl enter name"};
    }
    if(form.description.length==0)
    {
      errors=true
      error={...error,description:"pl enter description"};
    }
    if(form.qty=="" || form.qty==0)
    {
      errors=true;
      error={...error,qty:"pl enter qty"};
    }
    if(form.price=="" || form.price==0)
    {
      errors=true;
      error={...error,price:"pl enter price"};
    }
    if(form.images==null)
    {
      errors=true;
      error={...error,images:"pl select image"};
    }
    if(errors)
    {
      setFormError(error);
    }
    else{
      setFormError(error);
      {
        productId? updateProduct() : saveProduct();
      }
    }
  }

  function renderProducts()
  {
    return products?.map((item)=>{
      return(
        <tr>
          <td>
            <img src={"http://localhost:8082/" + item.images[0]}
            height="150px" width="150px" />
          </td>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.price}</td>
          <td>{item.qty}</td>
          <td>
            <button onClick={()=>{
              deleteProduct(item._id);
            }} className='btn btn-danger'>Delete</button>
          </td>
          <td>
            <button onClick={()=>{
              setProductId(item._id)
              setForm({
                ...form,
                name:item.name,
                description:item.description,
                qty:item.qty,
                price:item.price,
              });
            }}
            className='btn btn-info'
            >Edit</button>
          </td>
        </tr>
      )
    })
  }

  return (
    <div>
      <Header />
      <div className="row p-2 m-2">
      <div className="card text-center mx-auto">
        <div className="card-header bg-info text-white">
          <b>{productId?"Edit Product":"New Product"}</b>
        </div>
        <div className="card-body">
          <div className="form-group row">
            <label class="col-4">Department Name</label>
            <div className="col-8">
              <input type="text" 
              disabled 
              value={query.get("name")}
              className="form-control"/>
             
            </div>
          </div>

          <div className='form-group row'>
            <label className='col-4'>Product Name</label>
            <div className='col-8'>
              <input type="text"
              name="name"
              value={form.name}
              className="form-control"
              onChange={changeHandler}  />
              <p className='text-danger'>{formError.name}</p>
            </div>
          </div>

          <div className='form-group row'>
            <label className='col-4'>Description</label>
            <div className='col-8'>
              <input type="text"
              name="description"
              value={form.description}
            className="form-control"
              onChange={changeHandler}  />
              <p className='text-danger'>{formError.description}</p>
            </div>
          </div>

          <div className='form-group row'>
            <label className='col-4'>Qty</label>
            <div className='col-8'>
              <input type="number"
              name="qty"      
              value={form.qty}
                className="form-control"
              onChange={changeHandler}  />
              <p className='text-danger'>{formError.qty}</p>
            </div>
          </div>
          <div className='form-group row'>
            <label className='col-4'>Price</label>
            <div className='col-8'>
              <input type="number"
              name="price"            
              value={form.price}
                className="form-control"
              onChange={changeHandler}  />
              <p className='text-danger'>{formError.price}</p>
            </div>
          </div>
          <div className='form-group row'>
            <label className='col-4'>Product Image</label>
            <div className='col8'>
              <input type="file"
              
              className='form-control'
              onChange={(e)=>{
                let files=e.target.files;
                setForm({...form, images: files});
              }} multiple name="images" />
              <p className='text-danger'>{formError.images}</p>
            </div>
          </div>

        </div>
         <div class="card-footer text-body-secondary">
            <button
              className="btn btn-info"
              onClick={() => {
                onProductSubmit();
              }}
            >
              {productId ? "Update" : "Save"}
            </button>
          </div>
      </div>
    </div>
       
  {/* Display Product List */}
    <div className='row border p-2 m-2'>
      <table className='table table-bordered table-striped table-hover'>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Delete</th>
          <th>Edit</th>
        </tr>
        </thead>
        <tbody>{renderProducts()}</tbody>
      </table>
    </div>
    </div>
  );
}

export default Product