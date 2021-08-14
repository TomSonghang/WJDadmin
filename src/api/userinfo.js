import $axios from "./index";

export function GetUserList(data) {
  //获取用户列表
  let url = "/api/ApiManage/GetUserList";
  return $axios.get(url, data);
}

export function PayAPI(data) {
  //发放服务
  let url = "/api/ApiManage/PayAPI";
  return $axios.post(url, data);
}

export function GetBlacklistDispose(data) {
  //获取处理记录
  let url = "/api/ApiManage/GetBlacklistDispose";
  return $axios.get(url, data);
}

export function BackstageDispose(data) {
  //处理黑名单用户
  let url = "/api/ApiManage/BackstageDispose";
  return $axios.post(url, data);
}

export function MyFans(data) {
  //粉丝
  let url = "/api/ApiManage/MyFans";
  return $axios.get(url, data);
}

export function MyCollectProduct(data) {
  //我收藏的产品
  let url = "/api/ApiManage/MyCollectProduct";
  return $axios.get(url, data);
}

export function MyAttention(data) {
  //我关注的
  let url = "/api/ApiManage/MyAttention";
  return $axios.get(url, data);
}
