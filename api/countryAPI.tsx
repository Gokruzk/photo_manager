import axios from "axios";

const countryAPI = axios.create({
  baseURL: "http://localhost:8888",
});

//get countries
export const getCountries = async () => {
  const res = await countryAPI.get("/country");
  return res.data.result;
};
