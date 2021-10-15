import React from "react";

const UsersFilter = props => {
  return (
    <form
      className="text-right"
      onSubmit={props.handleConfirm}
      id="ProjectForm"
    >
      <div className="form-group row">
        <label htmlFor="inputProjectName" className="col-sm-4 col-form-label">
          Project Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.name}
            className="form-control"
            onChange={props.handleChange}
            name="name"
            id="inputProjectName"
          />
        </div>
      </div>
      <div className="text-center mt-4">
        <h6>Year Contracted</h6>
      </div>
      <div className="form-group row">
        <label htmlFor="inputYearFrom" className="col-sm-4 col-form-label">
          From
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.yearFrom}
            className="form-control"
            onChange={props.handleChange}
            name="yearFrom"
            id="inputYearFrom"
            min="0"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputYearTo" className="col-sm-4 col-form-label">
          To
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.yearTo}
            className="form-control"
            onChange={props.handleChange}
            name="yearTo"
            id="inputYearTo"
            min="0"
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
            <option value="" key="0">
              Select
            </option>
            <option value={1} key="1">
              Image
            </option>
            <option value={2} key="2">
              Text
            </option>
            <option value={3} key="3">
              Audio
            </option>
          </select>
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputTaskType" className="col-sm-4 col-form-label">
          Task Type
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.task_type}
            onChange={props.handleChange}
            name="task_type"
            id="inputTaskType"
          >
            <option value="" key="0">
              Select
            </option>
            <option value={1} key="1">
              Image boundbox
            </option>
            <option value={2} key="2">
              Image classification
            </option>
            <option value={3} key="3">
              Text classification
            </option>
            <option value={4} key="4">
              Audio classification
            </option>
          </select>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="ProjectForm">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default UsersFilter;
