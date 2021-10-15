import React, { Component, Fragment } from "react";
/* import Sound from "react-sound"; */
import { getTask, rejectTask } from "../../API/TasksRequests";

import "@svgdotjs/svg.draggable.js";

import $ from "jquery";
 import "../../style.css";

export default class ImgSemanticTool extends Component {
  state = {
    task: null,
    taskData: null,
    currentItem: 0,
    
    tags: [],
    labels: "",
    selectedTags: [],
    seletedLabels: "",
    showTagsModal: false,

    brightness: 10,
    contrast: 1,
    saturate: 1,

    polygon: null,
    currentPolygonPoints: [],
    coords:null,
    svg: null,
    ptx: 0,
    pty: 0,
    pt: null,
    imgInputFile: null,
    drawingMode: false,
    flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
    dot_flag: false,
    
    fillColor: "black"
    
  };

  constructor (props) {
    super(props);
  }

  handleNext = () => {
    //block drawing
    this.setState({drawingMode: false});

    const allPolygons = $("#theSVG").find("polygon");
  //  if(allPolygons.length > 0) {
      const {
        start_time,
        taskData,
        clickCounter,
        exactTime,
        image_info,
      } = this.state;
  
      // const finish_time = Math.floor(Date.now() / 1000);
      // const completion_time = finish_time - start_time;
      // const url_value = taskData.images[currentItem].toString();
      // let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;
      
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }

      // this.setState({
      //   start_time: null,
      //   clickCounter: 0,
      //   startTime: 0,
      //   exactTime: 0,
      //   image_info
      // });

    //  const { task } = this.state;
      let { currentItem } = this.state;
      if (currentItem + 1 < task.nitems) {
        currentItem += 1;
        this.setState({ currentItem });
        this.loadTask(task, currentItem);
      } 
  };

  handlePrev = () => {

    this.setState({drawingMode: false});

    const allPolygons = $("#theSVG").find("polygon");
  //  if(allPolygons.length > 0) {
      const {
        start_time,
        taskData,
        clickCounter,
        exactTime,
        image_info
      } = this.state;
  
     
      let task = null;
      
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }

   
    //  const { task } = this.state;
      let { currentItem } = this.state;
      if (currentItem + 1 > 1) {
        currentItem -= 1;
        this.setState({ currentItem });
        this.loadTask(task, currentItem);
      }
  };

  file_clicked_info = filename => {
    let file_clicked_info = {};
    file_clicked_info.filename = filename;
    file_clicked_info.shape_objects = [];
    file_clicked_info.marker_objects = [];
    return file_clicked_info;
  };

  createImageInfo = taskData => {
    let image_info = {};
    taskData.images.map(image => {
      const filename = image.toString().replace(/^.*[\\\/]/, "");
      image_info[`${filename}`] = new this.file_clicked_info(filename);
      return image;
    });
    this.setState({ image_info });
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
        // const selectedTags = selectedTagsAux.filter(item => item.includes(""));
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
        this.loadSemanticData(taskData.data)
      }
    });
  };

  loadSemanticData = (taskData) => {
    const { currentItem } = this.state;

    this.removeAllPolygons();
    this.removeAllCircles();
    this.removeText();

    if (taskData.annotation_dictionary != null || taskData.annotation_dictionary.length != 0) {
      const annotation =
        taskData.annotation_dictionary[
          `${taskData.images[currentItem].toString().replace(/^.*[\\\/]/, "")}`
        ];
        if(annotation) {
            const semantics = annotation["annotation"].data_annotation["semantic"];            
            semantics.map(semantic => {
              const points = semantic.points_real;
              const label = semantic.label;
              const fillcolor = semantic.fillcolor;

              this.setState({currentPolygonPoints: points});
              this.setState({fillColor: fillcolor});

              this.createPolygon();
              this.createText(label);

              return semantic;
            });
        }
      
    }

    this.setState({fillColor: "black"});
  }

  createPolygon = () => {
    var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let svg = document.getElementById('theSVG');
    let i = 0;
    for (let value of this.state.currentPolygonPoints) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
        if(i === 0) {
          this.setState({currX: point.x});
          this.setState({currY: point.y});
        }
        i ++;
    }

    polygon.setAttributeNS(null, 'class', 'polygon');
    polygon.setAttributeNS(null, 'name', '');
    polygon.setAttributeNS(null, 'fill', this.state.fillColor);
    polygon.setAttributeNS(null, 'opacity', 0.8);
    svg.appendChild(polygon);
    this.setState({svg});
    return polygon;
  };

  createText = (text) => {

    let allPolygons = $("#theSVG").find("polygon");
    allPolygons[allPolygons.length-1].setAttributeNS(null, 'name', text);

    var newText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    newText.setAttributeNS(null, "x", this.state.currX);
    newText.setAttributeNS(null, "y", this.state.currY - 10);
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

  removeAllPolygons = () => {
    const allPolygons = $("#theSVG").find("polygon");
    let len = allPolygons.length;
    for (var i = len - 1; i >= 0; i --) {
      allPolygons[i].remove();
    }
  }

  removeAllCircles = () => {
    const allCircles = $("#theSVG").find("circle");
    let len = allCircles.length;
    for (var i = len - 1; i >= 0; i --) {
      allCircles[i].remove();
    }
  }
  
  insertXY = (x, y) => {
    this.state.currentPolygonPoints.push([x, y]);
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
      showTagsModal,
      brightness,
      contrast,
      saturate,
      x,
      y,
      task
    } = this.state;
    let intercept = -(0.5 * contrast) + 0.5;
    return (
      <div className="row img-classify-tool  text-center">
        {/* left sidemenu */}
        <div className="col-md-3 col-sm-3 col-xs-12">
          {/* task title */}
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
        </div>
        {/* image panel */}
        <div className="col-md-7 col-sm-7 col-xs-12">
          <div className="data img-marker-tool col-md-12 col-sm-12 col-xs-12 mt-5">
          <div className="panel img-tool-content">
            <div              
              id="tool-text-content"
              className="container-flex-1"
            >
              {!taskData ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div>
                  <Fragment>
                  <svg id="theSVG" style={{ height: "100%", width: "100%" }}>
                  <image
                      filter="url(#pictureFilter)"
                      id="svgImg"
                     
                      xlinkHref={taskData.images[currentItem]}
                    />
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
                  </svg>
                </Fragment>
                </div>
              )}
              {showTagsModal && tags !== [] && (
                <div
                  className="tags-tool-tip box-shadow"
                  style={{ display: showTagsModal, left: x, top: y, position:"absolute" }}
                >
                  {
                    tags.map((tag, i) => {
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
                    })
                  }
                </div>
              )}
            </div>
          </div>
        </div>
        
        </div>
        <div className="col-md-1 col-sm-1 col-xs-12 mt-5">
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
