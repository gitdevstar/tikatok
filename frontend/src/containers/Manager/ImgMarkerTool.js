import React, { Component, Fragment } from "react";
import { getTask, rejectTask } from "../../API/TasksRequests";
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
    image_info: null
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
        funcCreateText(event, x, y, text);
      });
  };

  selectCircle = circle => {
    this.setState({ selectedCircle: circle });
  };

  removeCircle = () => {
    const { selectedCircle } = this.state;
    selectedCircle.remove();
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

    if (taskData.annotation_dictionary != null || taskData.annotation_dictionary.length != 0) {
      const annotation =
        taskData.annotation_dictionary[
          `${taskData.images[currentItem].toString().replace(/^.*[\\\/]/, "")}`
        ];
        if(annotation) {
          const markers = annotation["annotation"].data_annotation["marker"];
          markers.map(marker => {
            const points = marker.point_2D.split(",");
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

  reject = ()=> {
    rejectTask(this.state.task.id).then(
      res=>{
        if(res.status === 200)
          //this.setState({reject:true});
          this.props.history.push('/manager/task-status');
      }
    );
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
      <div className="row img-classify-tool text-center">
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
          <button className="btn btn-danger" onClick={this.reject}  disabled={this.state.reject}>Reject Task</button>
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
                      // onClick={this.createCircle}
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
        <div className="col-md-1 col-sm-1 col-xs-12">
           {/* left, right buttons */}
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
