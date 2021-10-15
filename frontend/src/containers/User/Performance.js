import React, { Component } from "react";
//import { confirmAlert } from "react-confirm-alert";
//import "react-confirm-alert/src/react-confirm-alert.css";
import UserTasksFilter from "../../components/Forms/Tasks/UserTasksFilter";
import { getUserTasks } from "../../API/TasksRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import { getProjects } from "../../API/ProjectsRequests";
//import { saveLog } from "../../API/LogsRequests";
import Modal from "../../components/Modal";
import UserActions from "../../components/actions/UserActions";
import UserPerformanceTable from "../../components/tables/UserPerformanceTable";

export default class Performance extends Component {
  state = {
    user: {},
    task_id: "",
    project_name: "",
    project_type: 0,
    task_type: 0,
    assigned_user: "",
    itemsFrom: 0,
    itemsTo: 0,
    completionFrom: 0,
    completionTo: 0,
    deadline: "",
    assigned_user_id: 0,
    num: 0,
    tasks: [],
    projects: [],
    selectAll: 0,
    component: 1
  };

  handleFilter = e => {
    e.preventDefault();

    getUserTasks({ user_id: this.state.user.id }).then(tasks => {
      tasks = this.tasksProjectsBind(tasks, this.state.projects);

      tasks = tasks.filter(task => {
        return task.project_name.includes(this.state.project_name);
      });

      tasks = tasks.filter(task => {
        return task.task_id.includes(this.state.task_id);
      });

      /* tasks = tasks.filter(task => {
        return task.assigned_user.includes(this.state.assigned_user);
      }); */

      tasks = tasks.filter(task => {
        return task.deadline.includes(this.state.deadline);
      });

      // ncompleted
      if (
        this.state.completionTo !== "" &&
        parseInt(this.state.completionFrom) !== 0
      ) {
        // from = full
        if (
          this.state.completionTo !== "" &&
          parseInt(this.state.completionTo) !== 0
        ) {
          // from = full, to = full
          tasks = tasks.filter(task => {
            return (
              task.ncompleted >= this.state.completionFrom &&
              task.ncompleted <= this.state.completionTo
            );
          });
        } else {
          // from = full, to = empty
          tasks = tasks.filter(task => {
            return task.ncompleted >= this.state.completionFrom;
          });
        }
      } else {
        // from = empty
        if (
          this.state.completionTo !== "" &&
          parseInt(this.state.completionTo) !== 0
        ) {
          // from = empty, to = full
          tasks = tasks.filter(task => {
            return task.ncompleted <= this.state.completionTo;
          });
        }
      }
      // nitems
      if (this.state.itemsTo !== "" && parseInt(this.state.itemsFrom) !== 0) {
        // from = full
        if (this.state.itemsTo !== "" && parseInt(this.state.itemsTo) !== 0) {
          // from = full, to = full
          tasks = tasks.filter(task => {
            return (
              task.nitems >= this.state.itemsFrom &&
              task.nitems <= this.state.itemsTo
            );
          });
        } else {
          // from = full, to = empty
          tasks = tasks.filter(task => {
            return task.nitems >= this.state.itemsFrom;
          });
        }
      } else {
        // from = empty
        if (this.state.itemsTo !== "" && parseInt(this.state.itemsTo) !== 0) {
          // from = empty, to = full
          tasks = tasks.filter(task => {
            return task.nitems <= this.state.itemsTo;
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
    window.location.reload();
  };

  /* Functions */

  getTaskProject = (id, projects) => {
    let taskProject = {};
    projects.forEach(project => {
      if (project.id === id) taskProject = project;
    });
    return taskProject;
  };

  getProjectName = (id, projects) => {
    let projectName = "";
    projects.forEach(project => {
      if (project.id === id) projectName = project.name;
    });
    return projectName;
  };

  tasksProjectsBind = (tasks, projects) => {
    tasks.map(task => {
      const project = this.getTaskProject(task.project, projects);
      task.project_name = this.getProjectName(task.project, projects);
      task.project_type = project.data_type;
      task.task_type = project.task_type;
      task.deadline = project.deadline;
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

    this.setState({
      tasks,
      selectAll: 2
    });
  };

  toggleSelectAll = () => {
    let tasks, selectAll;
    if (this.state.selectAll === 0) {
      tasks = this.toggleCheckedTasks([...this.state.tasks], true);
      selectAll = 1;
    } else {
      tasks = this.toggleCheckedTasks([...this.state.tasks], false);
      selectAll = 0;
    }
    this.setState({ tasks, selectAll });
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
        this.setState({
          component: 1,
          tasks: this.tasksProjectsBind(tasks, projects),
          projects,
          user
        });
      });
    });
  }

  render() {
    const {
      project_name,
      task_id,
      assigned_user,
      itemsFrom,
      itemsTo,
      completionFrom,
      completionTo,
      deadline,
      tasks,
      selectAll,
      modalTitle,
      component
    } = this.state;
    return (
      <div>
        <div className="bnt-actions text-center">
          {/* <UserActions
            handleRefresh={this.handleRefresh}
            setFormToLoad={this.setFormToLoad}
          > */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleRefresh}
          >
            View
          </button>
          <button type="button" className="btn btn-primary ml-4">
            Archive
          </button>
          {/* </UserActions> */}
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Task Status</span>
            <hr />
            <UserPerformanceTable
              selectAll={selectAll}
              data={tasks}
              toggleRow={this.toggleRow}
              toggleSelectAll={this.toggleSelectAll}
            />
          </div>
        </div>
        <div className="content-footer">
          <Modal modalTitle={modalTitle}>
            <UserTasksFilter
              component={component}
              project_name={project_name}
              task_id={task_id}
              assigned_user={assigned_user}
              itemsFrom={itemsFrom}
              itemsTo={itemsTo}
              completionFrom={completionFrom}
              completionTo={completionTo}
              deadline={deadline}
              handleChange={this.handleChange}
              handleConfirm={this.handleFilter}
            />
          </Modal>
        </div>
      </div>
    );
  }
}
