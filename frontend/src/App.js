import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./containers/LoginContainer";
import AdminDashboard from "./containers/Admin/AdminDashboard";
import ManagerDashboard from "./containers/Manager/ManagerDashboard";
import UserDashboard from "./containers/User/UserDashboard";
import NotFound from "./components/NotFound";
import "./index.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="tirawork-app">
          <Switch>
            <Route exact path="(/login|)" component={Login} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/manager" component={ManagerDashboard} />
            <Route path="/user" component={UserDashboard} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
