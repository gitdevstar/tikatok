import React, { Component, Fragment }  from "react";
import TagsInput from "react-tagsinput";
// import ProgressBar from "react-bootstrap/ProgressBar"

class ProjectForm extends Component {
// const ProjectForm = props => {
  constructor(props) {
    super(props);
    this.state = { progress: this.props.timecnt };
    
    this.annotation_type=[
      'Bounding Box/Polygon',
      'Multi-label Classification',
      'Multi-label Classification',
      'Multi-label Classification',
      'Landmarker',
      'Semantic Segmentation',
      'Bounding Box',
    ];

    this.data_type = [
      'Image',
      'Text',
      'Audio',
    ];
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("progress", nextProps.timecnt);
  //   this.setState({ progress: nextProps.timecnt })
  // }

  render() {
    return (
      <form
        className="text-right"
        onSubmit={this.props.handleConfirm}
        id="ProjectForm"
      >
        <div className="form-group row">
          <label htmlFor="inputName" className="col-sm-4 col-form-label">
            Name
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              value={this.props.name}
              className="form-control"
              onChange={this.props.handleChange}
              name="name"
              id="inputName"
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputClient" className="col-sm-4 col-form-label">
            Client
          </label>
          <div className="col-sm-8">
            <select
              className="form-control"
              value={this.props.client}
              onChange={this.props.handleChange}
              name="client"
              id="inputClient"
              required
            >
              <option value="" key="0">
                Select
              </option>
              { 
                this.props.clients.map(function(client) {
                return (
                  <option value={client.id} key={client.id}>
                    {client.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputYear" className="col-sm-4 col-form-label">
            Year
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              value={this.props.year}
              className="form-control"
              onChange={this.props.handleChange}
              name="year"
              id="inputYear"
              required
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
                value={this.props.deadline}
                className="form-control date-custom"
                onChange={this.props.handleChange}
                name="deadline"
                id="inputDeadline"
                required
              />
            </div>
          </div>
        </div>
        {this.props.modalTitle === "Add" && (
        <div className="form-group row">
          <label htmlFor="inputDataType" className="col-sm-4 col-form-label">
            Data type
          </label>
          <div className="col-sm-8">
            <select
              className="form-control"
              value={this.props.data_type}
              onChange={this.props.handleChange}
              name="data_type"
              id="inputDataType"
              required
            >
              <option value="" key="0">
                Select
              </option>
              <option value={1} key={1}>
                Image
              </option>
              <option value={2} key={2}>
                Text
              </option>
              <option value={3} key={3}>
                Audio
              </option>
            </select>
          </div>
        </div>
        )}
        {this.props.modalTitle === "Edit" && (
          <div className="form-group row">
            <label htmlFor="inputName" className="col-sm-4 col-form-label">
              Data type
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                value={this.data_type[this.props.data_type - 1]}
                className="form-control"
                onChange={this.props.handleChange}
                name="data_type_edit"
                id="inputName"
                readOnly
              />
            </div>
          </div>
        )}
        {this.props.modalTitle === "Edit" && (
          <div className="form-group row">
            <label htmlFor="inputName" className="col-sm-4 col-form-label">
              Task type
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                value={this.annotation_type[this.props.task_type - 1]}
                className="form-control"
                onChange={this.props.handleChange}
                name="task_type_edit"
                id="inputName"
                readOnly
              />
            </div>
          </div>
        )}
        {this.props.modalTitle === "Add" && (
        <div className="form-group row">
          <label htmlFor="inputTaskType" className="col-sm-4 col-form-label">
            Task type
          </label>
          <div className="col-sm-8">
            <select
              className="form-control"
              value={this.props.task_type}
              onChange={this.props.handleChange}
              name="task_type"
              id="inputTaskType"
              required
            >
              <option value="" key="0">
                Select
              </option>
              {this.props.data_type === "1" && (
                <React.Fragment>
                  <option value={7} key={7}>
                    {this.annotation_type[6]}
                  </option>
                  <option value={1} key={1}>
                    {this.annotation_type[0]}
                  </option>
                  <option value={2} key={2}>
                    {this.annotation_type[1]}                  
                  </option>
                  <option value={5} key={5}>
                  {this.annotation_type[4]}
                  </option>
                  <option value={6} key={6}>
                  {this.annotation_type[5]}
                  </option>
                </React.Fragment>
              )}
              {this.props.data_type === "2" && (
                <React.Fragment>
                  <option value={3} key={3}>
                    {this.annotation_type[2]}
                  </option>
                </React.Fragment>
              )}
              {this.props.data_type === "3" && (
                <React.Fragment>
                  <option value={4} key={4}>
                    {this.annotation_type[3]}
                  </option>
                </React.Fragment>
              )}
            </select>
          </div>
        </div>
        )}
        <div className="form-group row">
          <label htmlFor="inputLabels" className="col-sm-4 col-form-label">
            Labels
          </label>
          <div className="col-sm-8 text-left">
            <TagsInput
              value={this.props.tags}
              onChange={this.props.handleChangeTags}
            />
            {this.props.tags.length === 0 && (
              <span className="text-left">There must be one label at least</span>
            )}
          </div>
        </div>
  
        {/* {props.modalTitle === "Add" &&  */}
        <div className="form-group row">
          <label htmlFor="inputMainFile" className="col-sm-4 col-form-label">
            Zip file
          </label>
          <div className="col-sm-8">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputMainFile"
                name="main_file"
                // value="http://192.168.0.116:3400/media/archive_file.zip"
                // value="/home/python/Downloads/archive_file.zip"
                onChange={e => this.props.handleChangeFile(e)}
              />
              <label
                className="custom-file-label text-left"
                htmlFor="inputMainFile"
              >
                {this.props.main_file === "" && <span>Choose File</span>}
                {this.props.main_file !== "" &&
                  this.props.main_file.files[0].length !== 0 && (
                    <span>{this.props.main_file.files[0].name}</span>
                  )}
              </label>
            </div>
          </div>
        </div>
  
        <div className="form-group row">
          <label htmlFor="inputDkFile" className="col-sm-4 col-form-label">
            DK Zip file
          </label>
          <div className="col-sm-8">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputDkFile"
                name="dk_file"
                // value="http://192.168.0.116:3400/media/archive_file.zip"
                onChange={e => this.props.handleChangeFile(e)}
              />
              <label
                className="custom-file-label text-left"
                htmlFor="inputDkFile"
              >
                {this.props.dk_file === "" && <span>Choose File</span>}
                {this.props.dk_file !== "" && (
                  <span>{this.props.dk_file.files[0].name}</span>
                )}
              </label>
            </div>
          </div>
        </div>
  
        <div className="form-group row">
          <label
            htmlFor="inputAnnotationType"
            className="col-sm-4 col-form-label"
          >
            Annotation type
          </label>
          <div className="col-sm-8">
            <select
              className="form-control"
              value={this.props.annotation_type}
              onChange={this.props.handleChange}
              name="annotation_type"
              id="inputAnnotationType"
              required
            >
              <option value="" key="0">
                Select
              </option>
              <option value={1} key={1}>
                JSON
              </option>
              <option value={2} key={2}>
                XML
              </option>
            </select>
          </div>
        </div>
        
        {/* <div className="form-group row">
          <div className="col-md-10 offset-md-1">
            <ProgressBar animated name="progressbar" now={this.props.timecnt == -1 ? 100 : this.props.timecnt > 95 ? 95 : this.props.timecnt} />
          </div>
        </div> */}
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.props.toggle}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" form="ProjectForm">
            Confirm
          </button>
        </div>
      </form>
    );
  }
  
};

export default ProjectForm;
