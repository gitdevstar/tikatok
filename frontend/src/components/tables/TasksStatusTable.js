import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Switch from "react-switch";
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
      Header: "Completed",
      accessor: "ncompleted",
      Cell: ({ original }) => {
        return `${((original.ncompleted / original.nitems) * 100).toFixed(
          2
        )} %`;
      }
    },
    {
      Header: "Deadline",
      accessor: "deadline",
      Cell: ({ original }) => {
        return moment(original.deadline).format("MMMM Do, YYYY");
      }
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ original }) => {
        if (original.status === 1) {
          if(original.ncompleted === 0) {
            return "Reset";
          } else {
            return "Ongoing";
          }
        } else if (original.status === 2) {
          return "Completed";
        } else if (original.status === 3) {
          return "Rejected";
        } else if (original.status == 4) {
          return "Delivery ready";
        }
      }
    },
    // {
    //   Header: "Assigned user",
    //   accessor: "assigned_user"
    // },
    
    // {
    //   Header: "Tika score",
    //   accessor: "tika_score_flag",
    //   Cell: ({ original }) => {
    //     return (
    //       <Switch
    //         onChange={() => {
    //           props.toggleSwitchRow(original);
    //         }}
    //         onColor="#000"
    //         height={20}
    //         uncheckedIcon={false}
    //         checkedIcon={false}
    //         boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    //         activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
    //         checked={!!+original.tika_score_flag}
    //       />
    //     );
    //   }
    // }
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
