import axios from "axios";
import * as constants from "./constants";

export function getTasks() {
  return axios
    .get(`${constants.baseURL}api/tasks/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function saveTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function updateTask(task) {
  return axios
    .patch(`${constants.baseURL}api/tasks/${task.id}/`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function deleteTask(projectId) {
  return axios
    .delete(`${constants.baseURL}api/tasks/${projectId}/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function assignTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/assign-task`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function unAssignUser(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/unassign-user`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function resetTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/reset-task`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getUserTasks(user) {
  // Return tasks per user(manager or user)
  return axios
    .post(`${constants.baseURL}api/tasks/get-all`, user)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function relinquishTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/relinquish-task`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function completeTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/complete-task`, {taskids: task})
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/get-task`, task)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}

export function convertToText(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/url-to-text`, task)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function SaveDataTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/save-data`, task)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}

export function SaveImgDataTask(task) {
  return axios
    .post(`${constants.baseURL}api/tasks/save-img-data`, task)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}

export function resetTextResult(taskId, currentItem) {
  return axios
    .post(`${constants.baseURL}api/tasks/resetText/`, {"id": taskId, 'item': currentItem})
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}

export function resetImageResult(taskId, currentImage) {
  return axios 
    .post(`${constants.baseURL}api/tasks/resetImage/`, {"id": taskId, 'item': currentImage})
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
  }
export function rejectTask(taskId) {
  return axios
    .post(`${constants.baseURL}api/tasks/reject/`, {"taskid": taskId})
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}

export function deliveryTasks(taskids) {
  return axios
    .post(`${constants.baseURL}api/tasks/delivery/`, taskids)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}

export function unassignManager(taskids) {
  return axios 
    .post(`${constants.baseURL}api/tasks/unassign-manager`, taskids)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
}