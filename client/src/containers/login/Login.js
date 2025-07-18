import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../navigations/Routes";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

function LoginCheck() {
  axios
    .post("http://localhost:8082/login", form)
    .then((d) => {
      alert(d.data.message);
      // Store token and user info
      sessionStorage.setItem("token", d.data.token);
sessionStorage.setItem("id", d.data.id);
sessionStorage.setItem("role", d.data.role);

      // localStorage.setItem("token", d.data.token);
      // localStorage.setItem("id", d.data.id);
      // localStorage.setItem("role", d.data.role);
      
      if (d.data.role == "admin") {
        navigate(ROUTES.universityAdmin.name);
      } else {
        navigate(ROUTES.home.name);
      }
    })
    .catch((e) => {
      alert("Wrong username or password");
      setForm({ ...form, email: "", password: "" });
    });
}

  // function LoginCheck() {
  //   axios
  //     .post("http://localhost:8082/login", form)
  //     .then((d) => {
  //       alert(d.data.message);
  //       localStorage.setItem("id", d.data.id);
  //       localStorage.setItem("role", d.data.role);
  //       if ((d.data.role == "admin")) navigate(ROUTES.universityAdmin.name);
  //       else navigate(ROUTES.home.name);
  //     })
  //     .catch((e) => {
  //       alert("wrong User/password");
  //       setForm({ ...form, email: "", password: "" });
  //     });
  // }

  function onLoginSubmit() {
    let errors = false;
    let error = { email: "", password: "" };
    if (form.email.trim().length == 0) {
      errors = true;
      error = { ...error, email: "email empty" };
    }
    if (form.password.trim().length == 0) {
      errors = true;
      error = { ...error, password: "password empty" };
    }
    if (errors) {
      setFormError(error);
    } else {
      setFormError(error);
      LoginCheck();
    }
  }

  return (
    <div>
      <Header />
      <div className="row m-2">
        <div className="card text-center mx-auto">
          <div className="card-header bg-info text-white">Login</div>
          <div className="card-body">
            <div className="form-group row">
              <label className="col-4">UserName</label>
              <div className="col-8">
                <input
                  type="text"
                  name="email"
                  placeholder="username"
                  onChange={changeHandler}
                  value={form.email}
                />
                <p className="text-danger">{formError.email}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-4">Password</label>
              <div className="col-8">
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={changeHandler}
                  value={form.password}
                />
                <p className="text-danger">{formError.password}</p>
              </div>
            </div>
          </div>
          <div className="card-footer text-muted">
            <button onClick={onLoginSubmit} className="btn btn-info">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
