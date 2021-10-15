import React from "react";
import TagsInput from "react-tagsinput";

export default function ImgClassifyTool(props) {
  const {
    handleChange,
    handleChangeTags,
    handleChangeSelectedTags,
    handleSave,
    handleRefresh,
    handleReset,
    handlePrev,
    handleNext,
  } = props;
  return (
    <div className="actions-tool-text">
      <div className="">
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
            min="100"
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
            min="100"
            max="1000"
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
              max="100"
            />
            <label className="text-bold">{props.saturate}</label>
          </div>
      </div>

      

      <div className="mt-5 switch-bold text-center">
        <label className="col-md-12 col-sm-12 col-xs-12 text-bold">
          Selected Labels
        </label>
        <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
          <TagsInput
            value={props.selectedTags}
            onChange={handleChangeSelectedTags}
          />
        </div>
      </div>
    </div>
  );
}
