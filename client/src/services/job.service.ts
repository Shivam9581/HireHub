import api from "./api";

export const getJobs = async () => {
  const response = await api.get("/jobs");

  return response.data;
};


export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
};


export interface CreateJobData {
  title : string;
  company : string;
  description : string;
  location : string;
  salary?: number;
  skills: string[];
  jobType: "Full-time" | "Part-time" | "Internship";
  experience: string;
}

export const createJob = async (data : CreateJobData) => {
  const response = await api.post("/jobs", data);

  return response.data;
}

export const getMyJobs = async() => {
  const response = api.get("/jobs/my");
  return (await response).data;
}

export const updateJob = async (
  id: string,
  data: CreateJobData
) => {
  const response = await api.put(
    `/jobs/${id}`,
    data
  );

  return response.data;
};


export const deleteJob = async (id: string) => {
  const response = await api.delete(`/jobs/${id}`);

  return response.data;
};