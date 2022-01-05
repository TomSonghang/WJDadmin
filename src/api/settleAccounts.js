import $axios from "./index";

export function GetSettleBillManage(data) {
  //结算单管理
  let url = "/api/ApiManage/GetSettleBillManage";
  return $axios.get(url, data);
}

export function GetSettleBillManageDetail(data) {
  //结算单详情
  let url = "/api/ApiManage/GetSettleBillManageDetail";
  return $axios.get(url, data);
}

export function SupplierSettleBill(data) {
  //结算修改
  let url = "/api/ApiManage/SupplierSettleBill";
  return $axios.post(url, data);
}
