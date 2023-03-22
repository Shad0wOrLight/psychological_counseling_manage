import http from "@/http";

export const getEvaluationList = (pageNo = 1, pageSize = 5) =>
  http.get(`/questionnaire/all?pageNo=${pageNo}&pageSize=${pageSize}`);

export const getEvaluationByCondition = (data = {}) =>
  http.post("/questionnaire/find", data);

export const updateEvaluation = (data) =>
  http.post("/questionnaire/update", data);

export const addEvaluation = (data) => http.post("/questionnaire/add", data);

export const delEvaluation = (id) =>
  http.get(`/questionnaire/delete?questionnaireId=${id}`);

// 题目
export const getTopicList = (pageNo = 1, pageSize = 5, questionnaireId) =>
  http.get(
    `/topic/all?pageNo=${pageNo}&pageSize=${pageSize}&questionnaireId=${questionnaireId}`
  );

export const getTopic = (topicName) =>
  http.get(`/topic/find?topicName=${topicName}`);
export const updateTopic = (data) => http.post("/topic/update", data);

export const addTopic = (data) => http.post("/topic/add", data);

export const delTopic = (id) => http.get(`/topic/delete?topicId=${id}`);


export const getAnswer = (id) => http.get(`/answer/find?answerId=${id}`);

export const addTestRecord = (data) => http.post("/testRecord/add", data);

export const getTestRecord = (id) => http.get(`/testRecord/find?userId=${id}`);
