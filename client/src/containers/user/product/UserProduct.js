import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserProduct() {
  const query = useQuery();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  function getProducts() {
    axios
      .get("http://localhost:8082/product?departmentId=" + query.get("id"))
      .then((d) => {
        setProducts(d.data.prdData);
      })
      .catch((error) => {
        alert(error?.message);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  function renderProducts() {
    return products?.map((item) => {
      return (
        <div className="col-3">
          <div className="card">
            <img
              src={"http://localhost:8082/" + item.images[0]}
              height="300"
              width="362"
              alt="card-image cap"
            />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <h5 className="card-title">{item.description}</h5>
              <h5 className="card-title">{item.price}</h5>
              <button
                onClick={() => {
                  navigate(ROUTES.productDetail.name + "?id=" + item._id);
                }}
                className="btn btn-primary"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <div>
      <Header />
      <div className="row p-2 m-2">{renderProducts()}</div>
    </div>
  );
}

export default UserProduct;
