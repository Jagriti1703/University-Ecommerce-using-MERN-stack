import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search, [search]));
}

function Department() {
  const query = useQuery();
  const [departments, setDepartments] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: null,
    university: query.get("id"),
  });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function getDepartmentsByUniversity() {
    try {
      axios
        .get("http://localhost:8082/department?universityId=" + query.get("id"))
        .then((d) => {
          setDepartments(d.data.depData);
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  useEffect(() => {
    getDepartmentsByUniversity();
  }, []);

  function saveDepartment() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", query.get("id"));
      axios
        .post("http://localhost:8082/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversity();
          resetForm();
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  function updateDepartment() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", query.get("id"));
      formData.append("id", departmentId);
      axios
        .put("http://localhost:8082/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversity();
          resetForm();
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  function deleteDepartment(id) {
    try {
      axios
        .delete("http://localhost:8082/department", { data: { id: id } })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversity();
        });
    } catch (error) {
      alert(error?.message);
    }
  }

  function resetForm() {
    setForm({ name: "", image: null });
  }

  function OnDepartmentSubmit() {
    let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length === 0) {
      errors = true;
      error = { ...error, name: "Name Empty!!" };
    }
    if (form.image === null) {
      errors = true;
      error = { ...error, image: "Please Select Image!!" };
    }
    if (errors) {
      setFormError(error);
    } else {
      setFormError(error);
      departmentId ? updateDepartment() : saveDepartment();
    }
  }

  function renderDepartments() {
    return departments?.map((item) => {
      return (
        <tr>
          <td>
            <img
              src={"http://localhost:8082/" + item.image}
              height="150px"
              width="200px"
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  ROUTES.productAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              Add Product
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setDepartmentId(item._id);
                setForm({ ...form, name: item.name });
              }}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteDepartment(item._id);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <Header />
      <div className="row m-2 p-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">
            {departmentId ? "Edit Department" : "New department"}
          </div>
          <div className="card-body">
            <div className="form-group row">
              <label className="col-4">University Name:</label>
              <div className="col-8">
                <input
                  type="text"
                  value={query.get("name")}
                  disabled
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">Department Name:</label>
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Department Name"
                  value={form.name}
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">Department Image:</label>
              <div className="col-8">
                <input
                  type="file"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    setForm({ ...form, image: file });
                  }}
                />
                <p className="text-danger">{formError.image}</p>
              </div>
            </div>
          </div>
          <div class="card-footer text-body-secondary">
            <button
              className="btn btn-info"
              onClick={() => {
                OnDepartmentSubmit();
              }}
            >
              {departmentId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="border m-2 p-2">
        <table className="table table-bordered table-striped table-active">
          <thead>
            <tr>
              <th>Department Image</th>
              <th>Department Name</th>
              <th>Add Product</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderDepartments()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Department;
