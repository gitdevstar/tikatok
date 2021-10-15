import React, { Component } from "react";
import { NavLink, Link, Switch, Route } from "react-router-dom";
import { getLoggedUser } from "../../API/LoginRequests";
import TaskAssign from "./TaskAssign";
import TaskStatus from "./TaskStatus";
import LogsContainer from "../LogsContainer";

import TextTool from "./TextTool";
import AudioTool from "./AudioTool";
import ImgClassifyTool from "./ImgClassifyTool";
import ImgMarkerTool from "./ImgMarkerTool";
import ImgBoundingBoxTool from "./ImgBoundingBoxTool"
import ImgSemanticTool from "./ImgSemanticTool"

import tikawork_png from "../../assets/img/tikawork.png"
import user_png from "../../assets/img/user.png";

export default class ManagerDashboard extends Component {
  state = {
    user: {}
  };

  componentDidMount() {
    const { location } = this.props;
    if (location.state == null) {
      let user = getLoggedUser();
      this.setState({ user });
    } else {
      this.setState({
        user: location.state.user
      });
    }
  }

  render() {
    const { match } = this.props;
    const { user } = this.state;
    let name = "";
    if (user === {} || user == null) {
    } else {
      name = `${user.first_name} ${user.last_name}`;
    }
    return (
      <div className="dashboard container-fluid">
        <div className="row">
          <div className="vertical-menu col-2">
            <div className="brand">
              <Link to={`${match.url}`}>
                <img
                  className="img-fluid"
                  src={tikawork_png}
                  alt="Tikawork login page"
                />
              </Link>
            </div>

            <div className="menu">
              <ul>
                <li>
                  <NavLink to={`${match.url}/task-assign`}>
                    <i className="fa fa-tasks" />
                    <span> Task Assign</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${match.url}/task-status`}>
                    <i className="fa fa-list-ul" />
                    <span> Task Status</span>
                  </NavLink>
                </li>                
              </ul>
            </div>
          </div>
          <div className="side-panel col-10">
            <div className="top-bar col">
              <i className="fa fa-bars" />
              <div className="username-logout">
                <div
                  id="btnLogout"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src={user_png} alt="user" />
                  {name && <span>{name}</span>}
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
                  path={`${match.path}/task-assign`}
                  component={TaskAssign}
                />
                <Route
                  exact
                  path={`${match.path}/task-status`}
                  component={TaskStatus}
                />
                <Route path={`${match.path}/logs`} component={LogsContainer} />
               {/* for inspect task */}
                <Route
                  path={`${match.path}/task-status/text-tool`}
                  component={TextTool}
                />
                <Route
                  path={`${match.path}/task-status/audio-tool`}
                  component={AudioTool}
                />
                <Route
                  path={`${match.path}/task-status/img-classify-tool`}
                  component={ImgClassifyTool}
                />
                <Route
                  path={`${match.path}/task-status/img-marker-tool`}
                  component={ImgMarkerTool}
                />
                <Route
                  path={`${match.path}/task-status/img-bbox-tool`}
                  component={ImgBoundingBoxTool}
                />
                <Route
                  path={`${match.path}/task-status/img-semantic-tool`}
                  component={ImgSemanticTool}
                />
                <Route
                  path={`${match.path}/performance`}
                  component={Performance}
                />
                <Route path={`${match.path}/logs`} component={LogsContainer} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
