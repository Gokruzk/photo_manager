import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const countryAPI = axios.create({
  baseURL: API_URL,
});

//get countries
export const getCountries = async () => {
  try {
    const res = await countryAPI.get("/country");
    if (res.data["status_code"] != 400) {
      return { status: 200, data: res.data.result };
    } else {
      return { status: 400, error: "Error retreiving data" };
    }
  } catch (error) {
    console.log(error);
  }
  return { status: 400, error: "Error retreiving data" };
};

//get country
export const getCountry = async (id: number) => {
  try {
    const res = await countryAPI.get(`/country/${id}`);
    if (res.data["status_code"] != 400) {
      return { status: 200, data: res.data.result };
    } else {
      return { status: 400, error: "The country does not existe" };
    }
  } catch (error) {
    console.log(error);
  }
  return { status: 400, error: "The country does not exist" };
};
