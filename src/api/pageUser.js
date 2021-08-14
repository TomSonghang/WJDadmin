import $axios from "./index";

export function GetUserManage(data) {
  //获取权限列表
  let url = "/api/ApiManage/GetUserManage";
  return $axios.get(url, data);
}

export function UpdateUserStatus(data) {
  //禁用启用
  let url = "/api/ApiManage/UpdateUserStatus";
  return $axios.post(url, data);
}

export function GetUserInfo(data) {
  //编辑新增账号
  let url = "/api/ApiManage/GetUserInfo";
  return $axios.get(url, data);
}

export function SaveUserInfo(data) {
  //保存账号信息
  let url = "/api/ApiManage/SaveUserInfo";
  return $axios.post(url, data);
}
