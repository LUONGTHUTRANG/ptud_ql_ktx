import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to get base URL from api instance
const getBaseUrl = () => {
  return api.defaults.baseURL;
};

export const notificationApi = {
  getMyNotifications: async () => {
    const response = await api.get("/notifications/my");
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data.count || 0;
  },
  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  getManagerSentNotifications: async () => {
    const response = await api.get("/notifications/sent");
    return response.data;
  },
  getNotificationById: async (id: string) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
  createNotification: async (formData: FormData) => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${getBaseUrl()}/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type here, let fetch handle it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create notification");
    }

    return response.json();
  },
  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
