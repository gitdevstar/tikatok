import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AdminActions from "../../components/actions/AdminActions";
// import Modal from "../../components/Modal";
import UserForm from "../../components/Forms/Users/UserForm";
import UsersFilter from "../../components/Forms/Users/UsersFilter";

import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  getUserId
} from "../../API/UsersRequests";
import UsersTable from "../../components/tables/UsersTable";
import { saveLog } from "../../API/LogsRequests";
import { getLoggedUser } from "../../API/LoginRequests";

export default class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userId: 0,
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      type_user: 0,
      selectedUsers: 0,
      modalTitle: "",
      formToLoad: 0,
      selected: {},
      selectAll: 0, 
      modal: false,
      modify_password: "",
      confirm_password: "",
      show_password: 0,
    };
    this.toggle = this.toggle.bind(this);  
}
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleShowPwd = () => {
    let show_password = this.state.show_password;
    
    show_password = (show_password + 1) % 2;
    
    this.setState({show_password});
  }

  toggleRow = user => {
    let selectedUsers = this.state.selectedUsers;
    let selectedUser = { ...user };
    let users = [...this.state.users];

    selectedUser.checked = !selectedUser.checked;
    users.splice(users.indexOf(user), 1, selectedUser);

    if (selectedUser.checked) selectedUsers++;
    else selectedUsers--;

    this.setState({
      users,
      selectAll: 2,
      selectedUsers
    });

    if (selectedUsers === 1) {
      this.selectedUser();
    }
    user.checked = !user.checked;
  };

  toggleSelectAll = () => {
    let users,
      selectAll,
      selectedUsers,
      selected = {};
    if (this.state.selectAll === 0) {
      users = this.toggleCheckedUsers([...this.state.users], true);
      selectAll = 1;
      if (users.length === 1) selected = users[0];
    } else {
      users = this.toggleCheckedUsers([...this.state.users], false);
      selectAll = 0;
      selectedUsers = 0;
    }
    this.setState({ users, selectAll, selected, selectedUsers });
  };

  toggleCheckedUsers = (users, checked) => {
    users.map(user => {
      user.checked = checked;
      return user;
    });
    return users;
  };

  selectedUser = () => {
    let users = [...this.state.users];
    let user = users.filter(user => {
      return user.checked;
    });
    if (user.length === 1)
      this.setState({
        userId: user[0].id,
        username: user[0].username,
        password: user[0].password,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        email: user[0].email,
        type_user: user[0].type_user
      });
  };

  resetRowSelected = () => {
    this.setState({ selectAll: 0, selectedUsers: 0 });
  };

  resetUserForm = () => {
    this.setState({
      userId: 0,
      username: "",
      password: "",
      type_user: 0,
      first_name: "",
      last_name: "",
      email: "",
      modify_password: "",
    });
  };

  validateClientForm = () => {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.first_name === "" ||
      this.state.last_name === "" ||
      this.state.email === "" ||
      this.state.type_user === ""
    )
      return true;
    else return false;
  };
  validateEditClientForm = () => {
    if (
      this.state.username === "" ||
      this.state.modify_password === "" ||
      this.state.modify_password !== this.state.confirm_password ||
      this.state.first_name === "" ||
      this.state.last_name === "" ||
      this.state.email === "" ||
      this.state.type_user === ""
    )
      return true;
    else return false;
  };

  setFormToLoad = num => {
    this.setState({ formToLoad: num, show_password: num == 1 ? 0 : 1  });
  };

  getUserType = num => {
    if (num === 1) return "Admin";
    else if (num === 2) return "Manager";
    else if (num === 3) return "User";
    else return "Type user";
  };

  generateXMLData = users => {
    var xml = '<?xml version="1.0" encoding="iso-8859-1"?><objectlist>';
    users.forEach(obj => {
      xml += `<object pk="${obj.id}">`;
      xml += `<field name="id">${obj.id}</field>`;
      xml += `<field name="username">${obj.username}</field>`;
      xml += `<field name="first_name">${obj.first_name}</field>`;
      xml += `<field name="last_name">${obj.last_name}</field>`;
      xml += `<field name="email">${obj.email}</field>`;
      xml += `<field name="type_user">${this.getUserType(
        obj.type_user
      )}</field>`;

      xml += "</object>";
    });
    xml += "</objectlist>";
    return xml;
  };

  /* Handle Functions */
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleConfirm = e => {
    e.preventDefault();
    if (this.state.formToLoad === 1) {
      if (this.state.userId === 0) this.handleAdd();
      else this.handleEdit();
    } else if (this.state.formToLoad === 2) {
      this.handleFilter();
    }
  };

  handleAdd = () => {
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      type_user,
      users
    } = this.state;

    this.setState({ selectAll: false });
    if (!this.validateClientForm()) {
      const user = {
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name,
        email: email,
        type_user: type_user,
        user_id: getUserId(users)
      };
      saveUser(user).then(res => {
        saveLog({
          activity: `Created user ${user.username}`,
          user: getLoggedUser().id
        });
        getUsers().then(users => {
          users = users.filter(user => user.is_superuser === false);
          this.setState({ users: this.toggleCheckedUsers(users, false) });
        });
      });

      this.resetUserForm();
      this.resetRowSelected();
      this.toggle();
    }
  };

  handleEdit = () => {
    const {
      username,
      first_name,
      last_name,
      email,
      type_user,
      userId,
      modify_password,
    } = this.state;
    if (!this.validateEditClientForm()) {
      const user = {
        id: userId,
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        type_user: type_user,
        password: modify_password
      };
      updateUser(user).then(res => {
        getUsers().then(users => {
          users = users.filter(user => user.is_superuser === false);
          this.setState({ users: this.toggleCheckedUsers(users, false) });
        });
      });
      this.resetUserForm();
      this.resetRowSelected();
      this.toggle();
    }
  };

  handleDelete = e => {
    let users = [...this.state.users];
    let message = "";
    users = users.filter(user => {
      return user.checked;
    });
    if (users.length === 1)
      message = "Are you sure do you want to delete 1 user?";
    else if (users.length > 1)
      message = `Are you sure do you want to delete ${users.length} users?`;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui text-center">
            <h2>Delete</h2>
            <p>{message}</p>
            <button className="btn btn-primary mr-1" onClick={onClose}>
              No
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.handleDeleteUsers(users);
                this.setState({ selectAll: false, selectedUsers: 0 });
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        );
      }
    });
  };

  handleDeleteUsers = users => {
    let ids = [];
    let deletedUsername = '';
    for(var i = 0, len = users.length ; i < len; i++){
      ids.push(users[i].id);
      deletedUsername += users[i].username + (i == len - 1) ? '' : ',';
    }
    deleteUser(ids).then(res => {
      saveLog({
        activity: `Deleted user ${deletedUsername}`,
        user: getLoggedUser().id
      });
      getUsers().then(users => {
        this.setState({
          users: this.toggleCheckedUsers(users, false)
        });
      });
    });

  };

  handleExport = e => {
    e.preventDefault();
    var element = document.createElement("a");
    var div = document.getElementById("btnDownload");
    let data = this.generateXMLData(this.state.users);

    element.setAttribute("href", "data:text/xml;charset=utf-8," + data);
    element.setAttribute("download", "data.xml");
    element.style.display = "none";
    div.appendChild(element);
    element.click();
    div.removeChild(element);
  };

  handleFilter = () => {
    getUsers().then(users => {
      users = users.filter(
        user =>
          user.username.includes(this.state.username) &&
          user.is_superuser === false
      );
      this.setState({ users: this.toggleCheckedUsers(users, false) });
      this.toggle();
    });
  };

  handleRefresh = () => {
    getUsers().then(users => {
      users = users.filter(user => user.is_superuser === false);
      this.setState({ users: this.toggleCheckedUsers(users, false), selectedUsers: 0 });
    });
  };

  componentDidMount() {
    getUsers().then(users => {
      users = users.filter(user => user.is_superuser === false);
      this.setState({ users: this.toggleCheckedUsers(users, false) });
    });
  }

  render() {
    const {
      selectAll,
      selected,
      modalTitle,
      formToLoad,
      username,
      password,
      first_name,
      last_name,
      email,
      type_user,
      selectedUsers,
      modify_password,
      confirm_password,
      show_password,
    } = this.state;

    return (
      <div className="wrapper">
        <div className="bnt-actions text-center">
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleRefresh}
              >
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary ml-4"
                onClick={e => {
                  this.handleChange(e);
                  this.setFormToLoad(1);
                  this.resetUserForm();
                  this.toggle();
                }}
                name="modalTitle"
                value="Add"
              >
                Add new
              </button>
              <button
                type="button"
                className="btn btn-primary ml-4"
                onClick={e => {
                  this.handleChange(e);
                  this.setFormToLoad(2);
                  this.toggle();
                }}
                disabled={this.state.selectedUsers >= 1 ? true : false}
                name="modalTitle"
                value="Filter"
              >
                Filter
              </button>
              
              <button
                id="btnDelete"
                type="button"
                className="btn btn-primary ml-4"
                onClick={e => this.handleDelete(e)}
                disabled={this.state.selectedUsers === 0 ? true : false}
              >
                Delete
              </button>
              {/* <button
                type="button"
                className="btn btn-primary ml-4"
                onClick={e => this.handleExport(e)}
              >
                Export
              </button> */}
              <button
                type="button"
                className="btn btn-primary ml-4"
                name="modalTitle"
                value="Edit"
                disabled={this.state.selectedUsers !== 1 ? true : false}
                onClick={e => {
                  this.handleChange(e);
                  this.setFormToLoad(1);
                  this.selectedUser();
                  this.toggle();
                }}
              >
                Edit
              </button>
            </div>
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Users</span>
            <hr />
          </div>
          <UsersTable
            data={this.state.users}
            toggleRow={this.toggleRow}
            toggleSelectAll={this.toggleSelectAll}
            selectAll={selectAll}
            selected={selected}
          />
        </div>
        <div className="content-footer">
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
              <ModalBody>
                {formToLoad === 1 && (
                  <UserForm
                    modalTitle={modalTitle}
                    username={username}
                    password={password}
                    modify_password={modify_password}
                    confirm_password={confirm_password}
                    first_name={first_name}
                    last_name={last_name}
                    email={email}
                    type_user={type_user}
                    show_password={show_password}
                    handleConfirm={this.handleConfirm}
                    handleChange={this.handleChange}
                    toggleShowPwd={this.toggleShowPwd}
                    toggle={this.toggle}
                  />
                )}
                {formToLoad === 2 && (
                  <UsersFilter
                    username={username}
                    handleConfirm={this.handleConfirm}
                    handleChange={this.handleChange}
                    setFormToLoad={this.setFormToLoad}
                    toggle={this.toggle}
                  />
                )}
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div id="btnDownload" />
      </div>
    );
  }
}
