import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import UserTasksFilter from "../../components/Forms/Tasks/UserTasksFilter";
import {
  getUserTasks,
  relinquishTask,
  completeTask
} from "../../API/TasksRequests";
import { getLoggedUser } from "../../API/LoginRequests";
import { getProjects } from "../../API/ProjectsRequests";
import { saveLog } from "../../API/LogsRequests";
import Modal from "../../components/Modal";
// import UserActions from "../../components/actions/UserActions";
import UserTasksTable from "../../components/tables/UserTasksTable";

export default class Tasks extends Component {
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
    component: 0,
    selectedtasks: 0,
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
    const user = getLoggedUser();
    getUserTasks({ user_id: user.id }).then(tasks => {
      getProjects().then(projects => {
        this.setState({
          component: 0,
          tasks: this.tasksProjectsBind(tasks, projects),
          projects,
          user,
          selectedtasks: 0,
        });
      });
    });
  };

  handleRelinquish = e => {
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
              <h2>Relinquish</h2>
              <p>You are sure to relinquish this task?</p>
              <button className="btn btn-primary mr-1" onClick={onClose}>
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.relinquishTasks(tasks);
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

  relinquishTasks = tasks => {
    const relinquishedPromises = [];
    tasks.forEach(task => {
      relinquishedPromises.push(
        relinquishTask({ task_id: task.id }).then(res => {
          saveLog({
            activity: `Task ${task.task_id} relinquished`,
            user: getLoggedUser().id
          });
        })
      );
    });
    Promise.all(relinquishedPromises).then(values => {
      getUserTasks({ user_id: this.state.user.id }).then(tasks => {
        getProjects().then(projects => {
          this.setState({
            tasks: this.tasksProjectsBind(tasks, projects),
            projects
          });
        });
      });
    });
  };

  handleComplete = e => {
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
              <h2>Complete</h2>
              <p>You are sure to complete this record?</p>
              <button className="btn btn-primary mr-1" onClick={onClose}>
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.completeTasks(tasks);
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

  completeTasks = tasks => {
    const completedPromises = [];
    tasks.forEach(task => {
      completedPromises.push(task.id);
    });

    completeTask(completedPromises).then(res => {
      saveLog({
        activity: `Task completed`,
        user: getLoggedUser().id
      });
      return res;
    });
    
    getUserTasks({ user_id: this.state.user.id }).then(tasks => {
      getProjects().then(projects => {
        this.setState({
          tasks: this.tasksProjectsBind(tasks, projects),
          projects
        });
      });
    });
    // Promise.all(completedPromises).then(values => {
    //   if (values.length > 0) {
    //     let error = values[0].response;
    //     if (error.status === 400) {
    //       // Bad request
    //       confirmAlert({
    //         customUI: ({ onClose }) => {
    //           return (
    //             <div className="custom-ui text-center">
    //               <h2>Error</h2>
    //               <p>{error.data[0].error}</p>
    //               <button className="btn btn-danger mr-1" onClick={onClose}>
    //                 Ok
    //               </button>
    //             </div>
    //           );
    //         }
    //       });
    //     }
    //   }
      
    // });
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
    let {
      selectedtasks
    } = this.state;
    let updTask = task;
    updTask.checked = updTask.checked === true ? false : true;
    if (updTask.checked) {
      selectedtasks += 1;
    }
    else {
      selectedtasks -= 1;
    }

    let tasks = [...this.state.tasks];
    tasks.splice(tasks.indexOf(task), 1, updTask);

    this.setState({
      tasks,
      selectAll: 2,
      selectedtasks,
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
    let selectedtasks = 0;
    tasks.map(task => {
      if(checked) {
        selectedtasks += 1;
      }
      task.checked = checked;
      return task;
    });
    this.setState({selectedtasks});
    return tasks;
  };

  componentDidMount() {
    const user = getLoggedUser();
    getUserTasks({ user_id: user.id }).then(tasks => {
      getProjects().then(projects => {
        this.setState({
          component: 0,
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
        {/* top buttons */}
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
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={this.handleRelinquish}
              disabled={this.state.selectedtasks !== 0? false : true}
            >
              Relinquish
            </button>
            {/* <button
              type="button"
              className="btn btn-primary ml-4"
              // onClick={this.setFormToLoad}
              // data-toggle="modal"
              // data-target="#baseModal"
            >
              Status
            </button> */}
            
            <button
              type="button"
              className="btn btn-primary ml-4"
              onClick={this.handleComplete}
              disabled={this.state.selectedtasks === 0 ? true : false}
            >
              Complete
            </button>
          {/* </UserActions> */}
        </div>
        {/* task table */}
        <div className="table-content">
          <div className="table-header">
            <span>Task Status</span>
            <hr />
            <UserTasksTable
              selectAll={selectAll}
              data={tasks}
              toggleRow={this.toggleRow}
              toggleSelectAll={this.toggleSelectAll}
              match={this.props.match}
            />
          </div>
        </div>
        {/* modals */}
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
