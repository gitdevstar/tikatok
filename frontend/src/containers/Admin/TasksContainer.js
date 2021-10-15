import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import TasksTable from "../../components/tables/TasksTable";
import Modal from "../../components/Modal";
import TaskForm from "../../components/Forms/Tasks/TaskForm";
// import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import {
  getTasks,
  saveTask,
  deleteTask,
  updateTask,
  assignTask,
  unassingManager,
  unassignManager,
} from "../../API/TasksRequests";
import { getProjects } from "../../API/ProjectsRequests";
import { getUsers } from "../../API/UsersRequests";
import { saveLog } from "../../API/LogsRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import DeleteTasks from "../../components/Forms/Tasks/DeleteTasks";
import $ from "jquery";
import AssignTask from "../../components/Forms/Tasks/AssignTask";
import TasksFilter from "../../components/Forms/Tasks/TasksFilter";
export default class TasksContainer extends Component {
  state = {
    taskId: 0,
    project: 0,
    number_of_tasks: 0,
    repeatability: 0,
    tika_score_flag: 0,
    assigned_manager_id: 0,
    tasks: [],
    projects: [],
    users: [],
    formToLoad: 0,
    selectAll: 0,
    selectedTasks: 0,
    modalTitle: "",
    errMsg: "",
    project_name: "",
    task_id: "",
    data_type: 0,
    status: 0,
    assignedManager: "",
    assignedUser: ""
  };

  /* Table Methods */
  toggleRow = task => {
    let selectedTasks = this.state.selectedTasks;

    task.checked = task.checked === true ? false : true;

    let tasks = [...this.state.tasks];
    tasks.splice(tasks.indexOf(task), 1, task);

    if (task.checked) selectedTasks++;
    else selectedTasks--;

    this.setState({
      tasks,
      selectAll: 2,
      selectedTasks,
      selectedTask: task
    });
    if (selectedTasks === 1) {
      this.selectedTask();
    }
  };

  toggleSelectAll = () => {
    let tasks,
      selectAll,
      selectedTasks,
      selected = {};
    if (this.state.selectAll === 0) {
      tasks = this.toggleCheckedTasks([...this.state.tasks], true);
      selectAll = 1;
      if (tasks.length === 1) selected = tasks[0];
    } else {
      tasks = this.toggleCheckedTasks([...this.state.tasks], false);
      selectAll = 0;
      selectedTasks = 0;
    }
    this.setState({ tasks, selectAll, selected, selectedTasks });
  };

  selectedTask = () => {
    let tasks = [...this.state.tasks];
    let task = tasks.filter(task => {
      return task.checked;
    });
    if (task.length > 0)
      this.setState({
        taskId: task[0].id,
        project: task[0].project,
        number_of_tasks: task[0].number_of_tasks,
        repeatability: task[0].repeatability,
        tika_score_flag: task[0].tika_score_flag
      });
  };

  toggleSwitchRow = task => {
    let tasks = [...this.state.tasks];
    let newTask = { ...task };
    newTask.tika_score_flag = newTask.tika_score_flag === 1 ? 0 : 1;
    tasks.splice(tasks.indexOf(task), 1, newTask);
    this.setState({ tasks });
    updateTask({ id: task.id, tika_score_flag: newTask.tika_score_flag }).then(
      res => {}
    );
  };

  /* Handle Functions */
  handleAdd = () => {
    const {
      project,
      number_of_tasks,
      repeatability,
      tika_score_flag
    } = this.state;
    this.setState({ selectAll: 0 });
    if (!this.validateTaskForm()) {
      const task = {
        project,
        number_of_tasks,
        repeatability,
        tika_score_flag
      };
      saveTask(task).then(res => {
        if (res.response) {
          this.setState({ errMsg: res.response.data[0].error });
        } else {
          saveLog({
            activity: `Created task ${res.task.task_id}`,
            user: getLoggedUser().id
          });
          getTasks().then(data => {
            this.setState({ tasks: data });
          });
        }
      });

      this.resetTaskForm();
      this.resetRowSelected();
      $("#baseModal").modal("hide");
    }
  };

  handleDelete = e => {
    this.setFormToLoad(3);
    $("#baseModal").modal("show");
  };

