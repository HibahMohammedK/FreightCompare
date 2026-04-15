import API from "./axios";

// GET companies
export const getCompanies = () => {
  return API.get("/companies/");
};