import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function ProjectsTable(props) {
  const { getClientName } = props;
  const data_type = [
    'Image',
    'Text',
    'Audio'
  ];
  
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
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: props => {
        if (props.value === 1) return "Incompleted";
        else if (props.value === 4) return "Delivery ready";
      }
    },
    {
      Header: "Client",
      accessor: "client",
      Cell: props => {
        return getClientName(props.value);
      }
    },
    {
      Header: "Year",
      accessor: "year"
    },
    {
      Header: "Type DataFile",
      accessor: "data_type",
      Cell: props => {
        if(props.value - 1 < data_type.length) {
          return data_type[props.value - 1];
        } else {
          return 'data type';
        }
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
