import API from "./axios";

export const getTopProblems = () => API.get("/problems/top");

export const getProblemsByPincode = (pincode) =>
  API.get(`/problems?pincode=${pincode}`);

export const getProblemById = (id) =>
  API.get(`/problems/${id}`);