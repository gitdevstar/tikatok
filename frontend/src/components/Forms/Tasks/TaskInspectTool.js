import React from "react";

const TaskInspectUser = props => {
  let users = props.users.filter(user => {
    return user.type_user === 3;
  });

  return (
    <form
      className="text-right"
      onSubmit={props.handleConfirm}
      id="taskAssignUser"
    >
      {/* user select */}
      <div className="form-group row">
        <label
          htmlFor="inputAssignedUserId"
          className="col-sm-3 col-form-label"
        >
          User:
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.assigned_user_id}
            onChange={props.handleChange}
            name="assigned_user_id"
            id="inputAssignedUserId"
            required
          >
            <option value="" key="0">
              User
            </option>
            {users.map(user => (
              <option value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row ">
        <div className="col-12 text-center">            
         <button type="submit" className="btn btn-primary" form="taskAssignUser">
           InspectTask
         </button>
        </div>
      </div>
    </form>
  );
};

export default TaskInspectUser;
