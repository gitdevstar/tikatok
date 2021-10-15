import React, { Component } from "react";
import TagsInput from "react-tagsinput";
/* import Sound from "react-sound"; */
import { getTask, rejectTask } from "../../API/TasksRequests";

export default class Tool extends Component {
  state = {
    task: null,
    taskData: null,
    currentItem: 0,
    speed: 0,
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
    exactTime: 0,
    audioPlayer: React.createRef(),
    loop: false
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

  handleBackward = () => {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.currentTime -= 1;
  };

  handleForward = () => {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.currentTime += 1;
  };

  handleLoop = () => {
    const { loop } = this.state;
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.loop = !loop;
    audioPlayer.play();
    this.setState({ loop: !loop });
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
        const tags = Object.keys(taskData.data.menus_disabled[currentItem]);
        const selectedTagsAux = taskData.data.selected_tags[currentItem].split(
          ","
        );
        
        let selectedTags = [];
        if ( ! (selectedTagsAux.length == 1 && selectedTagsAux[0] == "") )
        {
          selectedTags = selectedTagsAux;
        }
        this.setState({
          taskData: taskData.data,
          task,
          tags,
          labels: tags.join(),
          selectedTags,
          selectedLabels: selectedTags.join(),
          start_time: Math.floor(Date.now() / 1000)
        });
      }
    });
  };

  reject = ()=> {
    rejectTask(this.state.task.id).then(
      res=>{
        if(res.status === 200)
         // this.setState({reject:true});
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
      currentItem,
      taskData,
      task,
      audioPlayer,
      loop
    } = this.state;

    return (
      <div className="row tool">
        <div className=" col-md-3 col-sm-3 col-xs-12 text-center">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h1>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h1>
            )}
            <hr />
          </div>
          <button className="btn btn-danger" onClick={this.reject} disabled={this.state.reject}>Reject Task</button>
          <div className="mt-5 switch-bold text-center">
            <label className="col-md-12 col-sm-12 col-xs-12 text-bold mt-5">
              Selected Labels
            </label>
            <div className=" col-md-12 col-sm-12 col-xs-12">
              <TagsInput
                value={this.state.selectedTags}
              //  onChange={handleChangeSelectedTags}
              />
            </div>
          </div>
        </div>  
        <div className="data audio-tool col-md-5 col-sm-5 col-xs-12">
          <div className="panel tool-content text-center" style={{ "marginTop":"3rem"}}>            
              {!taskData ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div>
                  <audio
                    className="audio-player"
                    ref={audioPlayer}
                    src={taskData.audios[currentItem]}
                    autoPlay
                    controls
                    id="audioPlayer"
                    controlsList="nodownload"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
          </div>
         
          <div className="actions-align mt-2 container-flex-1">
            <button
              onClick={this.handleBackward}
              className="btn btn-primary"
              style={{ height: 35, width: 35 }}
              title="Backward"
            >
              <i className="fa fa-backward" />
            </button>
            <button
              onClick={this.handleLoop}
              className={loop ? "btn btn-primary btn-loop" : "btn btn-primary"}
              style={{ height: 35, width: 35 }}
              title="Loop"
            >
              <i className="fa fa-undo" />
            </button>
            <button
              onClick={this.handleForward}
              className="btn btn-primary"
              style={{ height: 35, width: 35 }}
              title="Forward"
            >
              <i className="fa fa-forward" />
            </button>
          </div>
          </div>
        <div className="col-md-1 col-sm-1 col-xs-12 mt-5">
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
