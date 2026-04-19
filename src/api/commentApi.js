import API from "./axios";

export const getComments = (problemId) =>
  API.get(`/comments/${problemId}`);

export const addComment = (problemId, data) =>
  API.post(`/comments/${problemId}`, data);

export const updateComment = (commentId, data) =>
  API.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);