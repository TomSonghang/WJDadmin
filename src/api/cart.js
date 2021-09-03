import $axios from "./index";

export function GetProductCartList(data) {
  let url = "/api/ApiManage/GetProductCartList";
  return $axios.get(url, data);
}
