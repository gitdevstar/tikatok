import axios from "axios";
import * as constants from "./constants";

export function getCountries() {
  return axios
    .get(`${constants.baseURL}api/countries/`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}
