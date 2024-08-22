import { ApiPromiseImages, ApiPromiseImagesD, ImagesD, UserImages } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const imageAPI = axios.create({
  baseURL: API_URL,
});

// upload image
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

// get user images
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

// delete image
export const deleteUserImage = async (data: ImagesD): Promise<ApiPromiseImagesD> => {
  try {
    const res = await imageAPI.delete(`/images`, {
      params: {
        cod_user: data.cod_user,
        cod_image: data.cod_image,
      },
    });
    if (res.data.status_code != 404) {
      return { status: 200 };
    } else {
      return { status: 400, error: "The user does not exist" };
    }
  } catch (error) {
    console.log(error);
    return { status: 400, error: "The user does not exist" };
  }
};