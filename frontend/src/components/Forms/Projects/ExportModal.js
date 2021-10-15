import React from "react";

const ExportModal = props => {

  return (
    <form className="" onSubmit={props.exportData} id="exportDoModal">
      <div className="form-group row">
        <div className="col-md-4"></div>
        <div className="col-md-8">
        <input 
            type="checkbox"
            name="with_data"
            id="with_data"
            onClick={props.changeWithData}
        />
        <label htmlFor="with_data" className="col-sm-8">
            With data
        </label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" form="exportDoModal">
          Export
        </button>
      </div>
    </form>
  );
};

export default ExportModal;
