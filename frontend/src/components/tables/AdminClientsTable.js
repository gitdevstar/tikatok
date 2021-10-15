import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function AdminClientsTable(props) {
  const columns = [
    {
        Header: "#",
        accessor: "num"
    },
    {
        Header: "Name",
        accessor: "name"
    },
  ];
  return (
    <div className="table">
      <ReactTable
        data={props.data}
        columns={columns}
        defaultSorted={[{ id: "id", desc: false }]}
        className="-striped ReactTableSmall"
        showPagination={false}
      /> 
    </div>
  );
}
