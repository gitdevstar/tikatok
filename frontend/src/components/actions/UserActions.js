import React from "react";

export default function UserActions(props) {
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
        className="btn btn-primary"
        onClick={() => props.setFormToLoad(1, "Filter")}
        data-toggle="modal"
        data-target="#baseModal"
      >
        Filter
      </button>
      {props.children}
    </div>
  );
}
