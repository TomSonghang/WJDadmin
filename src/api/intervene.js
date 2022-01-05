import $axios from "./index";

export function GetPlatformInList(data) {
  //平台介入列表
  let url = "/api/ApiManage/GetPlatformInList";
  return $axios.get(url, data);
}

export function GetPlatformInProcessingList(data) {
  //平台介入处理列表
  let url = "/api/ApiManage/GetPlatformInProcessingList";
  return $axios.get(url, data);
}

export function PlatformInProcessing(data, config) {
  //平台介入处理
  let url = "/api/ApiManage/PlatformInProcessing";
  return $axios.post(url, data, config);
}

export function UploadFiles(data, config) {
  //图片上传
  let url = "/api/ApiManage/UploadFile";
  return $axios.post(url, data, config);
}
