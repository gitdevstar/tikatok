import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AdminActions from "../../components/actions/AdminActions";
import ClientsTable from "../../components/tables/ClientsTable";
import ClientForm from "../../components/Forms/Clients/ClientForm";
// import Modal from "../../components/Modal";
import ClientsFilter from "../../components/Forms/Clients/ClientsFilter";

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import {
  getClients,
  saveClient,
  updateClient,
  deleteClient,
  getDashboardData
} from "../../API/ClientsRequests";
import { getCountries } from "../../API/CountriesRequests";
import { saveLog } from "../../API/LogsRequests";
import { getLoggedUser } from "../../API/LoginRequests";

export default class ClientsContainer extends Component {

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
      modal:false,
    };
  
    this.toggle = this.toggle.bind(this);
  }
  
  /* Table Methods */
  toggleRow = client => {
    let selectedClients = this.state.selectedClients;

    client.checked = client.checked === true ? false : true;

    let clients = [...this.state.clients];
    clients.splice(clients.indexOf(client), 1, client);

    if (client.checked) selectedClients++;
    else selectedClients--;

    this.setState({ clients, selectAll: false, selectedClients });
    if (selectedClients === 1) {
      this.selectedClient();
    }
  };

  toggleSelectAll = e => {
    let clients = [...this.state.clients];
    if (clients.length > 0) {
      let selectAll = this.state.selectAll === true ? false : true;
      clients.map(client => {
        client.checked = selectAll;
        return client;
      });
      this.setState({
        clients,
        selectAll,
        selectedClients: selectAll === true ? 2 : 0
      });
    }
    this.setState({ selectAll: false });
  };

  selectedClient = () => {
    let clients = [...this.state.clients];
    let client = clients.filter(client => {
      return client.checked;
    });
    if (client.length > 0)
      this.setState({
        clientId: client[0].id,
        name: client[0].name,
        year: client[0].year,
        country: client[0].country,
        address: client[0].address
      });
  };

  toggleCheckedClients = (clients, checked) => {
    clients.map(client => {
      client.checked = checked;
      return client;
    });
    return clients;
  };

  /* Button Functions */
  handleAdd = () => {
    const { name, year, country, address } = this.state;
    this.setState({ selectAll: false });
    if (!this.validateClientForm()) {
      const client = {
        name: name,
        year: year,
        country: country,
        address: address
      };
      saveClient(client).then(res => {
        saveLog({
          activity: `Created client ${client.name}`,
          user: getLoggedUser().id
        });
        getClients().then(data => {
          this.setState({ clients: data });
        });
      });
      this.resetClientForm();
      this.resetRowSelected();
      this.toggle();
    }
  };

  handleDelete = e => {
    let clients = [...this.state.clients];
    let message = "";
    clients = clients.filter(client => {
      return client.checked;
    });
    if (clients.length === 1)
      message = "Are you sure do you want to delete 1 client?";
    else if (clients.length > 1)
      message = `Are you sure do you want to delete ${clients.length} clients?`;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui text-center">
            <h2>Delete</h2>
            <p>{message}</p>
            <button className="btn btn-primary mr-1" onClick={onClose}>
              No
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.handleDeleteClients(clients);
                this.setState({ selectAll: false, selectedClients: 0 });
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        );
      }
    });
  };

  handleDeleteClients = clients => {
    if (clients.length === 1)
      this.handleDeleteClient(clients[0].id, clients[0].name);
    else {
      for (var i = 0, len = clients.length; i < len; i++) {
        this.handleDeleteClient(clients[i].id, clients[i].name);
      }
    }
  };

  handleDeleteClient = (clientId, logText) => {
    deleteClient(clientId).then(res => {
      saveLog({
        activity: `Deleted client ${logText}`,
        user: getLoggedUser().id
      });
      getClients().then(clients => {
        this.setState({
          clients: this.toggleCheckedClients(clients, false)
        });
      });
    });
  };

  handleEdit = () => {
    const { clientId, name, year, country, address } = this.state;
    if (!this.validateClientForm()) {
      const client = {
        id: clientId,
        name: name,
        year: year,
        country: country,
        address: address
      };
      updateClient(client).then(res => {
        getClients().then(clients => {
          this.setState({
            clients: this.toggleCheckedClients(clients, false)
          });
        });
      });
      
      this.resetClientForm();
      this.resetRowSelected();
      this.toggle();
    }
  };

  handleFilter = () => {
    getClients().then(clients => {
      clients = clients.filter(client => {
        return client.name.includes(this.state.name);
      });

      if (this.state.country !== 0) {
        clients = clients.filter(client => {
          return client.country === parseInt(this.state.country);
        });
      }
      // Year
      if (this.state.yearTo !== "" && parseInt(this.state.yearFrom) !== 0) {
        // yearFrom = full
        if (this.state.yearTo !== "" && parseInt(this.state.yearTo) !== 0) {
          // yearFrom = full, yearTo = full
          clients = clients.filter(client => {
            return (
              client.year >= this.state.yearFrom &&
              client.year <= this.state.yearTo
            );
          });
        } else {
          // yearFrom = full, yearTo = empty
          clients = clients.filter(client => {
            return client.year >= this.state.yearFrom;
          });
        }
      } else {
        // yearFrom = empty
        if (this.state.yearTo !== "" && parseInt(this.state.yearTo) !== 0) {
          // yearFrom = empty, yearTo = full
          clients = clients.filter(client => {
            return client.year <= this.state.yearTo;
          });
        }
      }
      // projects
      if (
        this.state.projectsTo !== "" &&
        parseInt(this.state.projectsFrom) !== 0
      ) {
        // projectsFrom = full
        if (
          this.state.projectsTo !== "" &&
          parseInt(this.state.projectsTo) !== 0
        ) {
          // projectsFrom = full, projectsTo = full
          clients = clients.filter(client => {
            return (
              client.no_of_projects >= this.state.projectsFrom &&
              client.no_of_projects <= this.state.projectsTo
            );
          });
        } else {
          // projectsFrom = full, projectsTo = empty
          clients = clients.filter(client => {
            return client.projects >= this.state.projectsFrom;
          });
        }
      } else {
        // projectsFrom = empty
        if (
          this.state.projectsTo !== "" &&
          parseInt(this.state.projectsTo) !== 0
        ) {
          // projectsFrom = empty, projectsTo = full
          clients = clients.filter(client => {
            return client.projects <= this.state.projectsTo;
          });
        }
      }
      this.setState({ clients });
      this.toggle();
    });
  };

  handleRemoveFilter = () => {
    this.getClients();
    this.setState({
      name: "",
      country: 0,
      yearFrom: 0,
      yearTo: 0,
      projectsFrom: 0,
      projectsTo: 0
    });
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleConfirm = e => {
    e.preventDefault();
    if (this.state.formToLoad === 1) {
      if (this.state.clientId === 0) this.handleAdd();
      else this.handleEdit();
    } else if (this.state.formToLoad === 2) {
      this.handleFilter();
    }
  };

  handleExport = e => {
    e.preventDefault();
    var element = document.createElement("a");
    var div = document.getElementById("btnDownload");
    let data = this.generateXMLData(this.state.clients);

    element.setAttribute("href", "data:text/xml;charset=utf-8," + data);
    element.setAttribute("download", "data.xml");

    element.style.display = "none";
    div.appendChild(element);

    element.click();

    div.removeChild(element);
  };

  handleRefresh = () => {
    getClients().then(clients => {
      this.setState({
        clients: this.toggleCheckedClients(clients, false),
        selectedClients: 0
      });
    });
  };

  /* Functions */
  resetClientForm = () => {
    this.setState({ clientId: 0, name: "", year: "", country: 0, address: "" });
  };

  resetRowSelected = () => {
    this.setState({ selectAll: false, selectedClients: 0 });
  };

  validateClientForm = () => {
    if (
      this.state.name === "" ||
      this.state.year === "" ||
      this.state.country === "" ||
      this.state.address === ""
    )
      return true;
    else return false;
  };

  setFormToLoad = num => {
    this.setState({ formToLoad: num });
  };

  getCountryName = id => {
    const { countries } = this.state;
    let countryName = "";
    countries.forEach(country => {
      if (country.id === id) countryName = country.name;
    });
    return countryName;
  };

  generateXMLData = clients => {
    var xml = '<?xml version="1.0" encoding="iso-8859-1"?><objectlist>';
    clients.forEach(obj => {
      xml += `<object pk="${obj.id}">`;
      xml += `<field name="id">${obj.id}</field>`;
      xml += `<field name="name">${obj.name}</field>`;
      xml += `<field name="year">${obj.year}</field>`;
      xml += `<field name="country">${obj.country}</field>`;
      xml += `<field name="address">${obj.address}</field>`;
      xml += "</object>";
    });
    xml += "</objectlist>";
    return xml;
  };

  toggle() {
    this.setState( {
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    getCountries().then(countries => {
      getClients().then(clients => {
        this.setState({
          countries,
          clients: this.toggleCheckedClients(clients, false)
        });
      });
    });
  }

  render() {
    const {
      formToLoad,
      modalTitle,
      countries,
      name,
      year,
      country,
      address,
      selectedClients,
      yearFrom,
      yearTo,
      projectsFrom,
      projectsTo
    } = this.state;
    return (
      <div>
        <div className="bnt-actions text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleRefresh}
          >
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => {
              this.handleChange(e);
              this.setFormToLoad(1);
              this.resetClientForm();
              this.toggle();
            }}
            name="modalTitle"
            value="Add"
          >
            Add new
          </button>
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => {
              this.handleChange(e);
              this.setFormToLoad(2);
              this.toggle();
            }}
            disabled={this.state.selectedClients >= 1 ? true : false}
            name="modalTitle"
            value="Filter"
            
          >
            Filter
          </button>
          
          <button
            id="btnDelete"
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => this.handleDelete(e)}
            disabled={this.state.selectedClients === 0 ? true : false}
          >
            Delete
          </button>
          {/* <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => this.handleExport(e)}
          >
            Export
          </button> */}
          <button
            type="button"
            className="btn btn-primary ml-4"
            onClick={e => {
              this.handleChange(e);
              this.setFormToLoad(1);
              this.toggle();
            }}
            disabled={selectedClients !== 1 ? true : false}
            name="modalTitle"
            value="Edit"
          >
            Edit
          </button>
        </div>
        <div className="table-content">
          <div className="table-header">
            <span>Clients</span>
            <hr />
          </div>
          <ClientsTable
            getCountryName={this.getCountryName}
            data={this.state.clients}
            toggleRow={this.toggleRow}
            toggleSelectAll={this.toggleSelectAll}
          />
        </div>
        <div className="content-footer" >
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
              <ModalBody>
                {formToLoad === 1 && (
                  <ClientForm
                    countries={countries}
                    name={name}
                    year={year}
                    country={country}
                    address={address}
                    handleConfirm={this.handleConfirm}
                    handleChange={this.handleChange}
                    toggle={this.toggle}
                  />
                )}
                {formToLoad === 2 && (
                  <ClientsFilter
                    countries={countries}
                    name={name}
                    year={year}
                    yearFrom={yearFrom}
                    yearTo={yearTo}
                    projectsFrom={projectsFrom}
                    projectsTo={projectsTo}
                    handleConfirm={this.handleConfirm}
                    handleChange={this.handleChange}
                    setFormToLoad={this.setFormToLoad}
                    toggle={this.toggle}
                  />
                )}
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div id="btnDownload" />
      </div>
    );
  }
}
