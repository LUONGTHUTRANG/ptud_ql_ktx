import api from "./api";

export const managerApi = {
  getDashboardStats: async () => {
    const response = await api.get("/managers/dashboard/stats");
    return response.data;
  },

  getStaff: async () => {
    const response = await api.get("/managers/");
    return response.data;
  },

  updateStaff: async (id: number, data: any) => {
    const response = await api.put(`/managers/${id}`, data);
    return response.data;
  },

  addManager: async (data: any) => {
    const response = await api.post("/managers/", data);
    return response.data;
  },

  deleteStaff: async (id: number) => {
    const response = await api.delete(`/managers/${id}`);
    return response.data;
  },
};
