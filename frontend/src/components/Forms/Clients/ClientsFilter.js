import React from "react";

const ClientsFilter = props => {
  return (
    <form className="text-right" onSubmit={props.handleConfirm} id="clientForm">
      <div className="form-group row">
        <label htmlFor="inputName" className="col-sm-4 col-form-label">
          Client Name
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.name}
            className="form-control"
            onChange={props.handleChange}
            name="name"
            id="inputName"
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputCountry" className="col-sm-4 col-form-label">
          Country
        </label>
        <div className="col-sm-8">
          <select
            className="form-control"
            value={props.country}
            onChange={props.handleChange}
            name="country"
            id="inputCountry"
          >
            <option value="" key="0">
              Select
            </option>
            {props.countries.map(function(country) {
              return (
                <option value={country.id} key={country.id}>
                  {country.name}
                </option>
              );
            })}
          </select>
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

      <div className="text-center mt-4">
        <h6># Projects</h6>
      </div>
      <div className="form-group row">
        <label htmlFor="inputProjectsFrom" className="col-sm-4 col-form-label">
          From
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.projectsFrom}
            className="form-control"
            onChange={props.handleChange}
            name="projectsFrom"
            id="inputProjectsFrom"
            min="0"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="inputProjectsTo" className="col-sm-4 col-form-label">
          To
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.projectsTo}
            className="form-control"
            onChange={props.handleChange}
            name="projectsTo"
            id="inputProjectsTo"
            min="0"
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="clientForm">
          Confirm
        </button>
      </div>
    </form>
  );
};

export default ClientsFilter;
