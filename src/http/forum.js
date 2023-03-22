import http from "@/http";

export const getArticleList = (pageNo = 1, pageSize = 5) =>
  http.get(`/article/all?pageNo=${pageNo}&pageSize=${pageSize}`);

export const getArticleByCondition = (data = {}) =>
  http.post("/article/find", data);

export const addArticle = (data) => http.post("/article/add", data);

export const delArticle = (id) => http.get(`/article/delete?articleId=${id}`);

export const updateArticle = (data) => http.post("/article/update", data);

// 评论
export const getCommentList = (pageNo = 1, pageSize = 5) =>
  http.get(`/comment/all?pageNo=${pageNo}&pageSize=${pageSize}`);

export const delComment = (id) => http.get(`/comment/delete?commentId=${id}`);

export const findCommentByContent = (content) =>
  http.get(`/comment/findByContent?content=${content}`);
