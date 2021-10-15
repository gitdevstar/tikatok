import React from "react";

const TasksAssignFilter = props => {
  return (
    <form
      className="text-right"
      onSubmit={props.handleConfirm}
      id="tasksAssignFilter"
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

      {props.component === 0 && (
        <div className="text-center mt-4">
          <h6>#Items</h6>
        </div>
      )}
      {props.component === 0 && (
        <div className="form-group row">
          <label htmlFor="inputItemsFrom" className="col-sm-4 col-form-label">
            from
          </label>
          <div className="col-sm-8">
            <input
              min="0"
              type="number"
              value={props.itemsFrom}
              className="form-control"
              onChange={props.handleChange}
              name="itemsFrom"
              id="inputItemsFrom"
            />
          </div>
        </div>
      )}

      <div className="form-group row">
        <label htmlFor="inputItemTo" className="col-sm-4 col-form-label">
          to
        </label>
        <div className="col-sm-8">
          <input
            min="0"
            type="number"
            value={props.itemsTo}
            className="form-control"
            onChange={props.handleChange}
            name="itemsTo"
            id="inputItemTo"
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <h6>#Completion</h6>
      </div>
      <div className="form-group row">
        <label
          htmlFor="inputCompletionFrom"
          className="col-sm-4 col-form-label"
        >
          from
        </label>
        <div className="col-sm-8">
          <input
            min="0"
            type="number"
            value={props.completionFrom}
            className="form-control"
            onChange={props.handleChange}
            name="completionFrom"
            id="inputCompletionFrom"
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputCompletionTo" className="col-sm-4 col-form-label">
          to
        </label>
        <div className="col-sm-8">
          <input
            min="0"
            type="number"
            value={props.completionTo}
            className="form-control"
            onChange={props.handleChange}
            name="completionTo"
            id="inputCompletionTo"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputDeadline" className="col-sm-4 col-form-label">
          Deadline
        </label>
        <div className="col-sm-8">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <span className="fa fa-calendar-o" />
              </span>
            </div>
            <input
              type="date"
              value={props.deadline}
              className="form-control date-custom"
              onChange={props.handleChange}
              name="deadline"
              id="inputDeadline"
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          form="tasksAssignFilter"
        >
          Confirm
        </button>
      </div>
    </form>
  );
};

export default TasksAssignFilter;
