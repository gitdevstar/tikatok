import axios from "axios";
import * as constants from "./constants";

export function getUsers() {
  return axios
    .get(`${constants.baseURL}api/users/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function saveUser(user) {
  return axios
    .post(`${constants.baseURL}api/users/`, user)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function updateUser(user) {
  return axios
    .post(`${constants.baseURL}api/users/update/`, user)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function deleteUser(userId) {
  return axios
    .post(`${constants.baseURL}api/users/multiDelete/`, {userId: userId})
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getUserId(users) {
  let text = "usr";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let usersIds = users.map(user => {
    return user.user_id;
  });

  while (true) {
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    if (!usersIds.includes(text)) break;
  }
  return text;
}
