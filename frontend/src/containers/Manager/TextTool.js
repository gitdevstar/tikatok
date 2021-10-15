import React, { Component } from "react";
import TagsInput from "react-tagsinput";
import { getTask, convertToText, rejectTask } from "../../API/TasksRequests";

export default class Tool extends Component {
  state = {
    task: null,
    taskData: null,
    textData: "",
    currentItem: 0,
    fontSize: 13,
    bold: false,
    whiteSpace: false,
    textAlign: "",
    paddingRight: 0,
    tags: [],
    labels: "",
    selectedTags: [],
    seletedLabels: "",
    showTagsModal: false,
    start_time: null,
    x: 0,
    y: 0,
    clickCounter: 0,
    startTime: 0,
    exactTime: 0
  };

  handleNext = () => {
    const { task } = this.state;
    let { currentItem } = this.state;
    if (currentItem + 1 < task.nitems) {
      currentItem = currentItem += 1;
      this.setState({ currentItem });
      this.loadTask(task, currentItem);
    }
  };

  handlePrev = () => {
    const { task } = this.state;
    let { currentItem } = this.state;
    if (currentItem + 1 > 1) {
      currentItem = currentItem -= 1;
      this.setState({ currentItem });
      this.loadTask(task, currentItem);
    }
  };

  getTaskText = () => {
    const { taskData, currentItem } = this.state;
    if (taskData != null) {
      convertToText({
        current_url: taskData.texts[currentItem].toString()
      }).then(res => this.setState({ textData: res.text_data }));
    }
  };

  getTags = taskData => {
    let tags = Object.keys(taskData.menus_disabled[this.state.currentItem]);
    return tags;
  };

  setTags = key => {
    let taskData = this.state.taskData;
    let menus_disabled = taskData.menus_disabled;
    menus_disabled[this.state.currentItem][key] = !menus_disabled[
      this.state.currentItem
    ][key];
    taskData.menus_disabled = menus_disabled;
    this.setState({ taskData });
  };

  loadTask = (task, currentItem) => {
    getTask({ task_pk: task.id }).then(taskData => {
      if (taskData.status === 200) {
        convertToText({
          current_url: taskData.data.texts[currentItem]
        }).then(res => {
          let tags = this.getTags(taskData.data);
          const selectedTagsAux = taskData.data.selected_tags[currentItem].split(
            ","
          );
          
          let selectedTags = [];
          if ( ! (selectedTagsAux.length == 1 && selectedTagsAux[0] == "") )
          {
            selectedTags = selectedTagsAux;
          }
          this.setState({
            textData: res.text_data,
            taskData: taskData.data,
            task,
            tags,
            selectedTags,
            start_time: Math.floor(Date.now() / 1000)
          });
        });
      }
    });
  };

   reject = ()=> {
    rejectTask(this.state.task.id).then(
      res=>{
        if(res.status === 200)
          //this.setState({reject:true});
          this.props.history.push('/manager/task-status');
      }
    );
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.state == null) {
      this.props.history.push("/user/tasks");
    } else {
      let task = this.props.location.state.task;
      this.loadTask(task, this.state.currentItem);
    }
  }
  render() {
    const {
      textData,
      currentItem,
      fontSize,
      bold,
      whiteSpace,
      textAlign,
      paddingRight,
      tags,
      selectedTags,
      taskData,
      showTagsModal,
      x,
      y,
      task
    } = this.state;

    return (
      <div className="row tool">
        <div className=" col-md-3 col-sm-3 col-xs-12 text-center">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h5>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h5>
            )}
            <hr />
          </div>
          <button className="btn btn-danger" onClick={this.reject}  disabled={this.state.reject}>Reject Task</button>
          <div className="mt-5 switch-bold text-center">
            <label className="col-md-12 col-sm-12 col-xs-12 text-bold mt-5">
              Selected Labels
            </label>
            <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
              <TagsInput
                value={this.state.selectedTags}
              //  onChange={handleChangeSelectedTags}
              />
            </div>
          </div>
        </div>
        <div className="data img-marker-tool col-md-5 col-sm-5 col-xs-12">
          <div className="panel tool-content" style={{"marginTop":"3rem"}}>
            <div
              id="tool-text-content"
              className="tool-text-content"
              style={{
                fontSize,
                fontWeight: bold ? "bold" : "normal",
                whiteSpace: whiteSpace ? "nowrap" : "normal",
                textAlign,
                paddingRight: paddingRight * 4
              }}
            >
              {textData === "" ? (
                <p className="text-center">Loading...</p>
              ) : (
                <p>{textData}</p>
              )}
              {showTagsModal && tags !== [] && (
                <div
                  className="tags-tool-tip box-shadow"
                  style={{ display: showTagsModal, left: x, top: y }}
                >
                  {tags.map((tag, i) => {
                    const tadId = `tag-${i}`;
                    return (
                      <div
                        id={tadId}
                        key={i}
                        className="tag-item"
                        onClick={e => this.handleTagSelected(e, tag)}
                      >
                        {tag}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-1 col-sm-1 col-xs-6 mt-5">
            <div className=" container-flex-1">
              <div
                className=""
                onClick={this.handlePrev}          
              >
                <i className="fa fa-arrow-left" style={{ fontSize: 40 }} />
              </div>
              <div
                className=""
                onClick={this.handleNext}          
              >
                <i className="fa fa-arrow-right" style={{ fontSize: 40 }} />
              </div>
            </div>
        </div>
      </div> 
    );
  }
}
