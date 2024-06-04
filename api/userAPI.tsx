import axios from "axios"

const userAPI = axios.create({
  baseURL: "http://localhost:8888",
});

//get users

export const getUsers = async () =>{
    const res = await userAPI.get("/user")
    return res.data
}