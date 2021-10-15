import React, { Component, Fragment } from "react";
/* import Sound from "react-sound"; */
import ToolImgSemantic from "../../components/actions/ToolImgSemantic";
import { getTask, SaveImgDataTask, resetImageResult, assignTask } from "../../API/TasksRequests";

// import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";

import $ from "jquery";
import  draggable from
     '../../../node_modules/jquery-ui/ui/widgets/draggable';
//import "../../notify.min.js";
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
    currentIndex: 0,
    polygonIndex: 0,
    coords:[],
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
    this.pickColor = this.pickColor.bind(this);
    // this.mouseUpHandler = this.mouseUpHandler.bind(this);
    // this.loadBoundingBoxes = this.loadBoundingBoxes.bind(this);
  }

  handleSave = () => {
    //block drawing
    this.setState({drawingMode: false, showTagsModal: false});

    const allPolygons = $("#theSVG").find("polygon");
    
    if(allPolygons.length > 0) {
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
  
      const allPolygons = $("#theSVG").find("polygon");
      let semantic = {};
      // data init 
      image_info[`${item_name}`].semantic_objects = [];

      for (var i = 0; i < allPolygons.length; i++) {
        const classification_label = allPolygons[i].attributes.name.value;
        if(classification_label === '') continue;

        const points = allPolygons[i].attributes.points.value;
        const fillcolor = allPolygons[i].attributes.fill.value;

        let point_2D=[];
        let point_temp = points.split(' ');
        for(let i = 0; i < point_temp.length; i=i+2)
          point_2D.push([parseFloat(point_temp[i]), parseFloat(point_temp[i+1])]);

        semantic = { point_2D, classification_label, fillcolor };
        
        image_info[`${item_name}`].semantic_objects.push(semantic);
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
        const { task } = this.state;
        this.loadTask(task, currentItem);
      });
    }
}

  handleNext = () => {
    //block drawing
    this.setState({drawingMode: false, showTagsModal: false});
    const allPolygons = $("#theSVG").find("polygon");
    if(allPolygons.length > 0) {
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
  
      const allPolygons = $("#theSVG").find("polygon");
      let semantic = {};
      // data init 
      image_info[`${item_name}`].semantic_objects = [];

      for (var i = 0; i < allPolygons.length; i++) {
        const classification_label = allPolygons[i].attributes.name.value;
        if(classification_label === '') continue;

        const points = allPolygons[i].attributes.points.value;
        const fillcolor = allPolygons[i].attributes.fill.value;

        let point_2D=[];
        let point_temp = points.split(' ');
        for(let i = 0; i < point_temp.length; i=i+2)
          point_2D.push([parseFloat(point_temp[i]), parseFloat(point_temp[i+1])]);

        semantic = { point_2D, classification_label, fillcolor };

        image_info[`${item_name}`].semantic_objects.push(semantic);
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
      if(this.state.task === null) {
        console.log(this.state.task);
        return;
      }
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

    this.setState({drawingMode: false, showTagsModal: false});

    const allPolygons = $("#theSVG").find("polygon");
    if(allPolygons.length > 0) {
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
  
      const allPolygons = $("#theSVG").find("polygon");
      let semantic = {};
      // data init 
      image_info[`${item_name}`].semantic_objects = [];

      for (var i = 0; i < allPolygons.length; i++) {
        const classification_label = allPolygons[i].attributes.name.value;
        if(classification_label === '') continue;

        const points = allPolygons[i].attributes.points.value;
        const fillcolor = allPolygons[i].attributes.fill.value;
        let point_2D=[];
        let point_temp = points.split(' ');

        for(let i = 0; i < point_temp.length; i=i+2)
          point_2D.push([parseFloat(point_temp[i]), parseFloat(point_temp[i+1])]);
        semantic = { point_2D, classification_label, fillcolor };
        
        image_info[`${item_name}`].semantic_objects.push(semantic);
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
      if(this.state.task === null) {
        console.log(this.state.task);
        return;
      }
      const { task } = this.state;
        let { currentItem } = this.state;
        if (currentItem + 1 > 1) {
          currentItem = currentItem -= 1;
          this.setState({ currentItem });
          this.loadTask(task, currentItem);
        }
    }
    
  };

  handleRefresh = () => {
    this.setState({showTagsModal: false});
    this.setState({drawingMode: false});

    const { task, currentItem } = this.state;
    this.loadTask(task, currentItem);
  }

  handleReset = () => {
    this.setState({showTagsModal: false});

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

  handleChangeTags = tags => {
    tags = [...new Set(tags)];
    this.setState({ labels: tags.join(), tags });
  };

  handleChangeSelectedTags = selectedTags => {
    let { taskData, currentItem, image_info } = this.state;
    // const url_value = taskData.images[currentItem].toString();      
    // let item_name = url_value.replace(/^.*[\\\/]/, "");

    // image_info[`${item_name}`].selected_tags[currentItem] = selectedTags.join();
    selectedTags = [...new Set(selectedTags)];
    this.setState({
      taskData,
      seletedLabels: selectedTags.join(),
      selectedTags
    });
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

  showTagsToolTip = () => {
   // const { clientX: x, clientY: y } = e;
    this.setState({
      showTagsModal: true,
      x: this.state.currX ,
      y: this.state.currY,
      clickCounter: this.state.clickCounter + 1
    });
  };

  handleTagSelected = (e, tag) => {
    e.stopPropagation();

    this.createText(tag);

    let { selectedTags, seletedLabels, currentItem, taskData } = this.state;
    selectedTags.push(tag);
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

    this.setState({polygonIndex: 0});
    
    if (taskData.annotation_dictionary != null || taskData.annotation_dictionary.length != 0) {
      const annotation =
        taskData.annotation_dictionary[
          `${taskData.images[currentItem].toString().replace(/^.*[\\\/]/, "")}`
        ];
        if(annotation) {
            const semantics = annotation["annotation"].data_annotation["semantic"];  
                      
            semantics.map(semantic => {
              //new data
              if(semantic.point_2D !== null)
              { 
                const points = semantic.point_2D;                
                const label = semantic.classification_label;
                this.setState({currentPolygonPoints: points});
                const fillcolor = semantic.fillcolor;             
              
                this.setState({fillColor: fillcolor});

                var polygon = this.createPolygon();
                this.createText(label);
                this.bindPolygonFunc(polygon);
               
              }
              //old data
              // if(semantic.points_real !== null)
              // {
              //   const points = semantic.points_real;
              //   const label = semantic.label;
              //   this.setState({currentPolygonPoints: points});
              //   this.createText(label);
              //   console.log(this.state.currentPolygonPoints) 
              // }
              return semantic;
            });
        }
      
    }
    
    this.setState({fillColor: "black"});
  }

  createText = (text) => {

    let allPolygons = $("#theSVG").find("polygon");
    if(allPolygons.length > 0)
      allPolygons[allPolygons.length-1].setAttributeNS(null, 'name', text);

    var newText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    if(newText) {
      newText.setAttributeNS(null, "x", this.state.currX);
      newText.setAttributeNS(null, "y", this.state.currY - 10);
      newText.setAttributeNS(null, "font-size", "16");
      newText.setAttributeNS(null, "fill", "#000");
      newText.setAttributeNS(null, "stroke", "#000");
      newText.setAttributeNS(null, "index", this.state.polygonIndex);
      var textNode = document.createTextNode(text);
      newText.appendChild(textNode);
    }
    
    document.getElementById("theSVG").appendChild(newText);
  };

  getText = (index) => {
    const allTexts = $("#theSVG").find("text");
    let len = allTexts.length;
    for (var i = len - 1; i >= 0; i --) {
      if( parseInt(allTexts[i].attributes.index.value) === index)
        return allTexts[i];
    }
  }

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

  polygonDelete = () => {
    console.log('fd');
    const allPolygons = $("#theSVG").find("polygon");
    const allTexts = $("#theSVG").find("text");
    const allVertexs = $("#theSVG").find("vertex");

    for (var i = allPolygons.length - 1; i >= 0; i --) {
      if(allPolygons[i].attributes.index.value == this.state.currentIndex) {
        allPolygons[i].remove();
        break;
      }  
      if(allTexts[i].attributes.index.value == this.state.currentIndex) {
        allTexts[i].remove();
      }
    }

    for (var i = allTexts.length - 1; i >= 0; i --) {       
      if(allTexts[i].attributes.index.value == this.state.currentIndex) {
        allTexts[i].remove();
        break;
      }
    }

    this.removeAllCircles();

   this.handleSave();
  }

  selectMode = () => {
    if(this.state.showTagsModal) return;
    this.setState({dot_flag: false});
    this.setState({drawingMode: false});
  }

  drawMode = () => {
    this.setState({currentPolygonPoints:[]})
    this.setState({dot_flag: true});    
    this.setState({drawingMode: true});    
  }
  
  insertXY = (x, y) => {
    this.state.currentPolygonPoints.push([x, y]);
  }

  cursorPoint = (e) => {

    let svg = document.getElementById('theSVG');
    let pt = svg.createSVGPoint();

    pt.x = e.clientX;
    pt.y = e.clientY;
    this.forceUpdate();

    // this.setState({currX: 0});
    // this.setState({currY: 0});

    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  moveXY = (event) => {
    let coordsAux = this.state.coords;
    let coords = this.cursorPoint(event.originalEvent);
    this.setState({coords});
    var move = {};
    move.x = coords.x - coordsAux.x;
    move.y = coords.y - coordsAux.y;
    return move;
  }

  findxy = (res, e) => {
    if(this.state.showTagsModal) return;
    if (!this.state.drawingMode) {//selectmode
      return;
    }
    else {//drawmode
      let {currX,currY, flag, dot_flag, currentPolygonPoints} = this.state;

      this.setState({prevX: currX});
      this.setState({prevY: currY});
  
      let coords = this.cursorPoint(e);
      this.setState({coords});
      
      this.setState({currX: coords.x});
      this.setState({currY: coords.y});
  
      if (res === 'down') {
        if(this.state.showTagsModal) return;
          this.setState({flag: true});//enable move

          //enable create circle
          if (dot_flag) {
              this.createCircle(currX, currY);
              this.insertXY(currX, currY);
          }
      }
      if (res === 'up') {
        this.setState({flag: false});//unenable move
        this.validatePolygon($('.circle'));
      }
      if (res === "leave") {
        let len = currentPolygonPoints.length;
        if(len < 3)
          return;
  
        this.setState({flag: false});//unenable move
        this.validatePolygon($('.circle'));
      }
      if (res === 'move') {
          if (flag) {              
            this.setState({prevX: currX});
            this.setState({prevY: currY});
  
            let coords = this.cursorPoint(e);
            this.setState({coords});
            
            this.setState({currX: coords.x});
            this.setState({currY: coords.y});
  
            this.insertXY(currX, currY);
            this.createLine();
          }
      }
    }
    
  }

  createCircle = (x, y) => {
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      let svg = document.getElementById('theSVG');
      
      circle.setAttributeNS(null, 'cx', x);
      circle.setAttributeNS(null, 'cy', y);
      circle.setAttributeNS(null, 'r', 4);
      circle.setAttributeNS(null, 'style', 'stroke-width: 1px;');
      circle.setAttributeNS(null, 'class', 'circle');
      svg.appendChild(circle);
      this.setState({svg});
      return circle;
  };

  createLine = () => {
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttributeNS(null, 'x1', this.state.prevX);
      line.setAttributeNS(null, 'y1', this.state.prevY);
      line.setAttributeNS(null, 'x2', this.state.currX);
      line.setAttributeNS(null, 'y2', this.state.currY);
      line.setAttributeNS(null, 'class', 'line');
      $('.circle').before(line);
  };

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

    const index = this.state.polygonIndex;

    this.setState({polygonIndex: index + 1});

    polygon.setAttributeNS(null, 'class', 'polygon');
    polygon.setAttributeNS(null, 'name', '');
    polygon.setAttributeNS(null, 'fill', this.state.fillColor);
    polygon.setAttributeNS(null, 'opacity', 0.8);
    polygon.setAttributeNS(null, 'index', index + 1);
    svg.appendChild(polygon);
    this.setState({svg});
    
    return polygon;
  };

  draggableVertex = (polygon, e = this) => {
    var points = polygon;
    let svg = document.getElementById('theSVG');
    points.map( (i,point) => {
      var vertex = this.createCircle(point.x, point.y);
      $(vertex)
          .draggable()
          .bind('mousedown', function (event, ui) {
              $(event.target.parentElement).append(event.target);
              let coords = e.cursorPoint(event);
              e.setState({coords});
          })
          .bind('drag', function (event) {
              var move = e.moveXY(event);
              point.x = point.x + move.x;
              point.y = point.y + move.y;
              vertex.setAttributeNS(null, 'cx', point.x);
              vertex.setAttributeNS(null, 'cy', point.y);
          });
          svg.appendChild(vertex);
    })           
  }

  bindPolygonFunc = (polygon, e = this) => {
    
  $(polygon)
    .draggable()
    .bind('mousedown', function (event, ui) {
      if(e.state.showTagsModal) return;
        $(event.target.parentElement).append(event.target);
        var index = parseInt(event.target.attributes.index.value);
        e.setState({currentIndex: index});
        console.log(index);
        let coords = e.cursorPoint(event);
        e.setState({coords});

        $('.circle').attr('class', 'circle hide');
        $('svg').find('circle').remove();
        e.setState({showTagsModal: false});
    })
    .bind('mouseup', function (event, ui) {
      if(e.state.drawingMode) return;
        var points = event.currentTarget.points;
        var move = e.moveXY(event);

        for (var i = 0; i < points.numberOfItems; i++) {
            (function (i) {
                var point = points.getItem(i);
                point.x = point.x + move.x;
                point.y = point.y + move.y;
            }(i));
        }
        if ($(polygon) !== null)
            e.draggableVertex($(points));
        $('.circle').attr('class', 'circle');
    })
    .bind('drag', function (event, ui) {
      if(e.state.drawingMode) return;
        var points = event.currentTarget.points;
      
        var text = e.getText(e.state.currentIndex);      
        
        var move = e.moveXY(event);
        //polygon moving
        for (var i = 0; i < points.numberOfItems; i++) {
          (function (i) {
              var point = points.getItem(i);
              point.x = point.x + move.x;
              point.y = point.y + move.y;
          }(i));
        }

        //text moving
        if(text !== null && text !== undefined) {
          text.setAttributeNS(null, 'x', parseInt(text.attributes.x.value) + move.x);
          text.setAttributeNS(null, 'y', parseInt(text.attributes.y.value) + move.y);
        }
        
    });
  }

  validatePolygon = (overFirstPoint) => {
     let len = this.state.currentPolygonPoints.length;
     
    if (len >= 3 && overFirstPoint && this.state.drawingMode) {
        $('.line').remove();
        $('.circle').remove();
        var polygon = this.createPolygon();//element
        this.bindPolygonFunc(polygon);
        this.setState({polygonAux: polygon});
        this.showTagsToolTip();
        this.setState({currentPolygonPoints: []});
        overFirstPoint = false;
    }
    else {
      this.state.currentPolygonPoints = [];
        overFirstPoint = false;
        $('.line').remove();
        $('.circle').remove();
    }
  }

  pickColor = color => {
    this.setState({fillColor: color});
    $('.btn-color-picker.active').removeClass('active');
    $(this).addClass('active');
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
      <div className="row img-classify-tool">
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
          {/* image edit tool */}
          <ToolImgSemantic
            handleReset={this.handleReset}
            handleRefresh={this.handleRefresh}
            handleSave={this.handleSave}
            handleNext = {this.handleNext}
            handlePrev = {this.handlePrev}
            pickColor={this.pickColor}
            selectMode={this.selectMode}
            drawMode={this.drawMode}
            selectMode={this.selectMode}
            polygonDelete={this.polygonDelete}

            handleChangeSelectedTags={this.handleChangeSelectedTags}
            handleChangeTags={this.handleChangeTags}
            handleChange={this.handleChange}
            tags={tags}            
            selectedTags={selectedTags}
            taskData={taskData}            
          />
        </div>
        {/* image panel */}
        <div className="col-md-7 col-sm-7 col-xs-12">
          <div className="data img-marker-tool col-md-12 col-sm-12 col-xs-12 mt-5">
          <div className="panel img-tool-content text-center">
            <div              
              id="tool-text-content"
              className="container-flex-1"
            >
              {!taskData ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div className="" style={{"width":"100%", "height":"100%"}}>
                  <Fragment>
                  <svg id="theSVG" filter="url(#pictureFilter)" viewBox="0 0 900 600" style={{"width":"100%", "height":"100%"}}>
                  
                  <image
                      filter="url(#pictureFilter)"
                      id="svgImg"
                      onMouseMove={e => {this.findxy('move', e)}}
                      onMouseDown={e => {this.findxy('down', e)}}
                      onMouseUp={e => {this.findxy('up', e)}}
                      onMouseLeave={e => {this.findxy('leave', e)}}
                      xlinkHref={taskData.images[currentItem]}
                      x="250"
                      y ="50"
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
        
      </div>
    );
  }
}
