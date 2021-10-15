import React from "react";

const TasksFilter = props => {
  return (
    <form
      className="text-right"
      onSubmit={props.handleConfirm}
      id="tasksFilter"
    >
      <div className="form-group row">
        <label htmlFor="inputProjectName" className="col-sm-4 col-form-label">
          Project Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.project_name}
            className="form-control"
            onChange={props.handleChange}
            name="project_name"
            id="inputProjectName"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputTaskId" className="col-sm-4 col-form-label">
          Task Id
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.task_id}
            className="form-control"
            onChange={props.handleChange}
            name="task_id"
            id="inputTaskId"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputDataType" className="col-sm-4 col-form-label">
          Data Type
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.data_type}
            onChange={props.handleChange}
            name="data_type"
            id="inputDataType"
          >
            <option value={0} key="0">
              Select
            </option>
            <option value={1}>image</option>
            <option value={2}>text</option>
            <option value={3}>audio</option>
          </select>
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputStatus" className="col-sm-4 col-form-label">
          Status
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.status}
            onChange={props.handleChange}
            name="status"
            id="inputStatus"
          >
            <option value={0} key="0">
              Select
            </option>
            <option value={1}>Incomplete</option>
            <option value={2}>Completed</option>
            <option value={3}>Rejected</option>
          </select>
        </div>
      </div>

      <div className="form-group row">
        <label
          htmlFor="inputAssignedManager"
          className="col-sm-4 col-form-label"
        >
          Assigned Manager
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.assignedManager}
            className="form-control"
            onChange={props.handleChange}
            name="assignedManager"
            id="inputAssignedManager"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputAssignedUser" className="col-sm-4 col-form-label">
          Assigned User
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.assignedUser}
            className="form-control"
            onChange={props.handleChange}
            name="assignedUser"
            id="inputAssignedUser"
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="tasksFilter">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default TasksFilter;
