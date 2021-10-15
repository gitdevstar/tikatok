import React, { Component, Fragment } from "react";
import { getTask, rejectTask } from "../../API/TasksRequests";
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
    this.loadBoundingBoxes = this.loadBoundingBoxes.bind(this);
  }

  handleNext = () => {
    const { task } = this.state;
    let { currentItem } = this.state;

    if (currentItem + 1 < task.nitems) {
      currentItem = currentItem += 1;

      this.setState({ currentItem });
      this.setState({polygons:[]});
      this.loadTask(task, currentItem);
    }
  };

  handlePrev = () => {
    const { task } = this.state;
    let { currentItem } = this.state;

    if (currentItem + 1 > 1) {
      currentItem = currentItem -= 1;

      this.setState({ currentItem });
      this.setState({polygons:[]});
      this.loadTask(task, currentItem);
    }
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
  componentDidMount() {
    const { location } = this.props;
    if (location.state == null) {
      this.props.history.push("/manager/task-status");
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
  reject = ()=> {
    rejectTask(this.state.task.id).then(
      res=>{
        if(res.status === 200)
          // this.setState({reject:true});
          this.props.history.push('/manager/task-status');
      }
    );
  }

  render () {
    const {
      currentItem,
      taskData,
      brightness,
      contrast,
      saturate,      
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
        <div className="controls col-md-3 col-sm-3 col-xs-12 text-center">
          <div className="panel text-center">
            {task && <h3>Task {task.task_id}</h3>}
            {task && (
              <h5>
                <span>{currentItem + 1}</span>/<span>{task.nitems}</span>
              </h5>
            )}
            <hr />
          </div>
          <button className="btn btn-danger" onClick={this.reject} disabled={this.state.reject}>Reject Task</button>
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
