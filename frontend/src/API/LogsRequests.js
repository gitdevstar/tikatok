import axios from "axios";
import * as constants from "./constants";
/* Main logs */
export function getLogs() {
  return axios
    .get(`${constants.baseURL}api/main/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function saveLog(log) {
  return axios
    .post(`${constants.baseURL}api/main/`, log)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function updateLog(log) {
  return axios
    .patch(`${constants.baseURL}api/main/${log.id}/`, log)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function deleteLog(logId) {
  return axios
    .delete(`${constants.baseURL}api/main/${logId}/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}
