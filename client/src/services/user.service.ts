import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  // field name must be "resume" (matches upload.single("resume") on the backend)
  formData.append("resume", file);

  const response = await api.post("/users/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete("/users/resume");

  return response.data;
};