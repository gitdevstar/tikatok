import React from "react";

const UserForm = props => {
  return (
    <form className="text-right" onSubmit={props.handleConfirm} id="userForm">
      <div className="form-group row">
        <label htmlFor="inputUserName" className="col-sm-4 col-form-label">
          Username
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.username}
            className="form-control"
            onChange={props.handleChange}
            name="username"
            id="inputUsername"
            required
          />
        </div>
      </div>
      {props.modalTitle === "Add" && props.show_password == 0 && (
      <div className="form-group row">
        <label htmlFor="inputPassword" className="col-sm-4 col-form-label">
          Password
        </label>
        <div className="col-sm-8">
          <input
            type="password"
            value={props.password}
            className="form-control"
            onChange={props.handleChange}
            name="password"
            id="inputPassword"
            required
          />
          
        </div>
      </div>
      )}
      {props.modalTitle === "Add" && props.show_password == 1 && (
      <div className="form-group row">
        <label htmlFor="inputPassword" className="col-sm-4 col-form-label">
          Password
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.password}
            className="form-control"
            onChange={props.handleChange}
            name="password"
            id="inputPassword"
            required
          />
        </div>
      </div>
      )}
      
      {props.modalTitle === "Edit" && props.show_password == 0 && (
      <div className="form-group row">
        <label htmlFor="inputPassword" className="col-sm-4 col-form-label">
          New Password
        </label>
        <div className="col-sm-8">
          <input
            type="password"
            value={props.modify_password}
            className="form-control"
            onChange={props.handleChange}
            name="modify_password"
            id="inputPassword"
            required
          />
        </div>
      </div>
      )}
      {props.modalTitle === "Edit" && props.show_password == 1 && (
      <div className="form-group row">
        <label htmlFor="inputPassword" className="col-sm-4 col-form-label">
          New Password
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.modify_password}
            className="form-control"
            onChange={props.handleChange}
            name="modify_password"
            id="inputPassword"
            required
          />
        </div>
      </div>
      )}
      {props.modalTitle === "Edit" && (
      <div className="form-group row">
        <label htmlFor="inputConfirmPassword" className="col-sm-4 col-form-label">
          Confirm Password
        </label>
        <div className="col-sm-8">
          <input
            type="password"
            value={props.confirm_password}
            className="form-control"
            onChange={props.handleChange}
            name="confirm_password"
            id="inputConfirmPassword"
            required
          />
        </div>
      </div>
      )}
      <div className="form-group row">
        <div className="col-sm-4"></div>
        <div className="col-sm-8 text-left">
          <input 
            type="checkbox"
            name="show_password"
            id="show_password"
            onClick={props.toggleShowPwd}
          />
          <label htmlFor="show_password" className="col-sm-8">
          Show password
        </label>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputFirstName" className="col-sm-4 col-form-label">
          First Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.first_name}
            className="form-control"
            onChange={props.handleChange}
            name="first_name"
            id="inputFirstName"
            required
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputLastName" className="col-sm-4 col-form-label">
          Last Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.last_name}
            className="form-control"
            onChange={props.handleChange}
            name="last_name"
            id="inputLastName"
            required
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputUserEmail" className="col-sm-4 col-form-label">
          Email
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.email}
            className="form-control"
            onChange={props.handleChange}
            name="email"
            id="inputUserEmail"
            required
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputTypeUser" className="col-sm-4 col-form-label">
          Type User
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.type_user}
            onChange={props.handleChange}
            name="type_user"
            id="inputTypeUser"
            required
          >
            <option value="" key="0">
              Select
            </option>
            <option value="1" key="1">
              Admin
            </option>
            <option value="2" key="2">
              Manager
            </option>
            <option value="3" key="3">
              User
            </option>
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="userForm">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default UserForm;
