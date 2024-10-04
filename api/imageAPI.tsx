import {
  ApiPromiseImages,
  ApiPromiseImagesD,
  ImagesD,
  UserImages,
} from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const imageAPI = axios.create({
  baseURL: API_URL,
});

// upload image
export const uploadImage = async (
  formdata: FormData
): Promise<ApiPromiseImages> => {
  try {
    const res = await imageAPI.post("/images", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 201) {
      return { status: res.status, data: res.data.result };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error: any) {
    console.error(error);
    return { status: 400, error: error.response.data.detail };
  }
};

// get user images
export const getUserImages = async (
  username: string
): Promise<ApiPromiseImages> => {
  try {
    const res = await imageAPI.get(`/images/${username}`);
    if (res.status === 200) {
      return { status: res.status, data: res.data.result };
    } else {
      return { status: 400, error: res.data.detail };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 400, error: error.response.data.detail };
  }
};

// delete image
export const deleteUserImage = async (
  data: ImagesD
): Promise<ApiPromiseImagesD> => {
  try {
    const res = await imageAPI.delete(`/images`, {
      params: {
        cod_user: data.cod_user,
        cod_image: data.cod_image,
      },
    });
    if ((res.status = 204)) {
      return { status: res.status };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 400, error: error.response.data.detail };
  }
};
