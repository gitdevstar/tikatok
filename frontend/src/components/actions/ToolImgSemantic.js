import React from "react";
import TagsInput from "react-tagsinput";
import polygon_png from "../../assets/img/polygon.png";

export default function ToolImgSymantic(props) {
  const {
    pickColor,
    selectMode,
    drawMode,
    polygonDelete,
    handleReset,
    handleSave,
    handleRefresh,
    handleChangeTags,
    handleNext,
    handlePrev,
    handleChangeSelectedTags
  } = props;
  return (
    <div className="actions-tool-text" >
      <div className="container-flex-1 ">
        <div className="actions">
          {/* <div className="color-picker">
              <button id="btnColorRed" value="red" className="btn-color-picker red" onClick={e => void pickColor('red')}></button>
              <button id="btnColorGreen" value="green" className="btn-color-picker green" onClick={e => void pickColor('green')}></button>
              <button id="btnColorBlue" value="blue" className="btn-color-picker blue" onClick={e => void pickColor('blue')}></button>
              <button id="btnColorYellow" value="yellow" className="btn-color-picker yellow" onClick={e => void pickColor('yellow')}></button>
              <button id="btnColorBlack" value="black" className="btn-color-picker black active" onClick={e => void pickColor('black')}></button>
              <button id="btnColorOrange" value="orange" className="btn-color-picker orange" onClick={e => void pickColor('orange')}></button>
          </div> */}
          <div className=" col-md-12  mt-4 text-center">
            <button id="btnClear" className="btn btn-primary ml-2 mt-3" onClick={handleRefresh}>Refresh</button>
            <button id="btnDelete" className="btn btn-primary mt-3 ml-2" onClick={handleReset}>Reset</button>
            <button id="btnSave" className="btn btn-primary ml-2 mt-3" onClick={handleSave}>Save</button>            
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
          <div className="mt-5 text-center">
            <label className="col-md-12 col-sm-12 col-xs-12 text-bold">
              Labels
            </label>
            <div className="mb-5 col-md-12 col-sm-12 col-xs-12">
              <TagsInput value={props.tags} onChange={handleChangeTags} />
            </div>
          </div>
          <div className="col-md-12 text-center mt-4">
            <button id="btnSelect" className="btn mt-3 ml-3" title="Select" alt="Select" style={{border:"solid"}}  onClick={selectMode}>
            <i
            className="fa fa-circle"
            style={{ color: "#ff0000", fontSize: 20 }}
          />
            </button>
            <button id="btnDraw" className="btn ml-3 mt-3" title="Draw" alt="Draw" style={{border:"solid", padding: 2}} onClick={drawMode}>
            <img
            src={polygon_png}
            alt="Create polygon"
            height="30px"
            width="40px"
          />
            </button>
            <button id="btnDraw" className="btn ml-3 mt-3" title="Delete" alt="Delete" style={{border:"solid", padding: 2}} onClick={polygonDelete}>
            <img
            src={polygon_png}
            alt="Create polygon"
            height="30px"
            width="40px"
          />
            </button>
          </div>  
        </div>
      </div>
      

      <div className="mt-5 text-center">
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
