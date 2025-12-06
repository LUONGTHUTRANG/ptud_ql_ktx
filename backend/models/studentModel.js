import db from "../config/db.js";

const Student = {
  getAll: async (limit = 20, offset = 0) => {
    const [rows] = await db.query("SELECT * FROM students LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  },

  countAll: async () => {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM students");
    return rows[0].count;
  },

  getByRoomId: async (roomId) => {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE current_room_id = ?",
      [roomId]
    );
    return rows;
  },

  getByBuildingId: async (buildingId) => {
    const [rows] = await db.query(
      `
      SELECT s.* 
      FROM students s
      JOIN rooms r ON s.current_room_id = r.id
      WHERE r.building_id = ?
    `,
      [buildingId]
    );
    return rows;
  },
};

export default Student;
