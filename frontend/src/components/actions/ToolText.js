import React from "react";
import Switch from "react-switch";
import TagsInput from "react-tagsinput";

export default function ToolText(props) {
  const {
    handleChange,
    handleTextAlignChange,
    handleFontSizeChange,
    toggleSwitchBold,
    toggleSwitchWhiteSpace,
    handleChangeTags,
    handleChangeSelectedTags,
    handleSave,
    handleRefresh,
    handleReset,
    handlePrev,
    handleNext
  } = props;
  return (
    <div className="actions-tool-text" style={{ "height": "80%" }}>
      {/* action buttons */}
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

      {/* origin tags */}
      <div className="mt-5 switch-bold text-center">
        <label className="col-md-12 col-sm-12 col-xs-12 text-bold">
          Labels
        </label>
        <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
          <TagsInput value={props.tags} onChange={handleChangeTags} />
        </div>
      </div>
     
      {/* fontsize buttons */}
      <div className="actions-edit mt-4 mb-4 container-flex-1">
        <div className="font-size">
          <button
            className="btn btn-primary"
            style={{ height: 35, width: 35 }}
            onClick={() => handleFontSizeChange("+")}
          >
            <i className="fa fa-plus" />
          </button>
          <span> {props.fontSize} </span>
          <button
            className="btn btn-primary"
            style={{ height: 35, width: 35 }}
            onClick={() => handleFontSizeChange("-")}
          >
            <i className="fa fa-minus" />
          </button>
        </div>
      </div>
      {/* font-Bold */}
      <div className="switch-bold container-flex-1 mt-5">
        <label className="col-md-6 col-xs-12 text-bold text-right">Bold</label>
        <Switch
          className="col-md-6 col-sm-12 col-xs-12"
          onChange={toggleSwitchBold}
          onColor="#000"
          height={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          checked={props.bold}
        />
      </div>

      <div className="switch-wrap container-flex-1">
        <label className="col-md-6 col-xs-12 text-bold text-right">Word Wrap</label>
        <Switch
          className="col-md-6 col-sm-12 col-xs-12"
          onChange={toggleSwitchWhiteSpace}
          onColor="#000"
          height={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          checked={props.whiteSpace}
        />
      </div>

      <div className="actions-align mt-4 container-flex-1 mt-5">
        <button
          onClick={() => handleTextAlignChange("left")}
          className="btn btn-primary"
          style={{ height: 35, width: 35 }}
          title="Align Left"
        >
          <i className="fa fa-align-left" />
        </button>
        <button
          onClick={() => handleTextAlignChange("center")}
          className="btn btn-primary"
          style={{ height: 35, width: 35 }}
          title="Align Center"
        >
          <i className="fa fa-align-center" />
        </button>
        <button
          onClick={() => handleTextAlignChange("right")}
          className="btn btn-primary"
          style={{ height: 35, width: 35 }}
          title="Align Right"
        >
          <i className="fa fa-align-right" />
        </button>
        <button
          onClick={() => handleTextAlignChange("justify")}
          className="btn btn-primary"
          style={{ height: 35, width: 35 }}
          title="Justify"
        >
          <i className="fa fa-align-justify" />
        </button>
      </div>

      <div className="switch-wrap text-center container-flex-1 mt-5">
          <div className="col-md-3">
            <label htmlFor="sliderRange" className="text-bold">
            Wrap
          </label>
          </div>
          <div className="col-md-9">
            <input
            type="range"
            name="paddingRight"
            value={props.paddingRight}
            onChange={handleChange}
            className="custom-range"
            id="sliderRange"
          />
          <label className="text-bold">{props.paddingRight}</label>
          </div>
      </div>
    
    {/* selected tags */} 
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
