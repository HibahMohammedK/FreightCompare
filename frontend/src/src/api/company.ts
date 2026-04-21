import API from "./axios";

export const getCompanies = (
  search?: string
) => {

  return API.get("/companies/", {
    params: {
      search
    }
  });

};

export const createCompany = (data: {
  name: string;
  website: string;
}) => {

  return API.post(
    "/companies/",
    data
  );

};

export const updateCompany = (
  id: number,
  data: {
    name: string;
    website: string;
  }

) => {

  return API.patch(
    `/companies/${id}/`,
    data
  );

};

export const deleteCompany = (
  id: number
) => {

  return API.delete(
    `/companies/${id}/`
  );

};

export const getCompaniesByUrl = (
 url: string
) => {
 return API.get(url);
};