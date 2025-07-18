import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function Home() {
  const [universities, setUniversities] = useState(null);
  const navigate = useNavigate();

  function getUniversities() {
    axios
      .get("http://localhost:8082/university",
       {headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
  })
      .then((d) => {
        setUniversities(d.data.univData);
      })
      .catch((error) => {
        alert(error?.message);
      });
  }
  
  useEffect(()=>{
    getUniversities();
  },[]);

  function renderUniversities() {
  return universities
    ?.map((item) =>{
      return (
        <div className="col-3">
          <div class="card">
            <img
              class="card-img-top"
              src={"http://localhost:8082/" + item.image}
              height="300px"
              width="150px"
              alt="Card image cap"
            />
            <div class="card-body">
              <h3 class="card-title">{item.name}</h3>
              <a
                onClick={() => {
                  navigate(ROUTES.departmentUser.name + "?id=" + item._id);
                }}
                className="btn btn-primary text-white"
              
              >
                View Departments
              </a>
            </div>
          </div>
        </div>
      );
    });
}
  return (
    <div>
      <Header/>
      <div className="row m-2 p-2">
        {renderUniversities()}
        </div>
    </div>
  );
}

export default Home;
