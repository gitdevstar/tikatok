import React, { Component } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ManagerActions from "../../components/actions/ManagerActions";
import TasksStatusTable from "../../components/tables/TasksStatusTable";
import TaskInspectTool from "../../components/Forms/Tasks/TaskInspectTool";
import TasksAssignStatusFilter from "../../components/Forms/Tasks/TasksAssignStatusFilter";
import { getUserTasks, resetTask, assignTask, deliveryTasks } from "../../API/TasksRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import { getUsers } from "../../API/UsersRequests";
import { getProjects } from "../../API/ProjectsRequests";
import { saveLog } from "../../API/LogsRequests";
import Modal from "../../components/Modal";
import $ from "jquery";
export default class TaskStatus extends Component {
  state = {
    user: {},
    project_name: "",
    task_id: "",
    assigned_user: "",
    from: 0,
    to: 0,
    deadline: "",
    assigned_user_id: 0,
    num: 0,
    tasks: [],
    selectedTasks: [],
    users: [],
    projects: [],
    selectAll: 0,
    component: 1
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleRefresh = () => {
    const user = getLoggedUser();
    getUserTasks({ user_id: user.id }).then(tasks => {
      getProjects().then(projects => {
        getUsers().then(users => {
          this.setState({
            component: 1,
            tasks: this.tasksProjectsBind(tasks, projects, users),
            projects,
            users,
            user,
            selectedTasks: [],
          });
        });
      });
    });
  };

  handleReset = e => {
    e.preventDefault();
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });

    if (tasks.length > 0) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui text-center">
              <h2>Reset</h2>
              <p>You are sure to reset this task?</p>
              <button className="btn btn-primary mr-1" onClick={onClose}>
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.resetTasks(tasks);
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

  resetTasks = tasks => {
    const resetPromises = [];
    tasks.forEach(task => {
      resetPromises.push(
        resetTask({ task_id: task.id }).then(res => {
          saveLog({
            activity: `Reseted task ${task.task_id}`,
            user: getLoggedUser().id
          });
        })
      );
    });
    Promise.all(resetPromises).then(values => {
      getUserTasks({ user_id: this.state.user.id }).then(tasks => {
        getProjects().then(projects => {
          getUsers().then(users => {
            this.setState({
              tasks: this.tasksProjectsBind(tasks, projects, users),
              projects,
              users
            });
          });
        });
      });
    });
  };

  handleInspectTask = e => {
    e.preventDefault();

    let tool = "-tool";
    let task = this.state.selectedTasks[0];

    switch(task.type) {
      case 1:
        tool = "img-bbox" + tool;//image bounding
        break;
      case 2:
        tool = "img-classify" + tool;//image classify
        break;
      case 3:
        tool = "text" + tool;//image marker
        break;
      case 4:
        tool = "audio" + tool;//audio
        break;
      case 5:
        tool = "img-marker" + tool;//text
        break;
      case 6:
          tool = "img-semantic" + tool;//semantic
          break;
     }

    const location = {
      pathname: `${this.props.match.url}/${tool}`,
      state: { task: task }
    }    

    this.props.history.push(location);
  
  };

