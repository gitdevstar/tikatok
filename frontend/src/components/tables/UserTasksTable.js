import React from "react";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function UserTasksTable(props) {
  const annotation_type = [
    'Bounding Box',
    'Multi-label Classification',
    'Multi-label Classification',
    'Multi-label Classification',
    'Landmarker',
    'Semantic Segmentation',
    'Bounding Box/Polygon'
  ];

  const columns = [
    {
      id: "checkbox",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox center-h"
            checked={original.checked === true}
            onChange={() => props.toggleRow(original)}
          />
        );
      },
      Header: x => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={props.selectAll === 1}
            ref={input => {
              if (input) {
                input.indeterminate = props.selectAll === 2;
              }
            }}
            onChange={() => props.toggleSelectAll()}
          />
        );
      },
      sortable: false,
      width: 40
    },
    {
      Header: "TaskId",
      accessor: "task_id"
    },    
    {
      Header: "Type",
      accessor: "project_type",
      Cell: ({ original }) => {
        if(original.task_type - 1 < annotation_type.length) {
          return annotation_type[original.task_type];
        } else {
          return 'type';
        }
      }
    },    
    {
      Header: "Items",
      accessor: "nitems"
    },
    {
      Header: "Progress",
      accessor: "progress",
      Cell: ({ original }) => {
        return `${((original.ncompleted / original.nitems) * 100).toFixed(
          2
        )} %`;
      }
    },
    {
      Header: "Start",
      accessor: "start",
      Cell: row => {
        const { original } = row;
        let tool = "-tool";
        if (original.task_type === 1) {
          tool = "img-bbox" + tool;
        } else if (original.task_type === 2) {
          tool = "img-classify" + tool;
        } else if (original.task_type === 3) {
          tool = "text" + tool;
        } else if (original.task_type === 4) {
          tool = "audio" + tool;
        } else if (original.task_type === 5) {
          tool = "img-marker" + tool;
        } else if (original.task_type === 6) {
          tool = "img-semantic" + tool;
        } else if (original.task_type === 7) {
          tool = "img-boxPolygon" + tool;
        }

        return (original.status === 2 || original.status === 4) ? (
          ""
        ) : (
          <Link
            to={{
              pathname: `${props.match.url}/${tool}`,
              state: { task: original }
            }}
            className="btn btn-primary"
            style={{ width: 50, height: 24, paddingBottom: 0, paddingTop: 0 }}
          >
            Go
          </Link>
        );
      }
    }
  ];
  return (
    <div className="table">
      <ReactTable
        data={props.data}
        columns={columns}
        defaultSorted={[{ id: "id", desc: false }]}
        className="-striped -highlight reacttablebig"
        getTrProps={(state, rowInfo) => {
          if(rowInfo && rowInfo.row) {
            return {
              style: {
                background: rowInfo.row.checkbox.checked === true ? '#00afec' : rowInfo.index % 2 == 0 ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0)'
              }
            }
          } else {
            return {
              style: {
                background: 'rgba(0, 0, 0, 0)'
              }
            }
          }
        }}
      />
    </div>
  );
}
