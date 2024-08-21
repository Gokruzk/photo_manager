import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const imageAPI = axios.create({
  baseURL: API_URL,
});

export const uploadImage = async (formdata: FormData) => {
  try {
    const res = await imageAPI.post("/images", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 201) {
      return { status: 200, filename: res.data.result };
    } else {
      return { status: res.status, error: "Error while uploading image" };
    }
  } catch (error) {
    console.error("Error while uploading image", error);
    return { status: 401, error: "Error while uploading image" };
  }
};
