import $axios from "./index";

export function GetProductCollectList(data) {
  let url = "/api/ApiManage/GetProductCollectList";
  return $axios.get(url, data);
}
