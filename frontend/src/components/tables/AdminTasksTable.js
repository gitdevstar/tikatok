import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default function AdminTasksTable(props) {
    const { getDataTypeName } = props;
    const columns = [
        {
            Header: "#",
            accessor: "num"
        },
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Project Name",
            accessor: "project_name",
        },
        {
            Header: "Data Type",
            accessor: "datatype",
            Cell: props => {
                return getDataTypeName(props.value);
            }
        },
        {
            Header: "Items",
            accessor: "items",
        },
        {
            Header: "Assign Manager",
            accessor: "manager",
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