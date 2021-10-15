import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
// import Modal from "../../components/Modal";
import ProjectForm from "../../components/Forms/Projects/ProjectForm";
import ProjectsFilter from "../../components/Forms/Projects/ProjectsFilter";
import ExportModal from "../../components/Forms/Projects/ExportModal";
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import {
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
  exportProject
} from "../../API/ProjectsRequests";
import { getClients } from "../../API/ClientsRequests";
import ProjectsTable from "../../components/tables/ProjectsTable";
import { saveLog } from "../../API/LogsRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import exportModal from "../../components/Forms/Projects/ExportModal";

export default class ProjectsContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      clients: [],
      projects: [],
      projectId: 0,
      name: "",
      year: "",
      deadline: "",
      data_type: 0,
      task_type: 0,
      labels: "",
      annotation_type: 0,
      main_file: "",
      dk_file: "",
      client: 0,
      tags: [],
      selectedProjects: 0,
      modalTitle: "",
      formToLoad: 0,
      selected: {},
      selectAll: 0,
      yearFrom: 0,
      yearTo: 0,
      project_id: "",
      modal: false,
      status: 0,
      // timecnt: 0,
      // isOn: false,
      // start: 0,
      withData: false,
    };
    this.toggle = this.toggle.bind(this);
    this.changeWithData = this.changeWithData.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  changeWithData() {
    this.setState({
      withData: !this.state.withData,
    });
  }

  toggleRow = project => {
    let selectedProjects = this.state.selectedProjects;

    let selectedProject = { ...project };
    selectedProject.checked = !selectedProject.checked;

    let projects = [...this.state.projects];
    projects.splice(projects.indexOf(project), 1, selectedProject);

    if (selectedProject.checked) selectedProjects++;
    else selectedProjects--;

    this.setState({
      projects,
      selectAll: 2,
      selectedProjects
    });
    if (selectedProjects === 1) {
      this.selectedProject();
    }

    project.checked = !project.checked;
  };

  toggleSelectAll = () => {
    let projects,
      selectAll,
      selectedProjects,
      selected = {};
    if (this.state.selectAll === 0) {
      projects = this.toggleCheckedProjects([...this.state.projects], true);
      selectAll = 1;
      if (projects.length === 1) selected = projects[0];
    } else {
      projects = this.toggleCheckedProjects([...this.state.projects], false);
      selectAll = 0;
      selectedProjects = 0;
    }
    this.setState({ projects, selectAll, selected, selectedProjects });
  };

  toggleCheckedProjects = (projects, checked) => {
    projects.map(project => {
      project.checked = checked;
      return project;
    });
    return projects;
  };

  selectedProject = () => {
    let projects = [...this.state.projects];
    let project = projects.filter(project => {
      return project.checked;
    });
    if (project.length === 1) {
      let tags;
      if (project[0].labels !== "") {
        tags = project[0].labels.split(",");
      }
      
      this.setState({
        projectId: project[0].id,
        name: project[0].name,
        year: project[0].year,
        deadline: project[0].deadline,
        data_type: project[0].data_type,
        task_type: project[0].task_type,
        labels: tags,
        tags,
        annotation_type: project[0].annotation_type,
        main_file: "",
        dk_file: "",
        client: project[0].client,
        project_id: project[0].project_id,
        status: project[0].status,
      });
    }
  };

  resetRowSelected = () => {
    this.setState({ selectAll: 0, selectedProjects: 0 });
  };

  resetProjectForm = () => {
    this.setState({
      projectId: 0,
      name: "",
      year: "",
      deadline: "",
      data_type: 0,
      task_type: 0,
      labels: "",
      annotation_type: 0,
      main_file: "",
      dk_file: "",
      client: 0,
      tags: []
    });
  };

  validateProjectForm = () => {
    if (
      this.state.name === "" ||
      this.state.year === "" ||
      this.state.deadline === "" ||
      this.state.data_type === 0 ||
      this.state.task_type === 0 ||
      this.state.labels === "" ||
      this.state.annotation_type === 0 ||
      this.state.main_file === "" ||
      this.state.dk_file === "" ||
      this.state.client === 0
    )
      return true;
    else return false;
  };

  validateEditProjectForm = () => {
    if (
      this.state.name === "" ||
      this.state.year === "" ||
      this.state.deadline === "" ||
      this.state.labels === "" ||
      this.state.annotation_type === 0 ||
      // this.state.main_file === "" ||
      // this.state.dk_file === "" ||
      this.state.client === 0
    )
      return true;
    else return false;
  };

  setFormToLoad = num => {
    this.setState({ formToLoad: num });
  };

  getClientName = id => {
    const { clients } = this.state;
    let clientName = "";
    clients.forEach(client => {
      if (client.id === id) clientName = client.name;
    });
    return clientName;
  };

  generateXMLData = projects => {
    var xml = '<?xml version="1.0" encoding="iso-8859-1"?><objectlist>';
    projects.forEach(obj => {
      xml += `<object pk="${obj.id}">`;
      xml += `<field name="id">${obj.id}</field>`;
      xml += `<field name="name">${obj.name}</field>`;
      xml += `<field name="client">${this.getClientName(obj.client)}</field>`;
      xml += `<field name="year">${obj.year}</field>`;
      xml += `<field name="data_type">${obj.data_type}</field>`;
      xml += `<field name="task_type">${obj.task_type}</field>`;
      xml += `<field name="labels">${obj.labels}</field>`;
      xml += `<field name="annotation_type">${obj.annotation_type}</field>`;
      xml += "</object>";
    });
    xml += "</objectlist>";
    return xml;
  };

  /* Handle Functions */
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleChangeTags = tags => {
    let uniqueTags = [...new Set(tags)];
    this.setState({ labels: uniqueTags.join(), tags: uniqueTags });
  };

  handleChangeFile = e => {
    e.preventDefault();
    const { name } = e.target;
    this.setState({
      [name]: e.target
    });
  };

  handleConfirm = e => {
    e.preventDefault();
    if (this.state.formToLoad === 1) {
      if (this.state.projectId === 0) this.handleAdd();
      else this.handleEdit();
    } else if (this.state.formToLoad === 2) {
      this.handleFilter();
    }
  };

  handleAdd = () => {
    const {
      name,
      year,
      deadline,
      data_type,
      task_type,
      labels,
      annotation_type,
      main_file,
      dk_file,
      client
    } = this.state;
    this.setState({ selectAll: 0 });

    if (!this.validateProjectForm()) {
      var formData = new FormData();
      
      formData.append("name", name);
      formData.append("year", parseInt(year));
      formData.append("deadline", deadline);
      formData.append("data_type", parseInt(data_type));
      formData.append("task_type", parseInt(task_type));
      formData.append("labels", labels);
      formData.append("annotation_type", parseInt(annotation_type));
      formData.append("main_file", main_file.files[0]);
      formData.append("dk_file", dk_file.files[0]);
      formData.append("client", client);
      
      saveProject(formData).then(res => {
        // console.log("progress end");
        // this.stopTimer();
        // console.log(this.state.timecnt);
        saveLog({
          activity: `Created project ${res.project.project_id}`,
          user: getLoggedUser().id
        });
        getProjects().then(projects => {
          this.setState({
            projects: this.toggleCheckedProjects(projects, false)
          });
        });
        this.resetProjectForm();
        this.resetRowSelected();
        // this.setState({timecnt: 0});
        this.toggle();
      });
      // console.log("progress start");
      // this.startTimer();
      // console.log(this.state.timecnt);
    }
  };

  // startTimer = () => {
  //   this.setState({
  //     isOn: true,
  //     timecnt: this.state.timecnt,
  //     start: Date.now() - this.state.timecnt
  //   })
  //   this.timer = setInterval(() => this.setState({
  //     timecnt: Date.now() - this.state.start
  //   }), 1);
  // }

  // stopTimer = () => {
  //   this.setState({isOn: false})
  //   clearInterval(this.timer)
  //   this.setState({timecnt: -1});
  // }

  // resetTimer = () => {
  //   this.setState({
  //     timecnt: 0, 
  //     isOn: false
  //   })
  // }

  handleEdit = () => {
    const {
      projectId,
      name,
      year,
      deadline,
      data_type,
      task_type,
      labels,
      annotation_type,
      main_file,
      dk_file,
      client
    } = this.state;
    if (!this.validateEditProjectForm()) {
      var formData = new FormData();
      formData.append("id", projectId);
      formData.append("name", name);
      formData.append("year", parseInt(year));
      formData.append("deadline", deadline);
      formData.append("labels", labels);
      formData.append("data_type", parseInt(data_type));
      formData.append("task_type", parseInt(task_type));
      formData.append("annotation_type", parseInt(annotation_type));
      if(main_file.files != undefined) {
        formData.append("main_file", main_file.files[0]);
      }
      if(dk_file.files != undefined) {
        formData.append("dk_file", dk_file.files[0]);
      }
      formData.append("client", client);
      updateProject(formData, projectId).then(res => {
        getProjects().then(projects => {
          this.setState({
            projects: this.toggleCheckedProjects(projects, false)
          });
        });
      });
      this.resetProjectForm();
      this.resetRowSelected();
      this.toggle();
    }
  };

  handleDelete = e => {
    let projects = [...this.state.projects];
    let message = "";
    projects = projects.filter(project => {
      return project.checked;
    });
    if (projects.length === 1)
      message = "Are you sure do you want to delete 1 project?";
    else if (projects.length > 1)
      message = `Are you sure do you want to delete ${
        projects.length
      } projects?`;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui text-center">
            <h2>Delete</h2>
            <p>{message}</p>
            <button className="btn btn-primary mr-1" onClick={onClose}>
              No
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.handleDeleteProjects(projects);
                this.setState({ selectAll: 0, selectedProjects: 0 });
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        );
      }
    });
  };

  handleDeleteProjects = projects => {
    let ids = [],
        deletedProjectName = '';
    for(var i = 0, len = projects.length; i < len; i++){
      ids.push(projects[i].id);
      deletedProjectName += projects[i].project_id + (i == len - 1) ? "" : ",";
    }
    deleteProject(ids).then(res => {
      saveLog({
        activity: `Deleted project ${deletedProjectName}`,
        user: getLoggedUser().id
      });
      getProjects().then(projects => {
        this.setState({
          projects: this.toggleCheckedProjects(projects, false)
        });
      });
    });
  };

  handleDeleteProject = (projectId, logText) => {
    deleteProject(projectId).then(res => {
      saveLog({
        activity: `Deleted project ${logText}`,
        user: getLoggedUser().id
      });
      getProjects().then(projects => {
        this.setState({
          projects: this.toggleCheckedProjects(projects, false)
        });
      });
    });
  };

  handleExport = e => {
    e.preventDefault();
    console.log("export");
    let projects = [...this.state.projects];
    let project = projects.filter(project => {
      console.log("return");
      return project.checked;
    });
    console.log("project", project);
    if (project.length === 1) {
      if(project[0].status == 4) { // only delivery ready status 
        console.log("export");
        exportProject(project[0].project_id, project[0].id, this.state.withData ? 1 : 0);
        this.setState({
          withData: false,
        });
      }
    }
    this.toggle();
  };

  handleFilter = () => {
    getProjects().then(projects => {
      projects = projects.filter(project => {
        return project.name.includes(this.state.name);
      });
      // year
      if (this.state.yearTo !== "" && parseInt(this.state.yearFrom) !== 0) {
        // yearFrom = full
        if (this.state.yearTo !== "" && parseInt(this.state.yearTo) !== 0) {
          // yearFrom = full, yearTo = full
          projects = projects.filter(project => {
            return (
              project.year >= this.state.yearFrom &&
              project.year <= this.state.yearTo
            );
          });
        } else {
          // yearFrom = full, yearTo = empty
          projects = projects.filter(project => {
            return project.year >= this.state.yearFrom;
          });
        }
      } else {
        // yearFrom = empty
        if (this.state.yearTo !== "" && parseInt(this.state.yearTo) !== 0) {
          // yearFrom = empty, yearTo = full
          projects = projects.filter(project => {
            return project.year <= this.state.yearTo;
          });
        }
      }
      // data type
      if (this.state.data_type !== 0) {
        projects = projects.filter(project => {
          return project.data_type === parseInt(this.state.data_type);
        });
      }
      // task type
      if (this.state.task_type !== 0) {
        projects = projects.filter(project => {
          return project.task_type === parseInt(this.state.task_type);
        });
      }
      this.setState({ projects });
      this.toggle();
    });
  };

  handleRefresh = () => {
    getClients().then(clients => {
      this.setState({ clients });
      getProjects().then(projects => {
        this.setState({
          projects: this.toggleCheckedProjects(projects, false),
          selectedProjects: 0,
        });
      });
    });
  };

  componentDidMount() {
    getClients().then(clients => {
      this.setState({ clients });
      getProjects().then(projects => {
        this.setState({
          projects: this.toggleCheckedProjects(projects, false)
        });
      });
    });
  }

  render() {
    const {
      clients,
      selectAll,
      selected,
      modalTitle,
      formToLoad,
      name,
      year,
      deadline,
      data_type,
      task_type,
      labels,
      annotation_type,
      main_file,
      dk_file,
      client,
      tags,
      selectedProjects,
      time,
    } = this.state;

    return (
      <div>
        <div className="bnt-actions text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleRefresh}
            >
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={e => {
                this.handleChange(e);
                this.setFormToLoad(1);
                this.resetProjectForm();
                this.toggle();
              }}
              name="modalTitle"
              value="Add"
            >
              Add new
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={e => {
                this.handleChange(e);
                this.setFormToLoad(2);
                this.toggle();
              }}
              disabled={this.state.selectedProjects >= 1 ? true : false}
              name="modalTitle"
              value="Filter"
              data-toggle="modal"
              data-target="#baseModal"
            >
              Filter
            </button>
            
            <button
              id="btnDelete"
              type="button"
              className="btn btn-primary ml-4"
              onClick={e => this.handleDelete(e)}
              disabled={this.state.selectedProjects === 0 ? true : false}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              name="modalTitle"
              value="Export Setting"
              onClick={e => {
                this.handleChange(e);
                this.setFormToLoad(3);
                this.selectedProject();
                this.toggle();
              }}
              disabled={selectedProjects !== 1 ? true : false}
            >
              Export
            </button>
              
            <button
              type="button"
              className="btn btn-primary ml-4"
              name="modalTitle"
              value="Edit"
              data-toggle="modal"
              data-target="#baseModal"
              disabled={selectedProjects !== 1 ? true : false}
              onClick={e => {
                this.handleChange(e);
                this.setFormToLoad(1);
                this.selectedProject();
                this.toggle();
              }}
            >
              Edit
            </button>
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Projects</span>
            <hr />
          </div>
          <ProjectsTable
            data={this.state.projects}
            toggleRow={this.toggleRow}
            toggleSelectAll={this.toggleSelectAll}
            selectAll={selectAll}
            selected={selected}
            getClientName={this.getClientName}
          />
        </div>
        <div className="content-footer">
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
              <ModalBody>
                {formToLoad === 1 && (
                  <ProjectForm
                    clients={clients}
                    name={name}
                    year={year}
                    deadline={deadline}
                    data_type={data_type}
                    task_type={task_type}
                    labels={labels}
                    modalTitle={modalTitle}
                    annotation_type={annotation_type}
                    main_file={main_file}
                    dk_file={dk_file}
                    client={client}
                    tags={tags}
                    timecnt={this.state.timecnt}
                    handleChange={this.handleChange}
                    handleConfirm={this.handleConfirm}
                    handleChangeFile={this.handleChangeFile}
                    handleChangeTags={this.handleChangeTags}
                    toggle={this.toggle}
                  />
                )}
                
                {formToLoad === 2 && (
                  <ProjectsFilter
                    handleConfirm={this.handleConfirm}
                    handleChange={this.handleChange}
                    setFormToLoad={this.setFormToLoad}
                    toggle={this.toggle}
                  />
                )}
                {formToLoad === 3 && (
                  <ExportModal
                    exportData={this.handleExport}
                    changeWithData={this.changeWithData}
                    toggle={this.toggle}
                  />
                )}
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div id="btnDownload" />
      </div>
    );
  }
}
