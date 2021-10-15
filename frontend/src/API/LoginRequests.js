import axios from "axios";
import * as constants from "./constants";

export function Login(user) {
  return axios
    .post(`${constants.baseURL}api/login/`, user)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}

export function getLoggedUser() {
  var user = JSON.parse(localStorage.getItem("user")) || {};
  return user;
}

export function setLoggedUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
