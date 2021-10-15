import React, { Component } from "react";
/* import Sound from "react-sound"; */
import ToolAudio from "../../components/actions/ToolAudio";
import { getTask, SaveDataTask, resetTextResult } from "../../API/TasksRequests";

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

  handleReset = () => {
    const { task, currentItem } = this.state;
    resetTextResult(task.id, currentItem)
    .then(res => {
      this.loadTask(task, currentItem);
    });
  };

  handleRefresh = () => {
    // window.location.reload();
    const { task, currentItem } = this.state;
    this.loadTask(task, currentItem);
  };

  handleNext = () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime
    } = this.state;
    const finish_time = Math.floor(Date.now() / 1000);
    const completion_time = finish_time - start_time;
    const url_value = taskData.audios[currentItem].toString();
    let task = null;
    if (this.props.location.state != null) {
      task = this.props.location.state.task;
    }
    const data = {
      pk: task.id,
      items_solved: currentItem + 1,
      data_task: JSON.stringify(taskData),
      nclicks: clickCounter,
      hover_time: completion_time,
      completion_time: exactTime,
      url_value
    };

    SaveDataTask(data).then(res => {
      this.setState({
        start_time: null,
        clickCounter: 0,
        startTime: 0,
        exactTime: 0
      });

      const { task } = this.state;
      let { currentItem } = this.state;
      if (currentItem + 1 < task.nitems) {
        currentItem = currentItem += 1;
        this.setState({ currentItem });
        this.loadTask(task, currentItem);
      }
    });
    
  };

  handlePrev = () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime
    } = this.state;
    const finish_time = Math.floor(Date.now() / 1000);
    const completion_time = finish_time - start_time;
    const url_value = taskData.audios[currentItem].toString();
    let task = null;
    if (this.props.location.state != null) {
      task = this.props.location.state.task;
    }
    const data = {
      pk: task.id,
      items_solved: currentItem + 1,
      data_task: JSON.stringify(taskData),
      nclicks: clickCounter,
      hover_time: completion_time,
      completion_time: exactTime,
      url_value
    };

    SaveDataTask(data).then(res => {
      this.setState({
        start_time: null,
        clickCounter: 0,
        startTime: 0,
        exactTime: 0
      });

      const { task } = this.state;
      let { currentItem } = this.state;
      if (currentItem + 1 > 1) {
        currentItem = currentItem -= 1;
        this.setState({ currentItem });
        this.loadTask(task, currentItem);
      }
    });
    
  };

  handlerIn = () => {
    this.setState({ startTime: new Date() });
  };

  handlerOut = () => {
    const { startTime, exactTime } = this.state;
    let endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff % 60);
    this.setState({ exactTime: exactTime + seconds });
  };

  handleSave = () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime
    } = this.state;
    const finish_time = Math.floor(Date.now() / 1000);
    const completion_time = finish_time - start_time;
    const url_value = taskData.audios[currentItem].toString();
    let task = null;
    if (this.props.location.state != null) {
      task = this.props.location.state.task;
    }
    const data = {
      pk: task.id,
      items_solved: currentItem + 1,
      data_task: JSON.stringify(taskData),
      nclicks: clickCounter,
      hover_time: completion_time,
      completion_time: exactTime,
      url_value
    };

    SaveDataTask(data).then(res => {
      this.setState({
        start_time: null,
        clickCounter: 0,
        startTime: 0,
        exactTime: 0
      });
    });
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    const audioPlayer = document.getElementById("audioPlayer");

    if (parseInt(value) === 0) {
      audioPlayer.playbackRate = 1.0;
    } else if (parseInt(value) === 1) {
      audioPlayer.playbackRate = 2.0;
    } else if (parseInt(value) === 2) {
      audioPlayer.playbackRate = 3.0;
    } else if (parseInt(value) === -1) {
      audioPlayer.playbackRate = 0.7;
    } else if (parseInt(value) === -2) {
      audioPlayer.playbackRate = 0.4;
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

  handleChangeTags = tags => {
    let uniqueTags = [...new Set(tags)];
    this.setState({ labels: uniqueTags.join(), uniqueTags });
  };

  handleChangeSelectedTags = selectedTags => {
    let { taskData, currentItem } = this.state;
    let uniqueSelectedTags = [...new Set(selectedTags)];
    taskData.selected_tags[currentItem] = uniqueSelectedTags.join();
    this.setState({
      taskData,
      seletedLabels: uniqueSelectedTags.join(),
      selectedTags: uniqueSelectedTags
    });
  };


  showTagsToolTip = e => {
    e.preventDefault();
    const { clientX: x, clientY: y } = e;
    this.setState({
      showTagsModal: true,
      x,
      y,
      clickCounter: this.state.clickCounter + 1
    });
  };

  handleTagSelected = (e, tag) => {
    e.stopPropagation();
    let { selectedTags, seletedLabels, currentItem, taskData } = this.state;
    // selectedTags = selectedTags.filter(selTag => {
    //   if(selTag != tag) {
    //     return selTag;
    //   }
    // });
    selectedTags.push(tag);
    selectedTags = [...new Set(selectedTags)];
    seletedLabels = selectedTags.join();
    taskData.selected_tags[currentItem] = selectedTags.join();
    this.setTags(tag);
    this.setState({
      showTagsModal: false,
      selectingTag: false,
      selectedTags,
      seletedLabels,
      taskData
    });
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
      tags,
      selectedTags,
      taskData,
      speed,
      showTagsModal,
      x,
      y,
      task,
      audioPlayer,
      loop
    } = this.state;

    return (
      <div className="row tool">
        <div className=" col-md-3 col-sm-3 col-xs-12">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h1>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h1>
            )}
            <hr />
          </div>
          <ToolAudio
            handleReset={this.handleReset}
            handleRefresh={this.handleRefresh}            
            handleSave={this.handleSave}
            handleChangeSelectedTags={this.handleChangeSelectedTags}
            handleChangeTags={this.handleChangeTags}
            handleChange={this.handleChange}
            tags={tags}
            speed={speed}
            selectedTags={selectedTags}
            taskData={taskData}
          />
        </div>
        <div className="data audio-tool col-md-5 col-sm-5 col-xs-12">
          <div className="panel tool-content" style={{ "margin-top":"3rem"}}>
            <div
              onMouseEnter={this.handlerIn}
              onMouseLeave={() => {
                this.handlerOut();
                this.setState({ showTagsModal: false });
              }}
              onClick={this.showTagsToolTip}
              id="tool-text-content"
              className="container-flex-1"
            >
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
