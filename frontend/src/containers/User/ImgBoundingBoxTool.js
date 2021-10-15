import React, { Component, Fragment } from "react";
import { getTask, SaveImgDataTask, resetImageResult } from "../../API/TasksRequests";
import ToolImgBoundingBox from "../../components/actions/ToolImgBoundingBox";
import $ from "jquery";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import svg from "svg.js";
import "svg.draw.js";

window.$ = $;

const getOffset = e => ({
  offsetX: e.nativeEvent.offsetX, 
  offsetY: e.nativeEvent.offsetY
});

const normalizeRect = r => {
  let x = parseInt(r.x, 10), 
      y = parseInt(r.y, 10), 
      width = parseInt(r.width, 10), 
      height = parseInt(r.height, 10);
  
  if (width < 0) {
    x += width;
  }
  
  if (height < 0) {
    y += height;
  }
  
  width = Math.abs(width);
  height = Math.abs(height);
  
  return {...r, x, y, width, height};
};

export default class ImgBoundingBoxTool extends Component {

  state = {
    mode: '',
    operation: null,
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
    drawing: false,
    selectedCircle: null,
    selectedRect: null,
    selectedShape: null,
    image_info: null,

    // Current image-specific:
    boundingBoxes: [],
    boundingPolygons: [],
    //init data for refresh
    initboundingBoxes: [],
    initboundingPolygons: [],

    polygons:[],
    activeRect: null,
    activePolygon: null,
    dragStartPoint: null,
    overridePoint: null,

    polygonTooltipPosX: null,
    polygonTooltipPosY: null,
  };

  constructor (props) {
    super(props);
    this.setMode = this.setMode.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.loadBoundingBoxes = this.loadBoundingBoxes.bind(this);
  }

  handleRefresh = () => {
    const { task, currentItem } = this.state;
    this.loadTask(task, currentItem);
  };

  handleReset = () => {
    let {
      taskData,
      task,
      currentItem
    } = this.state;
    let currentImage = taskData && taskData.images[currentItem];
    let taskid = task.id;
    // console.log(taskData, task);
    resetImageResult(taskid, currentImage)
    .then(res => {
      this.loadTask(task, currentItem);
    })
  }

  // handleRefresh = () => {
  //   // window.location.reload();
  //   const {initboundingBoxes, initboundingPolygons} = this.state;
  //   this.setState({boundingPolygons: initboundingPolygons, boundingBoxes: initboundingBoxes});
  //   console.log(initboundingPolygons);
  // };