  handleAssign = e => {
    e.preventDefault();
    e.preventDefault();
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });

    if (tasks.length > 0) {
      this.assignTasks(tasks);
    }
    $("#baseModal").modal("hide");
  };

  handleUnassign = () => {
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });
    
    if(tasks.length > 0) {
      this.unassignTasks(tasks);
    }
  }

  unassignTasks = tasks => {
    let taskids = [];
    tasks.forEach(task => {
      taskids.push(task.id);
    });
    unassignManager({taskids: taskids}).then(res => {
      saveLog({
        activity: `Unassign Managers`,
        user: getLoggedUser().id
      });
      getTasks().then(data => {
        this.setState({tasks: data});
      });
    });
  }

  assignTasks = tasks => {
    const { assigned_manager_id } = this.state;
    const assignPromises = [];
    tasks.forEach(task => {
      assignPromises.push(
        assignTask({
          user_id: assigned_manager_id,
          task_id: task.id
        }).then(res => {
          saveLog({
            activity: `Assign task ${task.task_id} to ${this.getUserName(
              parseInt(assigned_manager_id)
            )}`,
            user: getLoggedUser().id
          });
        })
      );
    });
    Promise.all(assignPromises).then(values => {
      getTasks().then(data => {
        this.setState({ tasks: data });
      });
    });
  };

  handleDeleteTasks = e => {
    if (this.state.project !== 0) {
      $("#baseModal").modal("hide");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui text-center">
              <h2>Delete</h2>
              <p>You are sure to delete all tasks record?</p>
              <button className="btn btn-primary mr-1" onClick={onClose}>
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteTask(this.state.project).then(res => {
                    saveLog({
                      activity: `Delete all task of project ${this.getProjectId(
                        this.state.project
                      )}`,
                      user: getLoggedUser().id
                    });
                    getTasks().then(tasks => {
                      this.setState({
                        tasks: this.toggleCheckedTasks(tasks, false)
                      });
                    });
                  });
                  this.setState({ selectAll: 0, selectedTasks: 0 });
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          );
        }
      });
    }
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleConfirm = e => {
    e.preventDefault();
    if (this.state.formToLoad === 1) {
      if (this.state.taskId === 0) this.handleAdd();
      //else this.handleEdit();
    } else if (this.state.formToLoad === 2) {
      this.handleFilter();
    } else if (this.state.formToLoad === 3) {
      this.handleDeleteTasks();
    }
  };

  handleSwitchChange = () => {
    let tika_score_flag = this.state.tika_score_flag === 1 ? 0 : 1;
    this.setState({ tika_score_flag });
  };

  handleExport = e => {
    e.preventDefault();
    var element = document.createElement("a");
    var div = document.getElementById("btnDownload");
    let data = this.generateXMLData(this.state.tasks);

    element.setAttribute("href", "data:text/xml;charset=utf-8," + data);
    element.setAttribute("download", "data.xml");
    element.style.display = "none";
    div.appendChild(element);
    element.click();
    div.removeChild(element);
  };

  handleFilter = e => {
    e.preventDefault();
    getTasks().then(tasks => {
      tasks = tasks.filter(task => {
        return this.getProjectName(task.project).includes(
          this.state.project_name
        );
      });
      tasks = tasks.filter(task => {
        return task.task_id.includes(this.state.task_id);
      });
      if (this.state.data_type !== 0) {
        tasks = tasks.filter(task => {
          let projectType = this.getProjectType(task.project);
          return projectType === parseInt(this.state.data_type);
        });
      }
      if (this.state.status !== 0) {
        tasks = tasks.filter(task => {
          return task.status === parseInt(this.state.status);
        });
      }
      if (this.state.assignedManager !== "") {
        tasks = tasks.filter(task => {
          let managerName = "";
          if (task.assigned_manager_id !== null) {
            managerName = this.getUserName(task.assigned_manager_id);
            return managerName.includes(this.state.assignedManager);
          } else {
            return false;
          }
        });
      }
      if (this.state.assignedUser !== "") {
        tasks = tasks.filter(task => {
          if (task.assigned_user_id !== null) {
            let userName = this.getUserName(task.assigned_user_id);
            return userName.includes(this.state.assignedManager);
          } else {
            return false;
          }
        });
      }
      this.setState({ tasks });
      $("#baseModal").modal("hide");
    });
  };

  handleRefresh = () => {
    getProjects().then(projects => {
      getUsers().then(users => {
        getTasks().then(tasks => {
          this.setState({
            projects,
            users,
            tasks: this.toggleCheckedTasks(tasks, false),
            selectedTasks: 0,
          });
        });
      });
    });
  };

  /* Functions */
  resetTaskForm = () => {
    this.setState({
      projectId: 0,
      project: 0,
      number_of_tasks: 0,
      repeatability: 0,
      tika_score_flag: 0
    });
  };

  resetRowSelected = () => {
    this.setState({ selectAll: 0, selectedTasks: 0 });
  };

  validateTaskForm = () => {
    if (
      this.state.project === "" ||
      this.state.number_of_tasks === "" ||
      this.state.repeatability === "" ||
      this.state.tika_score_flag === ""
    )
      return true;
    else return false;
  };

  setFormToLoad = num => {
    this.setState({ formToLoad: num });
  };

  getProjectName = id => {
    const { projects } = this.state;
    let projectName = "";
    projects.forEach(project => {
      if (project.id === id) projectName = project.name;
    });
    return projectName;
  };

  getProjectId = id => {
    const { projects } = this.state;
    let projectId = "";
    projects.forEach(project => {
      if (project.id === parseInt(id)) projectId = project.project_id;
    });
    return projectId;
  };

  getProjectType = id => {
    const { projects } = this.state;
    let projectType = 0;
    projects.forEach(project => {
      if (project.id === id) projectType = project.task_type;
    });
    return projectType;
  };

  getUserName = id => {
    const { users } = this.state;
    let userName = "";
    users.forEach(user => {
      if (user.id === id) userName = user.username;
    });
    return userName;
  };

  toggleCheckedTasks = (tasks, checked) => {
    tasks.map(task => {
      task.checked = checked;
      return task;
    });
    return tasks;
  };

  generateXMLData = tasks => {
    var xml = '<?xml version="1.0" encoding="iso-8859-1"?><objectlist>';
    tasks.forEach(obj => {
      xml += `<object pk="${obj.id}">`;
      xml += `<field name="id">${obj.id}</field>`;
      xml += `<field name="project">${this.getProjectName(
        obj.project
      )}</field>`;
      xml += `<field name="task_id">${obj.task_id}</field>`;
      xml += "</object>";
    });
    xml += "</objectlist>";
    return xml;
  };

  componentDidMount() {
    $("#btnDelete").prop("disabled", false);
    $("#btnDelete").click(() => this.handleDelete());
    getProjects().then(projects => {
      getUsers().then(users => {
        getTasks().then(tasks => {
          this.setState({
            projects,
            users,
            tasks: this.toggleCheckedTasks(tasks, false)
          });
        });
      });
    });
  }

  render() {
    const {
      selectedTasks,
      selectAll,
      selected,
      modalTitle,
      formToLoad,
      project,
      projects,
      number_of_tasks,
      repeatability,
      tika_score_flag,
      errMsg,
      users,
      assigned_manager_id,
      project_name,
      task_id,
      data_type,
      status,
      assignedManager,
      assignedUser
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
              this.resetTaskForm();
            }}
            name="modalTitle"
            value="Add"
            data-toggle="modal"
            data-target="#baseModal"
          >
            Add new
          </button>
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => {
              this.handleChange(e);
              this.setFormToLoad(2);
            }}
            disabled={this.state.selectedTasks >= 1 ? true : false}
            name="modalTitle"
            value="Filter"
            data-toggle="modal"
            data-target="#baseModal"
          >
            View
          </button>
          
          <button
            id="btnDelete"
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => this.handleDelete(e)}
          >
            Delete
          </button>
          {/* <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => this.handleExport(e)}
          >
            Export
          </button> */}
          
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => {
              this.handleChange(e);
              this.setFormToLoad(4);
            }}
            disabled={selectedTasks === 0? true : false}
            name="modalTitle"
            value="Assign"
            data-toggle="modal"
            data-target="#baseModal"
          >
            Assign
          </button>
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={this.handleUnassign}
            disabled={selectedTasks === 0? true : false}
          >
            Unassign
          </button>
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Tasks</span>
            <hr />
            <TasksTable
              data={this.state.tasks}
              toggleRow={this.toggleRow}
              toggleSelectAll={this.toggleSelectAll}
              selectAll={selectAll}
              selected={selected}
              getProjectType={this.getProjectType}
              getProjectName={this.getProjectName}
              getUserName={this.getUserName}
              toggleSwitchRow={this.toggleSwitchRow}
            />
          </div>
        </div>
        <div className="content-footer">
          <Modal modalTitle={modalTitle}>
            {formToLoad === 1 && (
              <TaskForm
                errMsg={errMsg}
                project={project}
                number_of_tasks={number_of_tasks}
                repeatability={repeatability}
                tika_score_flag={tika_score_flag}
                projects={projects}
                handleConfirm={this.handleConfirm}
                handleChange={this.handleChange}
                handleSwitchChange={this.handleSwitchChange}
              />
            )}
            {formToLoad === 2 && (
              <TasksFilter
                project_name={project_name}
                task_id={task_id}
                data_type={data_type}
                status={status}
                assignedManager={assignedManager}
                assignedUser={assignedUser}
                handleConfirm={this.handleFilter}
                handleChange={this.handleChange}
              />
            )}
            {formToLoad === 3 && (
              <DeleteTasks
                projects={projects}
                handleConfirm={this.handleConfirm}
                handleChange={this.handleChange}
                handleSwitchChange={this.handleSwitchChange}
              />
            )}

            {formToLoad === 4 && (
              <AssignTask
                users={users}
                assigned_manager_id={assigned_manager_id}
                handleConfirm={this.handleAssign}
                handleChange={this.handleChange}
              />
            )}
          </Modal>
        </div>
        <div id="btnDownload" />
      </div>
    );
  }
}
