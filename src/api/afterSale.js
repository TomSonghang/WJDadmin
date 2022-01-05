import $axios from "./index";

export function GetAfterSaleList(data) {
  //退换/售后管理
  let url = "/api/ApiManage/GetAfterSaleList";
  return $axios.get(url, data);
}

export function GetAfterSaleDetails(data) {
  //售后详情
  let url = "/api/ApiManage/GetAfterSaleDetails";
  return $axios.get(url, data);
}

export function CompleteRefund(data) {
  //完成退款
  let url = "/api/ApiManage/CompleteRefund";
  return $axios.post(url, data);
}
