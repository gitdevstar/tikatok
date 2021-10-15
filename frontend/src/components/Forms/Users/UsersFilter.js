import React from "react";

const UsersFilter = props => {
  return (
    <form className="text-right" onSubmit={props.handleConfirm} id="userForm">
      <div className="form-group row">
        <label htmlFor="inputUserName" className="col-sm-4 col-form-label">
          User Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.username}
            className="form-control"
            onChange={props.handleChange}
            name="username"
            id="inputUserName"
          />
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

export default UsersFilter;
