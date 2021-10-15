import React from "react";

const ClientForm = props => {
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
            required
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputYear" className="col-sm-4 col-form-label">
          Year
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            value={props.year}
            className="form-control"
            onChange={props.handleChange}
            name="year"
            id="inputYear"
            required
            min="0"
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
            required
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
      <div className="form-group row">
        <label htmlFor="inputAddress" className="col-sm-4 col-form-label">
          Address
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            value={props.address}
            className="form-control"
            onChange={props.handleChange}
            name="address"
            id="inputAddress"
            required
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

export default ClientForm;
