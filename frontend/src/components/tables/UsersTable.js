import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function ProjectsTable(props) {
  const columns = [
    {
      id: "checkbox",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
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
      width: 45
    },
    {
      Header: "Username",
      accessor: "username"
    },
    {
      Header: "First Name",
      accessor: "first_name"
    },
    {
      Header: "Last Name",
      accessor: "last_name"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Type user",
      accessor: "type_user",
      Cell: props => {
        if (props.value === 1) return "Admin";
        else if (props.value === 2) return "Manager";
        else if (props.value === 3) return "User";
        else return "Type user";
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
