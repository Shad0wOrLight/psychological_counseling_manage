export const formatRole = (role) => {
  return role == 0 ? "普通用户" : role == 1 ? "咨询师" : "管理员";
};

export const formatIsHot = (list) => {
  list.forEach((item) => {
    item.isHot = !!item.isHot;
  });
  return list;
};
