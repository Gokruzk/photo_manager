import { ApiPromiseImages, ImagesD } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const imageAPI = axios.create({
  baseURL: API_URL,
});

export const uploadImage = async (formdata: FormData): Promise<ApiPromiseImages> => {
  try {
    const res = await imageAPI.post("/images", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 201) {
      return { status: 200, data: res.data.result };
    } else {
      return { status: res.status, error: "Error while uploading image" };
    }
  } catch (error) {
    console.error("Error while uploading image", error);
    return { status: 401, error: "Error while uploading image" };
  }
};

export const getUserImages = async (username: string): Promise<ApiPromiseImages> => {
  try {
    const res = await imageAPI.get(`/images/${username}`);
    if (res.data.status_code != 404) {
      return { status: 200, data: res.data.result };
    } else {
      return { status: 400, error: "The user does not exist" };
    }
  } catch (error) {
    console.log(error);
    return { status: 400, error: "The user does not exist" };
  }
};

// export const deleteUserImage = async (data: ImagesD): Promise<ApiPromise> => {

//   try {
//     const res = await imageAPI.delete(`/images`, data);
//     if (res.data.status_code != 404) {
//       return { status: 200, data: res.data.result };
//     } else {
//       return { status: 400, error: "The user does not exist" };
//     }
//   } catch (error) {
//     console.log(error);
//     return { status: 400, error: "The user does not exist" };
//   }
// };