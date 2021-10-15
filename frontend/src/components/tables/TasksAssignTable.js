import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
// import Switch from "react-switch";
import moment from "moment";

export default function TasksAssignTable(props) {
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
      Header: "Project",
      accessor: "project_name"
    },
    {
      Header: "Items",
      accessor: "nitems"
    },
    {
      Header: "Assigned user",
      accessor: "assigned_user"
    },
    {
      Header: "Deadline",
      accessor: "deadline",
      Cell: ({ original }) => {
        return moment(original.deadline).format("MMMM Do, YYYY");
      }
    },
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
