import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const countryAPI = axios.create({
  baseURL: API_URL,
});

//get countries
export const getCountries = async () => {
  const res = await countryAPI.get("/country");
  return res.data.result;
};
