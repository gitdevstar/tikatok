import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import ClientsContainer from "./Admin/ClientsContainer";
import ProjectsContainer from "./Admin/ProjectsContainer";
import LogsContainer from "./LogsContainer";
import UsersContainer from "./Admin/UsersContainer";
import TasksContainer from "./Admin/TasksContainer";
import DashboardContainer from "./Admin/DashboardContainer"

import tikawork_png from "../assets/img/tikawork.png"
import user_png from "../assets/img/user.png";

export default function DashboardLayout(props) {
  return (
    <div className="dashboard container-fluid">
      <div className="row">
        <div className="vertical-menu col-2">
          <div className="brand">
            <Link to={`${props.match.url}/dashboard`}>
              <img
                className="img-fluid"
                src={tikawork_png}
                alt="Tikawork login page"
              />
            </Link>
          </div>
          {props.children}
        </div>
        <div className="side-panel col-10">
          <div className="top-bar col">
            <i className="fa fa-bars" />
            <div className="username-logout">
              <div id="btnLogout" data-toggle="dropdown" aria-expanded="false">
                <img src={user_png} alt="user" />
                {props.name && <span>{props.name}</span>}
                <i className="fa fa-angle-down" />
              </div>

              <div className="dropdown-menu" aria-labelledby="btnLogout">
                <a className="dropdown-item" href="/login">
                  <span className="mr-2">Log Out </span>
                  <i className="fa fa-sign-out" />
                </a>
              </div>
            </div>
          </div>

          <div className="content">
            <Switch>
              <Route
                path={`${props.match.path}/dashboard`}
                component={DashboardContainer}
              />
              <Route
                path={`${props.match.path}/clients`}
                component={ClientsContainer}
              />
              <Route
                path={`${props.match.path}/projects`}
                component={ProjectsContainer}
              />
              <Route
                path={`${props.match.path}/tasks`}
                component={TasksContainer}
              />
              <Route
                path={`${props.match.path}/users`}
                component={UsersContainer}
              />
              <Route
                path={`${props.match.path}/logs`}
                component={LogsContainer}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}
