import $axios from "./index";

export function GetFeedBack(data) {
  let url = "/api/ApiManage/GetFeedBack";
  return $axios.get(url, data);
}

export function DisposeFeedBack(data) {
  let url = "/api/ApiManage/DisposeFeedBack";
  return $axios.post(url, data);
}

export function GetFeedBackDispose(data) {
  let url = "/api/ApiManage/GetFeedBackDispose";
  return $axios.get(url, data);
}
