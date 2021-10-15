import React from "react";
import TagsInput from "react-tagsinput";

import bounding_box_png from "../../assets/img/bounding_box.png";
import bounding_box_delete_png from "../../assets/img/bounding_box_delete.png";
import polygon_png from "../../assets/img/polygon.png";
import polygon_delete_png from "../../assets/img/polygon_delete.png";
import polygon_point_delete_png from "../../assets/img/polygon_point_delete.png";

export default function ToolImgBoundingBox(props) {
  const {
    mode,
    setMode,
    handleChange,
    handleChangeTags,
    handleChangeSelectedTags,
    handleSave,
    handleMarkerOff,
    handleRefresh,
    handleReset,
    handleNext,
    handlePrev,
    removeBoundingBox
  } = props;
  return (
    <div className="actions-tool-text" >
      <div className="text-center">
        <button className="btn btn-primary m-2px" onClick={handleRefresh}>
          Refresh
        </button>
        <button className="btn btn-primary m-2px" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-primary m-2px" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="col-md-12 col-sm-8 col-xs-12 text-center">
        <button
            className="btn mt-5 ml-2 mr-2"
            onClick={handlePrev}          
          >
            <i className="fa fa-arrow-left" style={{ fontSize: 40 }} />
          </button>
        <button
            className="btn mt-5 ml-2 mr-2"
            onClick={handleNext}          
          >
            <i className="fa fa-arrow-right" style={{ fontSize: 40 }} />
        </button>
    </div>

    <div className="mt-5 switch-bold text-center">
        <label className="col-md-12 col-sm-12 col-xs-12 text-bold">
          Labels
        </label>
        <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
          <TagsInput value={props.tags} onChange={handleChangeTags} />
        </div>
      </div>

      <div className="container-flex-1 mt-5">
        <button
          title="Create bounding box"
          onClick={e => void setMode('rect')}
          className={"btn3 btn3-default" + ((mode === 'rect') ? ' active' : '')}
        >
          <img
            src={bounding_box_png}
            alt="Create bounding box"
            height="30px"
            width="40px"
          />
        </button>
        {/* <button
          title="Delete bounding box"
          onClick={removeBoundingBox}
          className={"btn3 btn3-default"}
        >
          <img
            src={bounding_box_delete_png}
            alt="Delete bounding box"
            height="30px"
            width="40px"
          />
        </button> */}
        <button
          title="Create polygon"
          onClick={e => void setMode('polygon')}
          className={"btn3 btn3-default" + ((mode === 'polygon') ? ' active' : '')}
        >
          <img
            src={polygon_png}
            alt="Create polygon"
            height="30px"
            width="40px"
          />
        </button>
        <button
          title="Done"
          onClick={e => void setMode('')}
          className="btn btn-primary m-2px"
          style={{ height: 40, width: 40, padding: 2 }}
        >
          <i
            className="fa fa-circle"
            style={{ color: "#00ff00", fontSize: 20 }}
          />
        </button>
        <button
          title="Delete object"
          // onClick={handleMarkerOff}
          onClick={removeBoundingBox}
          className={"btn3 btn3-default"}
        >
          <i
            className="fa fa-circle"
            style={{ color: "#ff0000", fontSize: 20 }}
          />
          {/* <img
            src={polygon_delete_png}
            alt="Delete polygon"
            height="30px"
            width="40px"
          /> */}
        </button>
      </div>

      {/* <div className="container-flex-1  mt-2">
        <button
          title="Create polygon"
          onClick={e => void setMode('polygon')}
          className={"btn3 btn3-default" + ((mode === 'polygon') ? ' active' : '')}
        >
          <img
            src={polygon_png}
            alt="Create polygon"
            height="30px"
            width="40px"
          />
        </button>

        <button
          title="Delete polygon"
          onClick={handleMarkerOff}
          className={"btn3 btn3-default"}
        >
          <img
            src={polygon_delete_png}
            alt="Delete polygon"
            height="30px"
            width="40px"
          />
        </button>

        <button
          title="Delete polygon point"
          onClick={e => void setMode('remove_point')}
          className={"btn3 btn3-default"}
          className={"btn3 btn3-default" + ((mode === 'remove_point') ? ' active' : '')}
        >
          <img
            src={polygon_point_delete_png}
            alt="Delete polygon point"
            height="30px"
            width="40px"
          />
        </button>
      </div>

      <div className="container-flex-1  mt-2">
        <button
          title="Done"
          onClick={e => void setMode(null)}
          className="btn btn-primary m-2px"
          style={{ height: 40, width: 40, padding: 2 }}
        >
          <i
            className="fa fa-circle"
            style={{ color: "#00ff00", fontSize: 20 }}
          />
        </button>
      </div> */}

      <div className="switch-wrap text-center container-flex-1 mt-5">
          <div className="col-3">
            <div className="row">
              <label htmlFor="sliderRangeBrightness" className="text-bold">
                Brightness
              </label>
            </div>            
          </div>
          <div className="col-9">
            <input
            type="range"
            name="brightness"
            value={props.brightness}
            onChange={handleChange}
            className="custom-range"
            id="sliderRangeBrightness"
            min="10"
            max="1000"
          />
          <label className="text-bold">{props.brightness}</label>
        </div>
      </div>

      <div className="switch-wrap text-center container-flex-1">
          <div className="col-3">
            <label htmlFor="sliderRangeContrast" className="text-bold">
            Contrast
          </label>
          </div>
          <div className="col-9">
            <input
            step="0.1"
            type="range"
            name="contrast"
            value={props.contrast}
            onChange={handleChange}
            className="custom-range"
            id="sliderRangeContrast"
            min="1"
            max="2"
          />
          <label className="text-bold">{props.contrast}</label>
          </div>
      </div>

      <div className="switch-wrap text-center container-flex-1">
          <div className="col-3">
            <label htmlFor="sliderRangeSaturate" className="text-bold">
            Saturate
          </label>
          </div>
          <div className="col-9">
            <input
              type="range"
              name="saturate"
              value={props.saturate}
              onChange={handleChange}
              className="custom-range"
              id="sliderRangeSaturate"
              min="1"
              max="1000"
            />
          <label className="text-bold">{props.saturate}</label>
          </div>
      </div>

      

      {/* <div className="mt-5 switch-bold text-center">
        <label className="col-md-12 col-sm-12 col-xs-12 text-bold">
          Selected Labels
        </label>
        <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
          <TagsInput
            value={props.selectedTags}
            onChange={handleChangeSelectedTags}
          />
        </div>
      </div> */}
    </div>
  );
}
