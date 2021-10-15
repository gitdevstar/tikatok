import React, { Component, Fragment } from "react";
import { getTask, SaveImgDataTask, resetImageResult } from "../../API/TasksRequests";
import ToolImgMarker from "../../components/actions/ToolImgMarker";
import $ from "jquery";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";

export default class ImgMarkerTool extends Component {
  state = {
    task: null,
    taskData: null,
    currentItem: 0,
    brightness: 10,
    contrast: 1,
    saturate: 1,
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
    addingMarker: false,
    selectedCircle: null,
    image_info: null,
    currentMarkers: [],
    currentLabels: [],

  };

  handleReset = () => {
    // const { task, currentItem } = this.state;
    // this.loadTask(task, currentItem);
    let {
      taskData,
      task,
      currentItem
    } = this.state;
    let currentImage = taskData && taskData.images[currentItem];
    let taskid = task.id;
    resetImageResult(taskid, currentImage)
    .then(res => {
      this.loadTask(task, currentItem);
    })
  };

  handleRefresh = () => {
    const { task, currentItem } = this.state;
    this.loadTask(task, currentItem);
  };

  handleNext = () => {
    const allCircles = $("#theSVG svg").find("circle");
    if(allCircles.length > 0) {
      const {
        start_time,
        taskData,
        currentItem,
        clickCounter,
        exactTime,
        image_info
      } = this.state;
  
      const finish_time = Math.floor(Date.now() / 1000);
      const completion_time = finish_time - start_time;
      const url_value = taskData.images[currentItem].toString();
      let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;
      
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }
  
      const allCircles = $("#theSVG svg").find("circle");
      let Marker = {};
      // data init 
      image_info[`${item_name}`].marker_objects = [];
  
      for (var i = 0; i < allCircles.length; i++) {
        const label = allCircles[i].attributes.name.value;
        const XPos = parseInt(allCircles[i].attributes.cx.value);
        const YPos = parseInt(allCircles[i].attributes.cy.value);
  
        Marker = { XPos, YPos, label };
        image_info[`${item_name}`].marker_objects.push(Marker);
      }
  
      const data = {
        pk: task.id,
        items_solved: currentItem + 1,
        item_name,
        data_task: JSON.stringify(image_info),
        nclicks: clickCounter,
        hover_time: completion_time,
        completion_time: exactTime,
        url_value
      };
  
      SaveImgDataTask(data).then(res => {
        this.setState({
          start_time: null,
          clickCounter: 0,
          startTime: 0,
          exactTime: 0,
          image_info
        });
        const { task } = this.state;
        let { currentItem } = this.state;
        if (currentItem + 1 < task.nitems) {
          currentItem = currentItem += 1;
          this.setState({ currentItem });
          this.loadTask(task, currentItem);
        }
      });
    } else {
      const { task } = this.state;
        let { currentItem } = this.state;
        if (currentItem + 1 < task.nitems) {
          currentItem = currentItem += 1;
          this.setState({ currentItem });
          this.loadTask(task, currentItem);
        }
    }
    
  };

  handlePrev = () => {
    const allCircles = $("#theSVG svg").find("circle");
    if(allCircles.length > 0) {
      const {
        start_time,
        taskData,
        currentItem,
        clickCounter,
        exactTime,
        image_info
      } = this.state;
  
      const finish_time = Math.floor(Date.now() / 1000);
      const completion_time = finish_time - start_time;
      const url_value = taskData.images[currentItem].toString();
      let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;
      
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }
  
      const allCircles = $("#theSVG svg").find("circle");
      let Marker = {};
      // data init 
      image_info[`${item_name}`].marker_objects = [];
  
      for (var i = 0; i < allCircles.length; i++) {
        const label = allCircles[i].attributes.name.value;
        const XPos = parseInt(allCircles[i].attributes.cx.value);
        const YPos = parseInt(allCircles[i].attributes.cy.value);
  
        Marker = { XPos, YPos, label };
        image_info[`${item_name}`].marker_objects.push(Marker);
      }
  
      const data = {
        pk: task.id,
        items_solved: currentItem + 1,
        item_name,
        data_task: JSON.stringify(image_info),
        nclicks: clickCounter,
        hover_time: completion_time,
        completion_time: exactTime,
        url_value
      };
  
      SaveImgDataTask(data).then(res => {
        this.setState({
          start_time: null,
          clickCounter: 0,
          startTime: 0,
          exactTime: 0,
          image_info
        });
        const { task } = this.state;
        let { currentItem } = this.state;
        if (currentItem + 1 > 1) {
          currentItem = currentItem -= 1;
          this.setState({ currentItem });
          this.loadTask(task, currentItem);
        }
      });
    } else {
      const { task } = this.state;
        let { currentItem } = this.state;
        if (currentItem + 1 > 1) {
          currentItem = currentItem -= 1;
          this.setState({ currentItem });
          this.loadTask(task, currentItem);
        }
    }
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
      exactTime,
      image_info
    } = this.state;

    const finish_time = Math.floor(Date.now() / 1000);
    const completion_time = finish_time - start_time;
    const url_value = taskData.images[currentItem].toString();
    let item_name = url_value.replace(/^.*[\\\/]/, "");
    let task = null;
    
    if (this.props.location.state != null) {
      task = this.props.location.state.task;
    }

    const allCircles = $("#theSVG svg").find("circle");
    let Marker = {};
    // data init 
    image_info[`${item_name}`].marker_objects = [];

    for (var i = 0; i < allCircles.length; i++) {
      const label = allCircles[i].attributes.name.value;
      const XPos = parseInt(allCircles[i].attributes.cx.value);
      const YPos = parseInt(allCircles[i].attributes.cy.value);

      Marker = { XPos, YPos, label };
      image_info[`${item_name}`].marker_objects.push(Marker);
    }

    const data = {
      pk: task.id,
      items_solved: currentItem + 1,
      item_name,
      data_task: JSON.stringify(image_info),
      nclicks: clickCounter,
      hover_time: completion_time,
      completion_time: exactTime,
      url_value
    };

    SaveImgDataTask(data).then(res => {
      this.setState({
        start_time: null,
        clickCounter: 0,
        startTime: 0,
        exactTime: 0,
        image_info
      });
    });
  };

  handleMarkerOff = () => {
    this.setState({
      addingMarker: false
    });
  };

  handleMarkerOn = () => {
    this.setState({
      addingMarker: true
    });
  };

  handleRemoveMarker = () => {
    this.handleMarkerOff();
    this.removeText();
    this.removeCircle();
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleChangeTags = tags => {
    this.setState({ labels: tags.join(), tags });
  };

  handleChangeSelectedTags = selectedTags => {
    let { taskData, currentItem } = this.state;
    taskData.selected_tags[currentItem] = selectedTags.join();
    this.setState({
      taskData,
      seletedLabels: selectedTags.join(),
      selectedTags
    });
  };

  showTagsToolTip = e => {
    e.preventDefault();
    e.stopPropagation();
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
    let {
      selectedTags,
      seletedLabels,
      currentItem,
      taskData,
      selectedCircle
    } = this.state;
    selectedTags.push(tag);
    selectedTags = [...new Set(selectedTags)];
    seletedLabels = selectedTags.join();
    taskData.selected_tags[currentItem] = selectedTags.join();
    this.setTags(tag);
    if (selectedCircle) {
      selectedCircle.attr("name", tag);
      const x = selectedCircle.attr("cx");
      const y = selectedCircle.attr("cy");
      this.createText(e, x, y, tag);
    }
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

  createCircle = e => {
    e.preventDefault();
    const { clientX: x, clientY: y } = e,
      { addingMarker, showTagsModal } = this.state;
    if (addingMarker && !showTagsModal) {
      var position = $("#theSVG").position();
      var draw = SVG().addTo("#theSVG");
      var circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      let currX = x - position.left,
        currY = y - position.top;
      circle = draw
        .circle(circle)
        .cx(currX)
        .cy(currY)
        .radius(4)
        .attr({ "stroke-width": 1 })
        .addClass("circle");
      const funcCreateText = this.createText;
      const funcSelectCircle = this.selectCircle;
      const funcRemoveText = this.removeText;

      circle
        .draggable()
        .on("beforedrag .namespace", function(event) {
          funcSelectCircle(circle);
        })
        .on("dragstart.namespace", function(event) {
          funcRemoveText();
        })
        .on("dragend.namespace", function(event) {
          const { box } = event.detail;
          let { x, y } = box;
          const text = circle.attr("name");
          funcCreateText(event, x, y, text);
        });
      this.setState({ selectedCircle: circle });
      this.showTagsToolTip(e);
    }
  };

  loadCircle = (x, y, label) => {
    var draw = SVG().addTo("#theSVG");
    var circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle = draw
      .circle(circle)
      .cx(x)
      .cy(y)
      .radius(4)
      .attr({ "stroke-width": 1, name: label })
      .addClass("circle");
    const funcCreateText = this.createText;
    const funcSelectCircle = this.selectCircle;
    const funcRemoveText = this.removeText;

    circle
      .draggable()
      .on("beforedrag .namespace", function(event) {
        funcSelectCircle(circle);
      })
      .on("dragstart.namespace", function(event) {
        funcRemoveText();
      })
      .on("dragend.namespace", function(event) {
        const { box } = event.detail;
        let { x, y } = box;
        const text = circle.attr("name");
        console.log(text);
        funcCreateText(event, x, y, text);
      });
  };

  selectCircle = circle => {
    this.setState({ selectedCircle: circle });
  };

  removeCircle = () => {
    const { selectedCircle } = this.state;
    if (selectedCircle){
      selectedCircle.remove();
    }
    else {
      console.log("circle is not selected");
    }
    this.setState({ selectedCircle: null });
  };

  createText = (e, x, y, text) => {
    e.preventDefault();
    var newText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    newText.setAttributeNS(null, "x", x);
    newText.setAttributeNS(null, "y", y - 10);
    newText.setAttributeNS(null, "font-size", "16");
    newText.setAttributeNS(null, "fill", "#000");
    newText.setAttributeNS(null, "stroke", "#000");
    var textNode = document.createTextNode(text);
    newText.appendChild(textNode);
    document.getElementById("theSVG").appendChild(newText);
  };

  removeText = () => {
    $("#theSVG")
      .find("text")
      .remove();
  };

  file_clicked_info = filename => {
    let file_clicked_info = {};
    file_clicked_info.filename = filename;
    file_clicked_info.shape_objects = [];
    file_clicked_info.marker_objects = [];
    return file_clicked_info;
  };

  createImageInfo = taskData => {
    //const { taskData } = this.state;
    let image_info = {};
    taskData.images.map(image => {
      const filename = image.toString().replace(/^.*[\\\/]/, "");
      image_info[`${filename}`] = new this.file_clicked_info(filename);
      return image;
    });
    this.setState({ image_info });
  };

  loadTask = (task, currentItem) => {
    getTask({ task_pk: task.id }).then(taskData => {
      if (taskData.status === 200) {
        const tags = Object.keys(taskData.data.menus_disabled[currentItem]);
        const selectedTagsAux = taskData.data.selected_tags[currentItem].split(
          ","
        );
        const selectedTags = selectedTagsAux.filter(item => !item.includes(""));
        this.setState({
          taskData: taskData.data,
          task,
          tags,
          labels: tags.join(),
          selectedTags,
          selectedLabels: selectedTags.join(),
          start_time: Math.floor(Date.now() / 1000)
        });
        this.createImageInfo(taskData.data);
        this.loadMarkers(taskData.data);
      }
    });
  };

  loadMarkers = taskData => {
    const { currentItem } = this.state;

    const allCircles = $("#theSVG svg").find("circle");
    let len = allCircles.length;
    for (var i = len - 1; i >= 0; i --) {
      allCircles[i].remove();
    }
    this.removeText();
    
    console.log("currentItem", currentItem);
    if (taskData.annotation_dictionary != null || taskData.annotation_dictionary.length != 0) {
      const annotation =
        taskData.annotation_dictionary[
          `${taskData.images[currentItem].toString().replace(/^.*[\\\/]/, "")}`
        ];
        if(annotation) {
            const markers = annotation["annotation"].data_annotation["marker"];
            let currentMarkers = [],
                currentLabels = [];
            markers.map(marker => {
              const points = marker.point_2D.split(",");
              currentMarkers.push({
                x: points[0], y: points[1]});
              currentMarkers.push(marker.classification_label);
              this.loadCircle(points[0], points[1], marker.classification_label);
              return marker;
            });
        }
      
    }
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
      brightness,
      contrast,
      saturate,
      showTagsModal,
      x,
      y,
      task
    } = this.state;
    let intercept = -(0.5 * contrast) + 0.5;

    return (
      <div className="row img-classify-tool">
        <div className="col-md-3 col-sm-3 col-xs-12">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h1>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h1>
            )}
            <hr />
          </div>
          <ToolImgMarker
            handleReset={this.handleReset}
            handleRefresh={this.handleRefresh}            
            handleSave={this.handleSave}
            handleMarkerOff={this.handleMarkerOff}
            handleRemoveMarker={this.handleRemoveMarker}
            handleMarkerOn={this.handleMarkerOn}
            handleChangeSelectedTags={this.handleChangeSelectedTags}
            handleChangeTags={this.handleChangeTags}            
            handleChange={this.handleChange}
            handlePrev={this.handlePrev}            
            handleNext={this.handleNext}

            tags={tags}
            brightness={brightness}
            contrast={contrast}
            saturate={saturate}
            selectedTags={selectedTags}
            taskData={taskData}
          />
        </div>
        <div className="data img-marker-tool col-md-7 col-sm-7 col-xs-12">
          <div className="panel img-tool-content" style={{ "marginLeft":"40px"}}>
            <div id="tool-text-content" className="container-flex-1">
              {!taskData ? (
                <p className="text-center">Loading...</p>
              ) : (
                <Fragment>
                  <svg id="theSVG" style={{ height: "100%", width: "100%" }}>
                    <defs>
                      <filter id="pictureFilter">
                        <feComponentTransfer>
                          <feFuncR
                            type="linear"
                            slope={`${brightness / 10}`}
                            intercept={intercept}
                          />
                          <feFuncG
                            type="linear"
                            slope={`${brightness / 10}`}
                            intercept={intercept}
                          />
                          <feFuncB
                            type="linear"
                            slope={`${brightness / 10}`}
                            intercept={intercept}
                          />
                        </feComponentTransfer>
                        <feColorMatrix type="saturate" values={saturate} />
                      </filter>
                    </defs>
                    <image
                      filter="url(#pictureFilter)"
                      id="svgImg"
                      onMouseEnter={this.handlerIn}
                      onMouseOver={this.handlerOut}
                      onClick={this.createCircle}
                      xlinkHref={taskData.images[currentItem]}
                    />
                  </svg>
                </Fragment>
              )}
            </div>
          </div>
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
    );
  }
}
