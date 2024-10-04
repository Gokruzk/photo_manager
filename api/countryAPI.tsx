import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const countryAPI = axios.create({
  baseURL: API_URL,
});

//get countries
export const getCountries = async () => {
  try {
    const res = await countryAPI.get("/country");
    if (res.status === 200) {
      return { status: res.status, data: res.data.result };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 400, error: error.response.data.detail };
  }
};
