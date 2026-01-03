import api from "./api";

export const createRegistration = async (formData: FormData) => {
  const response = await api.post("/registrations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get("/registrations/my-registrations");
  return response.data;
};

export const getManagerRegistrations = async (type: "NORMAL" | "PRIORITY") => {
  const response = await api.get(`/registrations/manager`, {
    params: { type },
  });
  return response.data;
};
export const getAllPriorityRegistrations = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/registrations/priority", { params });
  return response.data;
};

export const getRegistrationById = async (id: string) => {
  const response = await api.get(`/registrations/${id}`);
  return response.data;
};

export const updateRegistrationStatus = async (
  id: string,
  status: string,
  admin_note: string
) => {
  const response = await api.put(`/registrations/${id}/status`, {
    status,
    admin_note,
  });
  return response.data;
};
