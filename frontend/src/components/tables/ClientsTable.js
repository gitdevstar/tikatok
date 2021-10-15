import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function ClientsTable(props) {
  const { getCountryName } = props;
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
            checked={props.selectAll}
            onChange={() => props.toggleSelectAll()}
          />
        );
      },
      sortable: false,
      width: 40
    },
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Year",
      accessor: "year"
    },
    {
      Header: "Country",
      accessor: "country",
      Cell: props => {
        return getCountryName(props.value);
      }
    },
    {
      Header: "Address",
      accessor: "address"
    },
    {
      Header: "No. of Proj",
      accessor: "no_of_projects"
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
            console.log(rowInfo)
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
