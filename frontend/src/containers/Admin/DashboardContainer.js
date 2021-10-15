import React, { Component } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import AdminClientsTable from "../../components/tables/AdminClientsTable";
import AdminProjectsTable from "../../components/tables/AdminProjectsTable";
import AdminTasksTable from "../../components/tables/AdminTasksTable";
// import Pagination from "../../components/paginator/Pagination"

import {
  getDashboardData,
  getAdminDashboardClientCurrentData
} from "../../API/ClientsRequests";

export default class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      year: "",
      country: 0,
      address: "",
      clientId: 0,
      clients: [],
      countries: [],
      formToLoad: 0,
      selectAll: false,
      selectedClients: 0,
      modalTitle: "",
      yearFrom: 0,
      yearTo: 0,
      projectsFrom: 0,
      projectsTo: 0,
      projects: [],
      tasklist: [],
      totalRecords: 5,
      pageLimit: 1, 
    };

    // this.onPageChanged = this.onPageChanged.bind(this);
  }
  
  getDataTypeName = num => {
    return num == 1 ? "Image" : num == 2 ? "Text" : "Audio"; 
  };

  // onPageChanged = data => {
  //   console.log("onPageChange");
  //   const {currentPage, pageLimit } = data;
  //   getAdminDashboardClientCurrentData(currentPage, pageLimit).then(data => {
  //     this.setState({
  //       clients: data.clients,
  //       totalRecords: data.totalRecords,
  //       pageLimit: data.pageLimit
  //     });
  //   });
  // }

  // getPaginatorInfo = async function() {
  //   const data = await getAdminDashboardClientCurrentData(1, 1);
  //     // .then(data => {
  //   console.log(data.totalRecords);
  //   return data.totalRecords;
  //     // });
  // }

  componentDidMount() {

    // getAdminDashboardClientCurrentData(1, 1).then(data => {
    //   this.setState({
    //     clients: data.clients,
    //     totalRecords: data.totalRecords,
    //     pageLimit: data.pageLimit
    //   });
    // });

    getDashboardData().then(data => {
        this.setState({
            clients: data.clients,
            projects: data.projects,
            tasklist: data.tasklist,
        })
    });
  }

  render() {
    return (
      <div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="table-content">
                <div className="table-header">
                    <span>Clients</span>
                    <hr />
                </div>
                <AdminClientsTable
                    data={this.state.clients}
                />
            </div>
          </div>
          <div className="col-md-6">
            <div className="table-content">
              <div className="table-header">
                  <span>Projects</span>
                  <hr />
              </div>
              <AdminProjectsTable
                  getDataTypeName = {this.getDataTypeName}
                  data={this.state.projects}
              />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="table-content">
              <div className="table-header">
                  <span>Tasklist</span>
                  <hr />
              </div>
              <AdminTasksTable
                getDataTypeName = {this.getDataTypeName}
                data={this.state.tasklist}
              />
            </div>
          </div>
        </div>
        <div id="btnDownload" />
      </div>
    );
  }
}
