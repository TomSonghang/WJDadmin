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

export function DelProduct(data) {
  //删除产品
  let url = "/api/ApiManage/DelProduct";
  return $axios.post(url, data);
}

export function GetProductAttachmentByProductId(data) {
  //获取产品图片
  let url = "/api/ApiManage/GetProductAttachmentByProductId";
  return $axios.get(url, data);
}
