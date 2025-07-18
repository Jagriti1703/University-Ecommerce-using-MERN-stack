

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../navigations/Routes";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function saveUser() {
    axios
      .post("http://localhost:8082/register", form)
      .then((d) => {
        alert(d.data.message);
        navigate(ROUTES.login.name);
      })
      .catch((e) => {
        alert(e?.message);
      });
  }

  function onRegisterSubmit() {
    let errors = false;
    let error = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (form.firstName.trim().length == 0) {
      errors = true;
      error = { ...error, firstName: "first name empty" };
    }
    if (form.lastName.trim().length == 0) {
      errors = true;
      error = { ...error, lastName: "last name empty" };
    }
    if (form.email.trim().length == 0) {
      errors = true;
      error = { ...error, email: " email empty" };
    }
    if (form.password.trim().length == 0) {
      errors = true;
      error = { ...error, password: "password empty" };
    }
    if (form.confirmPassword.trim().length == 0) {
      errors = true;
      error = { ...error, confirmPassword: "password empty" };
    }
    if (form.password != form.confirmPassword) {
      errors = true;
      error = {
        ...error,
        password: "Password and confirm password must be same",
      };
    }
    if (!(form.password.length >= 6 && form.password.length <= 12)) {
      errors = true;
      error = { ...error, password: "password length must be 6 to 12" };
    }
    if (errors) {
      setFormError(error);
    } else {
      setFormError(error);
      saveUser();
    }
  }

    return (
      <div>
        <Header />
        <div className="row m-2 p-2">
          <div className="card text-center mx-auto">
            <div className="card-header bg-info text-white">Register</div>
            <div className="card-body">
              <div className="form-group row">
                <label className="col-4">First Name</label>
                <div className="col-8">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="firstName"
                    onChange={changeHandler}
                  />
                  <p className="text-danger">{formError.firstName}</p>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-4">Last Name</label>
                <div className="col-8">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="lastName"
                    onChange={changeHandler}
                  />
                  <p className="text-danger">{formError.lastName}</p>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-4">Email</label>
                <div className="col-8">
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    onChange={changeHandler}
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
                  />
                  <p className="text-danger">{formError.password}</p>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-4">Confirm Password</label>
                <div className="col-8">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                    onChange={changeHandler}
                  />
                  <p className="text-danger">{formError.confirmPassword}</p>
                </div>
              </div>
            </div>
            <div className="card-footer text-muted">
              <button onClick={onRegisterSubmit} className="btn btn-info">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Register;
