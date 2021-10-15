import React from "react";
import TagsInput from "react-tagsinput";

export default function ToolText(props) {
  const {
    handleChange,
    handleChangeTags,
    handleChangeSelectedTags,
    handleSave,
    handleNext,
    handlePrev,
    handleRefresh,
    handleReset
  } = props;
  return (
    <div className="actions-tool-text" style={{ "height": "80%" }}>
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

      <div className="switch-wrap text-center container-flex-1">
        <div className="mt-4">
          <label htmlFor="sliderRange" className="text-bold">
            Speed
          </label>
          <input
            type="range"
            name="speed"
            value={props.speed}
            onChange={handleChange}
            className="custom-range"
            id="sliderRange"
            min="-2"
            max="2"
          />
          <label className="text-bold">{props.speed}</label>
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
