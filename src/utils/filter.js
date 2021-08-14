let Pinkage = (value) => {
  //是否包邮
  if (value != "" || value != null) {
    switch (value) {
      case 1:
        return "包邮";
      case 0:
        return "不包邮";
      default:
        return "不包邮";
    }
  }
};

let Putaway = (value) => {
  //是否上架
  if (value != "" || value != null) {
    switch (value) {
      case 0:
        return "下架";
      case 1:
        return "上架";
      case 2:
        return "系统下架";
      default:
        return "正常";
    }
  }
};

export { Pinkage, Putaway };
