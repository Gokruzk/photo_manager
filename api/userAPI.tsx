import { User } from "@/types";
import axios from "axios";

const userAPI = axios.create({
  baseURL: "http://localhost:8888",
});

//get users

export const getUsers = async () => {
  const res = await userAPI.get("/user");
  return res.data;
};

export const addUser = async (user: User) => {
  userAPI.post("/user", user);
};