  handleInspectModal = (e) => {
    e.preventDefault();
    
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });

    
    if (tasks.length === 1) {
      this.setFormToLoad(2, "Inspect");
    }
  };

  /* Functions */
  getProjectName = (id, projects) => {
    let projectName = "";
    projects.forEach(project => {
      if (project.id === id) projectName = project.name;
    });
    return projectName;
  };

  getProjecDeadline = (id, projects) => {
    let deadline = "";
    projects.forEach(project => {
      if (project.id === id) deadline = project.deadline;
    });
    return deadline;
  };
  getProjecType = (id, projects) => {
    let projecttype = "";
    projects.forEach(project => {
      if (project.id === id) projecttype = project.task_type;
    });
    return projecttype;
  };

  getUserName = (id, users) => {
    let userName = "";
    users.forEach(user => {
      if (user.id === id) userName = user.username;
    });
    return userName;
  };

  tasksProjectsBind = (tasks, projects, users) => {
    tasks.map(task => {
      task.project_name = this.getProjectName(task.project, projects);
      task.assigned_user = this.getUserName(task.assigned_user_id, users);
      task.deadline = this.getProjecDeadline(task.project, projects);
      task.type = this.getProjecType(task.project, projects);
      return task;
    });
    return tasks;
  };

  setFormToLoad = (num, modalTitle) => {
    this.setState({ formToLoad: num, modalTitle });
  };

  /* Table Methods */
  toggleRow = task => {
    let updTask = task;
    let  selectedTasks = [];
    let tasks = [...this.state.tasks];

    updTask.checked = updTask.checked === true ? false : true;
    tasks.splice(tasks.indexOf(task), 1, updTask);
  
    selectedTasks = tasks.filter(task => {
      return task.checked;
    });

    this.setState({
      tasks,
      selectAll: 2,
      selectedTasks,
    });
  };

  toggleSelectAll = () => {
    let tasks, selectAll;
    let selectedTasks = [];
    if (this.state.selectAll === 0) {
      tasks = this.toggleCheckedTasks([...this.state.tasks], true);
      selectedTasks = tasks;
      selectAll = 1;
    } else {
      tasks = this.toggleCheckedTasks([...this.state.tasks], false);
      selectAll = 0;
    }
    this.setState({ tasks, selectAll, selectedTasks });
  };

  toggleCheckedTasks = (tasks, checked) => {
    tasks.map(task => {
      task.checked = checked;
      return task;
    });

    this.setState({inspectTask:tasks});
    return tasks;
  };

  handleDelivery = () => {
    let {
      selectedTasks
    } = this.state;

    let taskids = []

    selectedTasks.map(task => {
      taskids.push(task.id);
    });

    deliveryTasks({'taskids': taskids})
    .then(res => {
      const user = getLoggedUser();
      getUserTasks({ user_id: user.id }).then(tasks => {
        getProjects().then(projects => {
          getUsers().then(users => {
            this.setState({
              component: 1,
              tasks: this.tasksProjectsBind(tasks, projects, users),
              projects,
              users,
              user,
              selectedTasks: [],
            });
          });
        });
      });
    });
  };

  componentDidMount() {
    const user = getLoggedUser();
    getUserTasks({ user_id: user.id }).then(tasks => {
      getProjects().then(projects => {
        getUsers().then(users => {
          this.setState({
            component: 1,
            tasks: this.tasksProjectsBind(tasks, projects, users),
            projects,
            users,
            user
          });
        });
      });
    });
  }

  render() {
    const {
      project_name,
      task_id,
      assigned_user,
      from,
      to,
      assigned_user_id,
      tasks,
      users,
      selectAll,
      formToLoad,
      modalTitle,
      component
    } = this.state;
    let form = null;
    if (formToLoad === 1) {
      form = (
        <TasksAssignStatusFilter
          component={component}
          project_name={project_name}
          task_id={task_id}
          assigned_user={assigned_user}
          from={from}
          to={to}
          handleChange={this.handleChange}
          handleConfirm={this.handleFilter}
        />
      );
    } else if (formToLoad === 2) {
      form = (
        <TaskInspectTool
          users={users}
          assigned_user_id={assigned_user_id}
          handleConfirm={this.handleInspectTask}
          handleChange={this.handleChange}
        />
      );}
    
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
              onClick={this.handleInspectTask}
              disabled= {this.state.selectedTasks.length !== 1  || this.state.selectedTasks[0].status !== 2}
            >
              Inspect
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              disabled={this.state.selectedTasks.length === 0 ? true : false}
              onClick={this.handleDelivery}
            >
              Delivery
            </button>
            {/* <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={this.handleReset}
              disabled={this.state.selectedTasks.length !== 1? true : false}
            >
              Reset
            </button> */}

        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Task Status</span>
            <hr />
            <TasksStatusTable
              selectAll={selectAll}
              data={tasks}
              toggleRow={this.toggleRow}
              toggleSelectAll={this.toggleSelectAll}
            />
          </div>
        </div>
        <div className="content-footer">
          <Modal modalTitle={modalTitle}>{form}</Modal>
        </div>
      </div>
    );
  }
}
