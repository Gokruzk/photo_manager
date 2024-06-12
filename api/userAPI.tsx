import { User } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userAPI = axios.create({
  baseURL: API_URL,
});

//get users

export const getUsers = async () => {
  const res = await userAPI.get("/user");
  return res.data;
};

export const addUser = async (user: User) => {
  userAPI.post("/user", user);
};
