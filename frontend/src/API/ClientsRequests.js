import axios from "axios";
import * as constants from "./constants";

export function getAdminDashboardClientCurrentData(pagenum, page_limit) {
  return axios 
    .get(`${constants.baseURL}api/users/admin-dashboard-client?page=${pagenum}&limit=${page_limit}`)
    .then( res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getDashboardData() {
  return axios
    .get(`${constants.baseURL}api/users/admin-dashboard`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getClients() {
  return axios
    .get(`${constants.baseURL}api/clients/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function saveClient(client) {
  return axios
    .post(`${constants.baseURL}api/clients/`, client)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function updateClient(client) {
  return axios
    .put(`${constants.baseURL}api/clients/${client.id}/`, client)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function deleteClient(clientId) {
  return axios
    .delete(`${constants.baseURL}api/clients/${clientId}/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}
