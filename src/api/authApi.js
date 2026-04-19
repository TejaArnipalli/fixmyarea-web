import API from "./axios";


export const registerUser = (data) =>
    API.post("/users/register", data);

export const sendOtp = (data) =>
    API.post("/otp/send", data);

export const verifyOtp = (data) =>
    API.post("/otp/verify", data);

export const loginUser = (data) =>
    API.post("/users/login", data);