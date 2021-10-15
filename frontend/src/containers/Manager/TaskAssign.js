import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
// import ManagerActions from "../../components/actions/ManagerActions";
import TasksAssignTable from "../../components/tables/TasksAssignTable";
import TaskAssignUser from "../../components/Forms/Tasks/TaskAssignUser";
import TasksAssignStatusFilter from "../../components/Forms/Tasks/TasksAssignStatusFilter";
import {
  getUserTasks,
  assignTask,
  unAssignUser
} from "../../API/TasksRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import { getUsers } from "../../API/UsersRequests";
import { getProjects } from "../../API/ProjectsRequests";
import { saveLog } from "../../API/LogsRequests";
import Modal from "../../components/Modal";
import $ from "jquery";

export default class TaskAssign extends Component {
  state = {
    project_name: "",
    task_id: "",
    assigned_user: "",
    from: 0,
    to: 0,
    deadline: "",
    assigned_user_id: 0,
    num: 0,
    tasks: [],
    users: [],
    projects: [],
    selectAll: 0,
    component: 0,
    user: {},
    selectedTasks: [],
  };

  handleFilter = e => {
    e.preventDefault();

    getUserTasks({ user_id: this.state.user.id }).then(tasks => {
      tasks = this.tasksProjectsBind(
        tasks,
        this.state.projects,
        this.state.users
      );
      tasks = tasks.filter(task => {
        return task.project_name.includes(this.state.project_name);
      });

      tasks = tasks.filter(task => {
        return task.task_id.includes(this.state.task_id);
      });

      tasks = tasks.filter(task => {
        return task.assigned_user.includes(this.state.assigned_user);
      });

      tasks = tasks.filter(task => {
        return task.deadline.includes(this.state.deadline);
      });

      if (this.state.to !== "" && parseInt(this.state.from) !== 0) {
        // from = full
        if (this.state.to !== "" && parseInt(this.state.to) !== 0) {
          // from = full, to = full
          tasks = tasks.filter(task => {
            return (
              task.nitems >= this.state.from && task.nitems <= this.state.to
            );
          });
        } else {
          // from = full, to = empty
          tasks = tasks.filter(task => {
            return task.nitems >= this.state.from;
          });
        }
      } else {
        // from = empty
        if (this.state.to !== "" && parseInt(this.state.to) !== 0) {
          // from = empty, to = full
          tasks = tasks.filter(task => {
            return task.nitems <= this.state.to;
          });
        }
      }

      this.setState({ tasks });
    });
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
            component: 0,
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

  handleAssignTask = e => {
    e.preventDefault();
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });

    if (tasks.length > 0) {
      this.assignTasks(tasks);
      $("#baseModal").modal("hide");
    }
  };

  assignTasks = tasks => {
    const assignPromises = [];
    tasks.forEach(task => {
      assignPromises.push(
        assignTask({
          user_id: this.state.assigned_user_id,
          task_id: task.id
        }).then(res => {
          saveLog({
            activity: `Task ${task.task_id} assigned to ${this.getUserId(
              parseInt(this.state.assigned_user_id),
              this.state.users
            )}`,
            user: getLoggedUser().id
          });
        })
      );
    });
    Promise.all(assignPromises).then(values => {
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

  handleUnAssignTask = () => {
    let tasks = [...this.state.tasks];
    tasks = tasks.filter(task => {
      return task.checked;
    });
    let taskids = [];
    tasks.map(task => {
      taskids.push(task.id);
    });
    this.unAssignTasks({'taskids': taskids});
    // if (tasks.length > 0) {
    //   confirmAlert({
    //     customUI: ({ onClose }) => {
    //       return (
    //         <div className="custom-ui text-center">
    //           <h2>Un-Assign</h2>
    //           <p>Are you want to un-assign to any user?</p>
    //           <button className="btn btn-success mr-1" onClick={onClose}>
    //             No
    //           </button>
    //           <button
    //             className="btn btn-danger"
    //             onClick={() => {
    //               this.unAssignTasks(tasks);
    //               onClose();
    //             }}
    //           >
    //             Yes
    //           </button>
    //         </div>
    //       );
    //     }
    //   });
    // }
  };

  unAssignTasks = task => {
    unAssignUser(task)
    .then(res => {
      const user = getLoggedUser();
      getUserTasks({ user_id: user.id }).then(tasks => {
        getProjects().then(projects => {
          getUsers().then(users => {
            this.setState({
              component: 0,
              tasks: this.tasksProjectsBind(tasks, projects, users),
              projects,
              users,
              user
            });
          });
        });
      });
    });
    // const unAssignPromises = [];
    // tasks.forEach(task => {
    //   unAssignPromises.push(unAssignUser({ task_id: task.id }));
    // });
    // Promise.all(unAssignPromises).then(values => {
    //   getUserTasks({ user_id: this.state.user.id }).then(tasks => {
    //     getProjects().then(projects => {
    //       getUsers().then(users => {
    //         this.setState({
    //           tasks: this.tasksProjectsBind(tasks, projects, users),
    //           projects,
    //           users
    //         });
    //       });
    //     });
    //   });
    // });
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

  getUserId = (id, users) => {
    let user_id = "";
    users.forEach(user => {
      if (user.id === id) user_id = user.user_id;
    });
    return user_id;
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
    updTask.checked = updTask.checked === true ? false : true;

    let tasks = [...this.state.tasks];
    tasks.splice(tasks.indexOf(task), 1, updTask);

    let  selectedTasks = [];
    selectedTasks = tasks.filter(task => {
      return task.checked;
    });
    this.setState({selectedTasks});

    this.setState({
      tasks,
      selectAll: 2,
      selectedTasks
    });
  };

  toggleSelectAll = () => {
    let tasks, selectAll;
    let selectedTasks = [];
    if (this.state.selectAll === 0) {
      tasks = this.toggleCheckedTasks([...this.state.tasks], true);
      selectAll = 1;
      selectedTasks = tasks;
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
    return tasks;
  };

  componentDidMount() {
    const user = getLoggedUser();
    getUserTasks({ user_id: user.id }).then(tasks => {
      getProjects().then(projects => {
        getUsers().then(users => {
          this.setState({
            component: 0,
            tasks: this.tasksProjectsBind(tasks, projects, users),
            projects,
            users,
            user,
            selectedTasks: [],
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
        <TaskAssignUser
          users={users}
          tasks={tasks}
          assigned_user_id={assigned_user_id}
          handleConfirm={this.handleAssignTask}
          handleChange={this.handleChange}
        />
      );
    }
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
              onClick={() => this.setFormToLoad(2, "Assign")}
              data-toggle="modal"
              data-target="#baseModal"
              disabled={this.state.selectedTasks.length === 0 ? true : false}
            >
              Assign
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={this.handleUnAssignTask}
              disabled={this.state.selectedTasks.length === 0 ? true : false}
            >
              Unassign
            </button>
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Task Assign</span>
            <hr />
            <TasksAssignTable
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
