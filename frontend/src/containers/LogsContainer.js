import React, { Component } from "react";
import { getUsers } from "../API/UsersRequests";
import { getLogs } from "../API/LogsRequests";
import moment from "moment";
export default class LogsContainer extends Component {
  state = { logs: [] };

  getUserName = id => {
    const { users } = this.state;
    let userName = "";
    users.forEach(user => {
      if (user.id === id) userName = user.username;
    });
    return userName;
  };

  componentDidMount() {
    getLogs().then(logs => {
      getUsers().then(users => {
        this.setState({ logs, users });
      });
    });
  }

  render() {
    const { logs } = this.state;
    let text = "";
    let space = "                  ";
    if (logs !== null) {
      text = logs.map(log => {
        let date = moment(log.date_time).format("YYYY-MM-DD HH:mm:ss");
        return `${space}${date}${space}${
          log.activity
        }${space}${this.getUserName(log.user)}\n\n`;
      });
      var textArea = document.getElementById("textAreaLogs");
      if (textArea !== null) textArea.value = text.join("");
    }

    return (
      <div className="table-content logs">
        <div className="table-header">
          <span>Logs</span>
          <hr />
        </div>
        <textarea id="textAreaLogs" />
      </div>
    );
  }
}
