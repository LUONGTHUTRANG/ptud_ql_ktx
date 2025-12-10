import api from "./api";

export const createSupportRequest = async (formData: FormData) => {
  try {
    const response = await api.post("/support-requests", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating support request:", error);
    throw error;
  }
};

export const getSupportRequests = async (params?: any) => {
  try {
    const response = await api.get("/support-requests", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching support requests:", error);
    throw error;
  }
};

export const getSupportRequestById = async (id: string) => {
  try {
    const response = await api.get(`/support-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching support request detail:", error);
    throw error;
  }
};
