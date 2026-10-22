import api from "./api";

export const applyForJob = async (jobId: string) => {
  const response = await api.post("/applications", {
    jobId,
  });

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my");

  return response.data;
};

export const getApplicants = async (jobId : string) => {
  const response = await api.get(`jobs/${jobId}/applicants`);
  return response.data;
}

export const updateApplicationStatus = async (
  applicationId : string,
  status : "pending" | "accepted" | "rejected"
) => {
  const response = await api.patch(`/applications/${applicationId}/status`, {status});
  return response.data;
}