import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Switch from "react-switch";

export default function TasksTable(props) {
  const { getProjectName, getProjectType, getUserName } = props;
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
      Header: "Project",
      accessor: "project",
      Cell: props => {
        return getProjectName(props.value);
      }
    },
    {
      Header: "Type",
      accessor: "project",
      Cell: props => {
        const projectTasksType = getProjectType(props.value);
        if(annotation_type.length > projectTasksType - 1) {
          return annotation_type[projectTasksType - 1];
        } else {
          return "data type";
        }
      }
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: props => {
        if (props.value === 1) return "Incomplete";
        else if (props.value === 2) return "Completed";
        else if (props.value === 3) return "Rejected";
        else if (props.value == 4) return "delivery ready";
        else return "status";
      }
    },
    {
      Header: "Assigned manager",
      accessor: "assigned_manager_id",
      Cell: props => {
        return getUserName(props.value);
      }
    },
    {
      Header: "Assigned user",
      accessor: "assigned_user_id",
      Cell: props => {
        return getUserName(props.value);
      }
    },
    {
      Header: "Tika score",
      accessor: "tika_score_flag",
      Cell: ({ original }) => {
        return (
          <Switch
            onChange={() => {
              props.toggleSwitchRow(original);
            }}
            onColor="#000"
            height={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            checked={!!+original.tika_score_flag}
          />
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
