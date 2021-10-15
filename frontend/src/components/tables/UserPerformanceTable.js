import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";

export default function UserTasksTable(props) {
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
        if (original.project_type === 1) {
          return "Image";
        } else if (original.project_type === 2) {
          return "Text";
        } else if (original.project_type === 3) {
          return "Audio";
        } else {
          return "Type";
        }
      }
    },
    {
      Header: "Completed Date",
      accessor: "deadline",
      Cell: ({ original }) => {
        return moment(original.deadline).format("MMMM Do, YYYY");
      }
    },
    {
      Header: "Score",
      accessor: "progress",
      Cell: ({ original }) => {
        return `${((original.ncompleted / original.nitems) * 100).toFixed(
          2
        )} %`;
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
