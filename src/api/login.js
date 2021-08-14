import $axios from "./index";

export function login(data) {
  const url = "/login";
  return $axios.post(url, data);
}

export function getInfo() {
  const url = "/getInfo";
  return $axios.get(url);
}

export function GetAccess_token(data) {
  let url = "/api/ApiManage/GetAccess_token";
  return $axios.post(url, data);
}

export function GetSysMenu() {
  let url = "/api/ApiManage/GetSysMenu";
  return $axios.get(url);
}
