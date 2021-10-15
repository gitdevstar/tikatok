import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Login as LoginUser, setLoggedUser } from "../API/LoginRequests";

import tikawork_png from "../assets/img/tikawork.png"

export default class Login extends Component {
  state = {
    user: {},
    username: "",
    password: "",
    error: "",
    redirect: false
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;

    LoginUser({ username, password }).then(res => {
      if (res.response) {
        this.setState({ error: "Unregistered user or wrong password" });
      } else {
        this.setState({ user: res.user, redirect: true, error: "" });
      }
    });
    /* this.refs.adminCheck.checked */
  };

  render() {
    const { user } = this.state;
    if(user) {
      if (this.state.redirect === true) {
        if (user.type_user === 1) {
          setLoggedUser(user);
          return (
            <Redirect
              to={{
                pathname: "/admin/dashboard",
                state: { user }
              }}
            />
          );
        } else if (user.type_user === 2) {
          setLoggedUser(user);
          return (
            <Redirect
              to={{
                pathname: "/manager",
                state: { user }
              }}
            />
          );
        } else if (user.type_user === 3) {
          setLoggedUser(user);
          return (
            <Redirect
              to={{
                pathname: "/user",
                state: { user }
              }}
            />
          );
        }
      }
    }
    
    const { username, password, error } = this.state;
    return (
      <Fragment>
        <div className="login">
          <form
            className="col-sm-6 offset-sm-3 col-md-4 offset-md-4"
            onSubmit={this.handleSubmit}
          >
            <img
              className="img-fluid"
              src={tikawork_png}
              alt="Tikawork login page"
            />
            {error && (
              <div className="text-center">
                <span>{error}</span>
              </div>
            )}
            <div className="form-group mt-3">
              <input
                type="text"
                className="form-control"
                name="username"
                id="inputUsername"
                onChange={this.handleChange}
                value={username}
                placeholder="Username"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                id="inpuPassword"
                onChange={this.handleChange}
                value={password}
                placeholder="Password"
                required
              />
            </div>
            {/* <div className="text-center form-group">
              <label className="form-check-label" htmlFor="adminCheck">
                Admin
                <input
                  className="ml-1"
                  type="checkbox"
                  id="adminCheck"
                  ref="adminCheck"
                />
              </label>
            </div> */}
            <div className="form-group row">
              <button type="submit" className="btn btn-default submit">
                Log in
              </button>
            </div>
            <hr />
            <p className="text-center">©2018 Tikawork. All Rights Reserved.</p>
          </form>
        </div>
      </Fragment>
    );
  }
}