  handleNext = () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime,
      image_info,
      boundingBoxes,
      boundingPolygons
    } = this.state;
    
    if(boundingBoxes.length != 0 || boundingPolygons.length != 0) {
      const finish_time = Math.floor(Date.now() / 1000);
      const completion_time = finish_time - start_time;
      const url_value = taskData.images[currentItem].toString();
      
      let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;

      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }
      //save rect
      const rectangle_objects = this.state.boundingBoxes.map(rect => ({
        shape_properties: {
          ...rect,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].rectangle_objects = rectangle_objects;
      //save polygon
      const polygon_objects = this.state.boundingPolygons.map(polygon => ({
        shape_properties: {
          ...polygon,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].polygon_objects = polygon_objects;

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

          this.setState({ currentItem, polygons: [] });
          this.loadTask(task, currentItem);
        }
      });
    } else {
      const { task } = this.state;
      let { currentItem } = this.state;

      if (currentItem + 1 < task.nitems) {
        currentItem = currentItem += 1;

        this.setState({ currentItem, polygons: [] });
        this.loadTask(task, currentItem);
      }
    }
    
    
  };

  handlePrev = () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime,
      image_info,
      boundingBoxes,
      boundingPolygons
    } = this.state;
    
    if(boundingBoxes.length != 0 || boundingPolygons.length != 0) {
      const finish_time = Math.floor(Date.now() / 1000);
      const completion_time = finish_time - start_time;
      const url_value = taskData.images[currentItem].toString();
      
      let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;
  
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }
      //save rect
      const rectangle_objects = this.state.boundingBoxes.map(rect => ({
        shape_properties: {
          ...rect,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].rectangle_objects = rectangle_objects;
      //save polygon
      const polygon_objects = this.state.boundingPolygons.map(polygon => ({
        shape_properties: {
          ...polygon,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].polygon_objects = polygon_objects;
  
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
  
          this.setState({ currentItem, polygons: [] });
          this.loadTask( task, currentItem );
        }
      });
    } else {
      const { task } = this.state;
      let { currentItem } = this.state;

      if (currentItem + 1 > 1) {
        currentItem = currentItem -= 1;

        this.setState({ currentItem, polygons: [] });
        this.loadTask( task, currentItem );
      }
    }
  };

  handleSave = async () => {
    const {
      start_time,
      taskData,
      currentItem,
      clickCounter,
      exactTime,
      image_info,
      boundingBoxes,
      boundingPolygons,
    } = this.state;
    
    if(boundingBoxes.length != 0 || boundingPolygons.length != 0) {
      const finish_time = Math.floor(Date.now() / 1000);
      const completion_time = finish_time - start_time;
      const url_value = taskData.images[currentItem].toString();
      
      let item_name = url_value.replace(/^.*[\\\/]/, "");
      let task = null;
  
      if (this.props.location.state != null) {
        task = this.props.location.state.task;
      }
      //save rect
      const rectangle_objects = this.state.boundingBoxes.map(rect => ({
        shape_properties: {
          ...rect,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].rectangle_objects = rectangle_objects;
      //save polygon
      const polygon_objects = this.state.boundingPolygons.map(polygon => ({
        shape_properties: {
          ...polygon,
          label: '', // TODO
        }
      }));
      image_info[`${item_name}`].polygon_objects = polygon_objects;
  
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
    }
  };

  handleDrawingOff = () => {
    this.setState({
      drawing: false
    });
  };

  handleDrawingOn = () => {
    this.setState({
      drawing: true
    });
  };

  handleRemoveMarker = () => {
    this.handleDrawingOff();
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
    let uniqueTags = [...new Set(tags)];
    this.setState({ labels: uniqueTags.join(), uniqueTags });
  };

  handleChangeSelectedTags = selectedTags => {
    let { taskData, currentItem, image_info } = this.state;
    const url_value = taskData.images[currentItem].toString();      
    let item_name = url_value.replace(/^.*[\\\/]/, "");

    let uniqueSelectedTags = [...new Set(selectedTags)];
    image_info[`${item_name}`].selected_tags[currentItem] = uniqueSelectedTags.join();
    this.setState({
      taskData,
      seletedLabels: uniqueSelectedTags.join(),
      selectedTags: uniqueSelectedTags
    });
  };

  showTagsToolTip = (offsetX, offsetY) => {
    this.setState({
      showTagsModal: true,
      x: offsetX,
      y: offsetY,
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
      selectedShape,
      boundingBoxes,
      boundingPolygons,
      activePolygon,
      activeRect
    } = this.state;
    
    selectedTags.push(tag);
    selectedTags = [...new Set(selectedTags)];
    seletedLabels = selectedTags.join();
    taskData.selected_tags[currentItem] = selectedTags.join();
    this.setTags(tag);
    
    if (selectedShape != null) {
      // selectedShape.attr("name", tag);
      // const x = selectedShape.attr("cx");
      // const y = selectedShape.attr("cy");
      // this.createText(e, x, y, tag);
      if(selectedShape.type === 'rect') {
        boundingBoxes[activeRect].classification_label = tag;
      }
      else if(selectedShape.type === 'polygon') {
        boundingPolygons[activePolygon].classification_label = tag;
      }
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
    menus_disabled[this.state.currentItem][key] = !menus_disabled[this.state.currentItem][key];
    taskData.menus_disabled = menus_disabled;
    this.setState({ taskData });
  };

  setMode = mode => {
    if(mode === '')
      this.setState({mode});
    if(this.state.mode === '')
      this.setState({mode});
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

  loadTask = async (task, currentItem) => {
    const taskData = await getTask({ task_pk: task.id });
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
      //this.loadMarkers(taskData.data);
      this.loadBoundingBoxes(taskData.data);
    }
  };

  loadMarkers = taskData => {
    const { currentItem } = this.state;
    if (taskData.annotation_dictionary != null) {
      const annotation =
        taskData.annotation_dictionary[
          `${taskData.images[currentItem].toString().replace(/^.*[\\\/]/, "")}`
        ];
      if (annotation) {
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
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const differs = x => this.props[x] !== prevProps[x];
    if (prevProps !== this.props) { // main condition
      if (differs('currentImage')) {
        console.log('currentImage differs');
      }
    }
  }

  loadBoundingBoxes () {
    this.setState(state => {
    let bounding_boxes = [];
    let bounding_polygons = [];
    const currentAnnotation = state.taskData.annotation_dictionary[
      `${state.taskData.images[state.currentItem].toString().replace(/^.*[\\\/]/, "")}`
    ];
    if (currentAnnotation) {
      bounding_boxes = currentAnnotation["annotation"].data_annotation["bounding_box"];
      if(bounding_boxes) {
        if (!Array.isArray(bounding_boxes)) {
          bounding_boxes = [bounding_boxes];
        }
        bounding_boxes = bounding_boxes.map((bounding_box, i) => {
          const points = bounding_box.point_2D.map(x=>x.split(','));
          const result = {
            x: parseInt(points[0][0], 10),
            y: parseInt(points[0][1], 10),
            width: parseInt(points[1][0] - points[0][0], 10),
            height: parseInt(points[1][1] - points[0][1], 10),
            classification_label: bounding_box.classification_label
          };
          return result;
        });
      } else {
        bounding_boxes = []
      }
      

      bounding_polygons = currentAnnotation["annotation"].data_annotation["bounding_polygon"];
      let polygons = []
      let polygon = []
      if(!Array.isArray(bounding_polygons)) {
        bounding_polygons = [bounding_polygons];
      }

      bounding_polygons = bounding_polygons.map(bounding_polygon => {
        let points = [];
        
        for (let k in  bounding_polygon['points']) {
           polygon = [];
          for( let i in bounding_polygon['points'][k]) {            
              polygon.push(bounding_polygon['points'][k][i]);
          }          
          points.push({x:polygon[0], y: polygon[1]});
        }
        polygons = {
          classification_label: bounding_polygon.classification_label,
          points:points
        };
        return polygons;
      })
    }

    return {boundingBoxes: bounding_boxes, boundingPolygons: bounding_polygons, initboundingBoxes: bounding_boxes, initboundingPolygons: bounding_polygons, activeRect: null, activePolygon: null};
    });
  }

  mouseUpHandler () {

  }

  drawRect = (data, i) => {
    const { dragStartPoint, overridePoint } = this.state;
    const { x, y, width, height, classification_label } = {...data //, classification_label: "Hello world"
    };
    const isActive = (this.state.activeRect === i);
    let effectiveX = parseInt(x, 10), effectiveY = parseInt(y, 10), effectiveWidth = parseInt(width, 10), effectiveHeight = parseInt(height, 10);
    if (isActive && dragStartPoint && overridePoint) {
      // ...
      effectiveX += (overridePoint.x || 0);
      effectiveY += (overridePoint.y || 0);
      effectiveWidth += (overridePoint.width || 0);
      effectiveHeight += (overridePoint.height || 0);
    }
    const c = isActive ? '#333' : '#333'; // chosen this for now
    // normalize
    const normalized = normalizeRect({x: effectiveX, y: effectiveY, width: effectiveWidth, height: effectiveHeight});
    effectiveX = normalized.x;
    effectiveY = normalized.y;
    effectiveWidth = normalized.width;
    effectiveHeight = normalized.height;

    return (
      <g key={i}>
        { classification_label &&
          <text
            x={effectiveX} y={effectiveY - 10} fill={isActive ? 'red' : '#000'}
            style={{fontSize: "20px", textShadow: `1px 1px ${c}, -1px 1px ${c}, 1px -1px ${c}, -1px -1px ${c}`}}>
            {classification_label}
          </text> }
        <rect
          data-role={'bbox'}
          x={effectiveX} y={effectiveY} width={effectiveWidth} height={effectiveHeight}
          fillOpacity="0" stroke={isActive ? 'red' : '#000'} strokeWidth="2"
          data-action={JSON.stringify({activePolygon: null, activeRect: i, operation: 'move', overridePoint: {}})}
        />
      { isActive &&
          <>
          {Object.entries({
            nw: [0, 0],
            ne: [effectiveWidth, 0],
            sw: [0, effectiveHeight],
            se: [effectiveWidth, effectiveHeight],

            w: [0, Math.round(effectiveHeight / 2)],
            e: [effectiveWidth, Math.round(effectiveHeight / 2)],
            n: [Math.round(effectiveWidth / 2), 0],
            s: [Math.round(effectiveWidth / 2), effectiveHeight],
          }).map(([k, v]) => (
            <circle
              key={k}
              cx={effectiveX + v[0]} cy={effectiveY + v[1]} r={5} fill="red" cursor={k + '-resize'}
              data-action={JSON.stringify({activePolygon: null, activeRect: i, operation: 'resize', kind: k, overridePoint: {}})}
            />
          ))}
          </> }
      </g>
    );
  };

	removeBoundingBox = () => {
		this.setState(state => {
	    return {
        boundingBoxes: state.boundingBoxes.map((x, i) => (i !== state.activeRect) && x).filter(Boolean),
        boundingPolygons: state.boundingPolygons.map((x, i) => (i !== state.activePolygon) && x).filter(Boolean)
      };
		});
	}

  render () {
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
    const currentImage = taskData && taskData.images[currentItem];

    let intercept = -(0.5 * contrast) + 0.5;

    const currentPolygonSegments = [...(this.state.polygonSegments || [])];
    if (this.state.overridePoint && (typeof (this.state.overridePoint.x) !== 'undefined')) {
      currentPolygonSegments.push(this.state.overridePoint);
    }

    return (
      <div className="row img-classify-tool">
        <div className="controls col-md-3 col-sm-3 col-xs-12">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h5>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h5>
            )}
            <hr />
          </div>
          <ToolImgBoundingBox
            mode={this.state.mode}
            setMode={this.setMode}
            handleReset={this.handleReset}
            handleRefresh={this.handleRefresh}
            handleSave={this.handleSave}
            handlePrev={this.handlePrev}
            handleNext={this.handleNext}
            handleDrawingOff={this.handleDrawingOff}
            removeShape={this.removeShape}
            removeBoundingBox={this.removeBoundingBox}
            handleRemoveMarker={this.handleRemoveMarker}
            handleDrawingOn={this.handleDrawingOn}
            handleChangeSelectedTags={this.handleChangeSelectedTags}
            handleChangeTags={this.handleChangeTags}
            handleChange={this.handleChange}
            createPolygon={this.createPolygon}
            tags={tags}
            brightness={brightness}
            contrast={contrast}
            saturate={saturate}
            selectedTags={selectedTags}
            taskData={taskData}
          />
        </div>
        <div className="data img-marker-tool col-md-7 col-sm-7 col-xs-12">
          <div className="panel img-tool-content" style={{"marginTop":"3rem"}}>
            <div id="tool-text-content" className="container-flex-1">
              {!taskData ? (
                <p className="text-center">Loading...</p>
              ) : (
                <Fragment>
                  <svg
                    style={{ height: "100%", width: "100%" }}
                    onMouseMove={e => {
                      const { left, top } = e.currentTarget.getBoundingClientRect();
                      const { offsetX, offsetY } = getOffset(e);

                      this.setState(state => {
                        const { operation, kind, dragStartPoint, overridePoint } = this.state;

                        if (operation === 'drawPolygonStart') {
                          return {overridePoint: {x: offsetX, y: offsetY}};
                        } 
                        else if (operation) {
                          let dx=0, dy=0;
                          if(dragStartPoint !== null) {
                            dx = offsetX - dragStartPoint.x; 
                            dy = offsetY - dragStartPoint.y;
                          }
                            

                          if (operation === 'move') {
                            return {overridePoint: {x: dx, y: dy}};
                          } 
                          else if (operation === 'polygonChange') {
                            let updatedPolygons = state.boundingPolygons;
                            updatedPolygons[state.activePolygon].points = updatedPolygons[state.activePolygon].points.map((p, i) => (i === state.pointIndex) ? {x: offsetX, y: offsetY} : p);

                            return { boundingPolygons: updatedPolygons };
                          } 
                          else if (operation === 'resize' && kind === 'nw') {
                            return {overridePoint: {x: dx, y: dy, width: -dx, height: -dy}};
                          } 
                          else if (operation === 'resize' && kind === 'ne') {
                            return {overridePoint: {x: 0, y: dy, width: dx, height: -dy}};
                          }
                          else if (operation === 'resize' && kind === 'sw') {
                            return {overridePoint: {x: dx, y: 0, width: -dx, height: dy}};
                          } 
                          else if (operation === 'resize' && kind === 'se') {
                            return {overridePoint: {x: 0, y: 0, width: dx, height: dy}};
                          } 
                          else if (operation === 'resize' && kind === 'w') {
                            return {overridePoint: {x: dx, width: -dx}};
                          } 
                          else if (operation === 'resize' && kind === 'e') {
                            return {overridePoint: {width: dx}};
                          } 
                          else if (operation === 'resize' && kind === 'n') {
                            return {overridePoint: {y: dy, height: -dy}};
                          } 
                          else if (operation === 'resize' && kind === 's') {
                            return {overridePoint: {height: dy}};
                          } 
                          else if (operation === 'drawRectStart') {
                            const index = state.boundingBoxes.length;
                            
                            return {
                              boundingBoxes: [...state.boundingBoxes,
                                normalizeRect({x: dragStartPoint.x, y: dragStartPoint.y,
                                  width: dx,
                                  height: dy,
                                  overridePoint: {x: dx, y: dy},
                                  classification_label: null
                                })],
                              operation: 'resize',
                              kind: 'se',
                              activeRect: index
                            };
                          }
                          
                        }
                        return {};
                      });
                    }}
                    onMouseUp={e => {
                      this.setState(state => {
                        if (state.operation === 'drawPolygonStart') return {};
                        if (!state.operation) {
                          return {activeRect: null, activePolygon: null};
                        }

                        if (state.activeRect || state.activeRect === 0) {
                          const current = state.boundingBoxes[state.activeRect];
                          if (!current) {
                            return {};
                          }
                          const updated = normalizeRect({
                            ...current,
                            x: current.x + (state.overridePoint.x || 0),
                            y: current.y + (state.overridePoint.y || 0),
                            width: current.width + (state.overridePoint.width || 0),
                            height: current.height + (state.overridePoint.height || 0)
                          });

                          let updatedBoundingBoxes = [...state.boundingBoxes];
                          updatedBoundingBoxes[state.activeRect] = updated;

                          //tooltip dialog doModal()
                          if(current.classification_label === '' || current.classification_label === null)
                            this.showTagsToolTip(updated.x + updated.width, updated.y + updated.height);

                          let selectedShape=[];
                          selectedShape.type = 'rect';

                          return {
                           // mode: (state.mode === 'rect') ? null : state.mode,
                            operation: null,
                            dragStartPoint: null,
                            overridePoint: null,
                            boundingBoxes: updatedBoundingBoxes,
                            selectedShape: selectedShape
                          };
                        } 
                        else if (state.activePolygon || state.activePolygon === 0) { //redpolygon, polygon completed
                          const current = state.boundingPolygons[state.activePolygon];
                          if (!current) {
                            console.warn('no element: ', state.activePolygon, state.polygons);
                            return {};
                          }
                          const applyMove = (this.state.overridePoint && typeof this.state.overridePoint.x !== 'undefined') ? 
                                (({x, y}) => ({x: x + this.state.overridePoint.x, y: y + this.state.overridePoint.y})) : 
                                (a => a);

                          const updated = current.points.map(applyMove);
                          let updatedPolygons = [...state.boundingPolygons];//origin + new polygons
                          updatedPolygons[state.activePolygon].points = updated;

                          //label popup
                          if(current.classification_label === '')
                            this.showTagsToolTip(state.polygonTooltipPosX, state.polygonTooltipPosY);

                          let selectedShape=[];
                          selectedShape.type = 'polygon';

                          return {
                           // mode: (state.mode === 'polygon') ? null : state.mode,
                            operation: null,
                            dragStartPoint: null,
                            overridePoint: null,
                            selectedShape: selectedShape
                            //polygons: updatedPolygons,
                          };
                        }
                      });
                    }}
                    onMouseDown={e => {
                      const { left, top } = e.currentTarget.getBoundingClientRect();
                      const action = e.target && e.target.getAttribute('data-action');
                      const { offsetX, offsetY } = getOffset(e);
                      
                      this.setState(state => {
                       
                        if (state.mode === 'rect') {
                          return {operation: 'drawRectStart',activePolygon: null, showTagsModal: false, dragStartPoint: {x: offsetX, y: offsetY}};
                        } 
                        else if (state.mode === 'polygon') {
                          if (!state.operation) {
                            return {operation: 'drawPolygonStart',activeRect: null, activePolygon: null, showTagsModal: false, polygonSegments: [{x: offsetX, y: offsetY}]};
                          } 

                          else if (action && JSON.parse(action).operation === 'polygonComplete') {
                            state.boundingPolygons.push({classification_label: "", points: state.polygonSegments});
                            this.forceUpdate();
                            console.log('index', state.polygons);
                            return {
                             // mode: null, 
                              operation: 'polygonComplete',                               
                              //polygons: [...(state.polygons || []), state.polygonSegments],//add new polygon
                              overridePoint: {}, 
                              polygonSegments: [],
                              activePolygon: state.boundingPolygons.length - 1,
                              polygonTooltipPosX: offsetX,
                              polygonTooltipPosY: offsetY,
                            };
                          } 

                          else if (action && JSON.parse(action).operation === 'polygonCancel') {
                            return { operation: null, overridePoint: {}, activePolygon: null, polygonSegments: []};
                          } 

                          else if (state.operation === 'drawPolygonStart') {
                            return {polygonSegments: [...state.polygonSegments, {x: offsetX, y: offsetY}], activeRect: null};
                          }
                        } 
                        else if (action) {
                          return {...JSON.parse(action), dragStartPoint: {x: offsetX, y: offsetY}};
                        }

                        return {showTagsModal: false,activeRect: null, activePolygon: null};
                      });
                      }
                    }
                  >
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
                      xlinkHref={currentImage}
                    />
                    
                    {
                      this.state.boundingBoxes.map(this.drawRect)
                    }
                    { this.state.boundingPolygons && this.state.boundingPolygons.length && 
                        this.state.boundingPolygons.map((polygon, j) => {
                          const {classification_label, points} = {...polygon};
                          const isActive = this.state.activePolygon === j;
                          const applyMove = (isActive && this.state.overridePoint && typeof this.state.overridePoint.x !== 'undefined') ? 
                              (({x, y}) => ({x: x + this.state.overridePoint.x, y: y + this.state.overridePoint.y})) : 
                              (a => a);
                          let labelpos = points[0];
                          return (
                            <g key={'p' + j}>
                              { classification_label &&
                                <text
                                  x={labelpos.x} y={labelpos.y} fill={isActive ? 'red' : '#000'}
                                  style={{fontSize: "20px", textShadow: "1px 1px, -1px 1px, 1px -1px, -1px -1px"}}>
                                  {classification_label}
                                </text> }
                            <polygon stroke={isActive ? 'red' : '#000'} fillOpacity="0" strokeWidth="2" points={points.map(applyMove).map(({x, y})=>`${x},${y}`).join(' ')}
                              data-action={JSON.stringify({activeRect: null, activePolygon: j, operation: 'move', overridePoint: {}})}
                              />

                            {isActive && points.map(applyMove).map(({x, y}, i) => (
                          <circle
                            key={'seg' + i}
                            cx={x} cy={y} r={5} fill="red" cursor={'move'}
                            data-action={JSON.stringify({operation: 'polygonChange', pointIndex: i})}
                              />))}

                        </g>);})
                    }
                    { this.state.mode === 'polygon' && currentPolygonSegments.length &&
                        <>
                          <polyline stroke={'red'} fill="none" strokeWidth="2" points={currentPolygonSegments.map(({x, y})=>`${x},${y}`).join(' ')} />
                          {this.state.polygonSegments.map(({x, y}, i) => {
                            const possible = i < this.state.polygonSegments.length - 2;
                            return (
                            <circle
                              key={'seg' + i}
                              cx={x} cy={y} r={5} fill="red" cursor={possible ? 'pointer' : 'not-allowed'}
                              data-action={JSON.stringify(possible ? {operation: 'polygonComplete', kind: i} : {operation: 'polygonCancel'})}
                            />
                            );
                          })
                      }
                        </>
                        }
                  </svg>
                  
                </Fragment>
              )}
              {showTagsModal && tags !== [] && (
                <div
                  className="tags-tool-tip-abs box-shadow"
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
