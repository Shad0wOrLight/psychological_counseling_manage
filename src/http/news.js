import http from "@/http";

export const getNewsList = (pageNo = 1, pageSize = 5) =>
  http.get(`/news/all?pageNo=${pageNo}&pageSize=${pageSize}`);

export const getNewsListByCondition = (data = {}) =>
  http.post("/news/find", data);

export const updateNews = (data) => http.post("/news/update", data);

export const findNewsByKeyword = (keyword) =>
  http.get(`/news/findByKeyword?keyword=${keyword}`);

export const addNews = (data) => http.post("/news/add", data);

export const delNews = (id) => http.get(`/news/delete?newsId=${id}`);
