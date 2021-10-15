import axios from "axios";
import * as constants from "./constants";

export function getProjects() {
  return axios
    // .get(`${constants.baseURL}api/projects/`)
    .get(`${constants.baseURL}api/projects/get-project`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function saveProject(project) {
  return axios
    .post(`${constants.baseURL}api/projects/`, project, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function updateProject(project, projectId) {
  return axios
    .put(`${constants.baseURL}api/projects/${projectId}/`, project, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function deleteProject(projectId) {
  return axios
    .post(`${constants.baseURL}api/projects/multiDelete/`, {projectIds: projectId})
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}
export function exportProject(projectName, projectId, withData) {
  let dateformat = new Date();
  let date = dateformat.getFullYear()+dateformat.getMonth()+dateformat.getDay();
  date = date + dateformat.getTime();
  
  fetch(`${constants.baseURL}api/projects/exportProject?prjid=${projectId}&withdata=${withData}`)
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", projectName + '_' + date + '.zip');

    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  });
}
