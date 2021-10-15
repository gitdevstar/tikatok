import React from "react";

const ClientForm = props => {
  return (
    <div
      className="modal fade"
      id="baseModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="baseModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="baseModalLabel">
              {props.modalTitle}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
export default ClientForm;
