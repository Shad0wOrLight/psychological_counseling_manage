//存储用户信息
export const saveUserInfo = (user) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

//获取用户信息
export const getUserInfo = () => JSON.parse(sessionStorage.getItem("user"));

//用户注销
export const userLogout = () => {
  sessionStorage.clear();
};

export const setCookie = ({ username, password }) => {
  let date = new Date();
  date.setDate(date.getDate() + 7);
  document.cookie = `username=${username};expires=${date}`;
  document.cookie = `password=${password};expires=${date}`;
};

export const getCookie = (name) => {
  let cookie = document.cookie;
  let res = {};
  if (cookie) {
    cookie.split("; ").forEach((item) => {
      let arr = item.split("=");
      res[`${arr[0]}`] = arr[1];
    });
  }
  return res[name] == 0 ? "" : res[name];
};

export const removeCookie = () => {
  document.cookie = `username=0;expires=-1`;
  document.cookie = `password=0;expires=-1`;
};
