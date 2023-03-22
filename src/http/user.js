import http from "./index";

// 用户登录
export const userLogin = (data) => http.post("/user/login", data);

//分页获取用户列表
export const getUserList = (pageNo, pageSize) =>
  http.get(`/user/all?pageNo=${pageNo}&pageSize=${pageSize}`);

export const updateUser = (data) => http.post("/user/update", data);

export const delUser = (id) => http.get(`/user/delete?userId=${id}`);

export const addUser = (data) => http.post("/user/add", data);

export const findUserList = (data) => http.post("/user/find", data);
