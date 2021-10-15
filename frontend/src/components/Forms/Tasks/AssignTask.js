import React from "react";

const AssignTask = props => {
  let users = props.users.filter(user => {
    return user.type_user === 2;
  });

  return (
    <form className="text-right" onSubmit={props.handleConfirm} id="assignTask">
      <div className="form-group row">
        <label
          htmlFor="inputAssignedManagerId"
          className="col-sm-4 col-form-label"
        >
          Manager
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.assigned_manager_id}
            onChange={props.handleChange}
            name="assigned_manager_id"
            id="inputAssignedManagerId"
            required
          >
            <option value="" key="0">
              Select
            </option>
            {users.map(user => (
              <option value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="assignTask">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default AssignTask;
