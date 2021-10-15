import React from "react";
import Switch from "react-switch";

const TaskForm = props => {
  return (
    <form className="text-right" onSubmit={props.handleConfirm} id="taskForm">
      <div className="form-group row">
        <label htmlFor="inputProject" className="col-sm-4 col-form-label">
          Project
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
      <div className="form-group row">
        <label htmlFor="inputTasksNumber" className="col-sm-4 col-form-label">
          No. of Tasks
        </label>
        <div className="col-sm-8">
          <input
            min="1"
            type="number"
            value={props.number_of_tasks}
            className="form-control"
            onChange={props.handleChange}
            name="number_of_tasks"
            id="inputTasksNumber"
            required
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputRepeatability" className="col-sm-4 col-form-label">
          Repeatability(%)
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.repeatability}
            className="form-control"
            onChange={props.handleChange}
            name="repeatability"
            id="inputRepeatability"
            required
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputTikaScore" className="col-sm-4 col-form-label">
          Tika Score
        </label>
        <div className="col-sm-8">
          <Switch
            onChange={props.handleSwitchChange}
            onColor="#000"
            height={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            checked={!!+props.tika_score_flag}
          />
        </div>
      </div>

      {props.errMsg !== "" && (
        <div className="form-group row">
          <p className="col-sm-12 text-center">{props.errMsg}</p>
        </div>
      )}
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="taskForm">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
