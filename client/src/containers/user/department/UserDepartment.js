import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import ROUTES from '../../../navigations/Routes';
import axios from 'axios';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const query = useQuery();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState(null);

  function getDepartmentsByUniversity() {
    axios
      .get(
        "http://localhost:8082/department?universityId=" + query.get("id")
      )
      .then((d) => {
        setDepartments(d.data.depData);
      })
      .catch((error) => {
        alert(error?.message);
      });
  }

  useEffect(() => {
    getDepartmentsByUniversity();
  }, []);

  function renderDepartment() {
    return departments?.map((item) => {
      return (
        <div key={item._id} className="col-3">
          <div className="card">
            <img
              className="card-img-top"
              src={"http://localhost:8082/" + item.image}
              height="300"
              width="150"
              alt="Card image cap"
            />
            <div className="card-body">
              <h3 className="card-title">{item.name}</h3>
              <button
                onClick={() => {
                  navigate(
                    ROUTES.productUser.name + "?id=" + item._id
                  );
                }}
                className="btn btn-primary"
              >
                View Product
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
      <div className="row p-2 m-2">{renderDepartment()}</div>
    </div>
  );
}

export default UserDepartment;
