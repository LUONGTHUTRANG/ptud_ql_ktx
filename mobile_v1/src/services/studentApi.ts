import api from "./api";

export const studentApi = {
  getAllStudents: async (page = 1, limit = 20) => {
    const response = await api.get(`/students?page=${page}&limit=${limit}`);
    return response.data;
  },
  getStudentsByRoom: async (roomId: string) => {
    const response = await api.get(`/students/room/${roomId}`);
    return response.data;
  },
  getStudentsByBuilding: async (buildingId: string) => {
    const response = await api.get(`/students/building/${buildingId}`);
    return response.data;
  },
};

export const putAssignRoom = async (studentId: string, roomId: string) => {
  const response = await api.put(`/students/${studentId}/assign-room`, {
    room_id: roomId,
  });
  return response.data;
};
