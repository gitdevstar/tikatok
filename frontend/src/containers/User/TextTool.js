import React, { Component } from "react";
import ToolText from "../../components/actions/ToolText";
import { getTask, convertToText, SaveDataTask, resetTextResult } from "../../API/TasksRequests";

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
    const url_value = taskData.texts[currentItem].toString();
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
      // go prev
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
    const url_value = taskData.texts[currentItem].toString();
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
      // go prev
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
    const url_value = taskData.texts[currentItem].toString();
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
  };

  handleFontSizeChange = mode => {
    let fontSize = this.state.fontSize;
    if (mode === "+") this.setState({ fontSize: (fontSize += 1) });
    else if (fontSize > 0) this.setState({ fontSize: (fontSize -= 1) });
  };

  handleFontSizeChange = mode => {
    let fontSize = this.state.fontSize;
    if (mode === "+") this.setState({ fontSize: (fontSize += 1) });
    else if (fontSize > 0) this.setState({ fontSize: (fontSize -= 1) });
  };

  handleTextAlignChange = value => {
    this.setState({ textAlign: value });
  };

  handleChangeTags = tags => {
    let uniqueTags = [...new Set(tags)];
    this.setState({ labels: uniqueTags.join(), tags: uniqueTags });
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

  toggleSwitchBold = () => {
    this.setState({ bold: !this.state.bold });
  };

  toggleSwitchWhiteSpace = () => {
    this.setState({ whiteSpace: !this.state.whiteSpace });
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
        <div className=" col-md-3 col-sm-3 col-xs-12">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h5>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h5>
            )}
            <hr />
          </div>
          <ToolText
            handleReset={this.handleReset}
            handleRefresh={this.handleRefresh}            
            handleSave={this.handleSave}
            handleChangeSelectedTags={this.handleChangeSelectedTags}
            handleChangeTags={this.handleChangeTags}
            handlePrev={this.handlePrev}            
            handleNext={this.handleNext}

            toggleSwitchBold={this.toggleSwitchBold}
            toggleSwitchWhiteSpace={this.toggleSwitchWhiteSpace}
            handleChange={this.handleChange}
            handleFontSizeChange={this.handleFontSizeChange}
            handleTextAlignChange={this.handleTextAlignChange}
            tags={tags}
            selectedTags={selectedTags}
            fontSize={fontSize}
            bold={bold}
            whiteSpace={whiteSpace}
            paddingRight={paddingRight}
            taskData={taskData}
          />
        </div>
        <div className="data img-marker-tool col-md-5 col-sm-5 col-xs-12">
          <div className="panel tool-content" style={{"margin-top":"3rem"}}>
            <div
              onMouseEnter={this.handlerIn}
              onMouseLeave={() => {
                this.handlerOut();
                this.setState({ showTagsModal: false });
              }}
              onClick={this.showTagsToolTip}
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
        </div> 
    );
  }
}
