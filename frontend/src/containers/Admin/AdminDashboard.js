import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { getLoggedUser } from "../../API/LoginRequests";

export default class AdminContainer extends Component {
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
    let name = "";
    if ((this.state.user === {}, this.state.user == null)) {
    } else {
      name = `${this.state.user.first_name} ${this.state.user.last_name}`;
    }
    return (
      <DashboardLayout match={match} name={name}>
        <div className="menu">
          <ul>
            <li>
              <NavLink to={`${match.url}/clients`}>
                <div>
                  <i className="fa fa-users" />
                  <span> Clients</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to={`${match.url}/projects`}>
                <i className="fa fa-folder-o" />
                <span> Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`${match.url}/tasks`}>
                <i className="fa fa-tasks" />
                <span> Tasks</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`${match.url}/users`}>
                <i className="fa fa-user" />
                <span> Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`${match.url}/logs`}>
                <i className="fa fa-key" />
                <span> Logs</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </DashboardLayout>
    );
  }
}
