import React from "react";

const DeleteTasks = props => {
  return (
    <form
      className="text-right"
      onSubmit={props.handleConfirm}
      id="deleteTasks"
    >
      <div className="form-group row">
        <label htmlFor="inputProject" className="col-sm-4 col-form-label">
          Project (all tasks)
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.project}
            onChange={props.handleChange}
            name="project"
            id="inputProject"
            required
          >
            <option value="" key="0">
              Select
            </option>
            {props.projects.map(function(project) {
              return (
                <option value={project.id} key={project.id}>
                  {project.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="deleteTasks">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default DeleteTasks;
