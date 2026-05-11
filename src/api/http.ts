import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://cinemaguide.skillbox.cc",
  withCredentials: true,
});
