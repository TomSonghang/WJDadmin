import $axios from "./index";

export function GetHomePage() {
  const url = "/api/ApiManage/GetHomePage";
  return $axios.get(url);
}
