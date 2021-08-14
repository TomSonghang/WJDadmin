import $axios from "./index";

export function GetProductList(data) {
  //获取产品列表
  let url = "/api/ApiManage/GetProductList";
  return $axios.get(url, data);
}

export function GetProductDispose(data) {
  //产品处理记录
  let url = "/api/ApiManage/GetProductDispose";
  return $axios.get(url, data);
}
