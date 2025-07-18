import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function University() {
  const [universities, setUniversities] = useState(null);
  const [form, setForm] = useState({ name: "", image: null });
  const [formError, setFormError] = useState({ name: "", image: null });
  const [universityId, setUniversityId] = useState(null);
  const navigate = useNavigate();

  function getUniversities() {
    try {
      axios.get("http://localhost:8082/university").then((d) => {
        setUniversities(d.data.univData);
      });
    } catch (error) {
      alert("Unable to access API!!");
    }
  }

  useEffect(() => {
    getUniversities();
  }, []);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function saveUniversity() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      axios
        .post("http://localhost:8082/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getUniversities();
          resetForm();
        });
    } catch (error) {
      alert("Unable to access API!!");
    }
  }

  function updateUniversity() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("id", universityId);
      axios
        .put("http://localhost:8082/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getUniversities();
          resetForm();
        });
    } catch (error) {
      alert("Unable to access API!!");
    }
  }

  function deleteUniversity(id) {
    try {
      let ans = window.confirm("Want to Delete Data? ");
      if (!ans) return;
      axios
        .delete("http://localhost:8082/university", { data: { id: id } })
        .then((d) => {
          alert(d.data.message);
          getUniversities();
        });
    } catch (error) {
      alert("Unable to access API!!!!");
    }
  }

  function resetForm() {
    setForm({ name: "", image: null });
  }

  function onUniversitySubmit()
  {
     let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length == 0) {
      errors = true;
      error = { ...error, name: "University Name Empty!!" };
    }
    if (form.image == null) {
      errors = true;
      error = { ...error, image: "Please Select Image!!" };
    }
    if (errors) {
      setFormError(error);
    } else {
      setFormError(error);
      universityId ? updateUniversity() : saveUniversity();
    }
  }

function renderUniversities() {
    return universities?.map((item) => {
      return (
        <tr>
          <td>
            <img src={"http://localhost:8082/" + item.image} />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  ROUTES.departmentAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              Add Department
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setUniversityId(item._id);
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
                deleteUniversity(item._id);
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
      <div className="row p-2 m-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">
            {universityId ? "Edit University" : "New University"}
          </div>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-4">University Name</label>
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  onChange={changeHandler}
                  value={form.name}
                />
              </div>
            </div>
            <p className="text-danger">{formError.name}</p>
            <div className="form-group row">
              <label className="col-4">University Image</label>
              <div className="col-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    setForm({ ...form, image: file });
                  }}
                />
              </div>
            </div>
              <p className="text-danger">{formError.image}</p>
          </div>
          <div class="card-footer text-muted">
            <button
              className="btn btn-info"
              onClick={() => {
                onUniversitySubmit();
              }}
            >
              {universityId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="row border p-2 m-2">
         <table className="table table-bordered table-striped table-active">
          <thead>
            <tr>
              <th>University Image</th>
              <th>University Name</th>
              <th>Add Department</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderUniversities()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default University;
