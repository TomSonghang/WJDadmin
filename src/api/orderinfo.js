import $axios from "./index";

export function GetOrderList(data) {
  //订单列表
  let url = "/api/ApiManage/GetOrderList";
  return $axios.get(url, data);
}

export function GetOrderDetails(data) {
  //订单详情
  let url = "/api/ApiManage/GetOrderDetails";
  return $axios.get(url, data);
}

export function GetOrderLog(data) {
  //获取订单日志
  let url = "/api/ApiManage/GetOrderLog";
  return $axios.get(url, data);
}

export function GetShopping(data) {
  //获取订单清单
  let url = "/api/ApiManage/GetShopping";
  return $axios.get(url, data);
}
