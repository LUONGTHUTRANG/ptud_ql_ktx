import api from "./api";

export const fetchBuildings = async () => {
  try {
    const response = await api.get("/buildings");
    return response.data;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
};
