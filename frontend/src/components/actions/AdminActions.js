import React from "react";

export default function AdminActions(props) {
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={props.handleRefresh}
      >
        Refresh
      </button>
      <button
        type="button"
        className="btn btn-primary ml-4"
        onClick={e => {
          props.handleChange(e);
          props.setFormToLoad(2);
        }}
        disabled={props.selected >= 1 ? true : false}
        name="modalTitle"
        value="Filter"
        data-toggle="modal"
        data-target="#baseModal"
      >
        Filter
      </button>
      <button
        type="button"
        className="btn btn-primary ml-4"
        onClick={e => {
          props.handleChange(e);
          props.setFormToLoad(1);
          props.resetForm();
        }}
        disabled={props.selected >= 1 ? true : false}
        name="modalTitle"
        value="Add"
        data-toggle="modal"
        data-target="#baseModal"
      >
        Add New
      </button>
      <button
        id="btnDelete"
        type="button"
        className="btn btn-primary ml-4"
        onClick={props.handleDelete}
        disabled={props.selected === 0 ? true : false}
      >
        Delete
      </button>
      <button
        type="button"
        className="btn btn-primary ml-4"
        onClick={props.handleExport}
      >
        Export
      </button>
      {props.children}
    </div>
  );
}
