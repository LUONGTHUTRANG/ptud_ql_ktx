import db from "../config/db.js";

const Semester = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM semesters");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM semesters WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      name,
      start_date,
      end_date,
      registration_open_date,
      registration_close_date,
      renewal_open_date,
      renewal_close_date,
      is_active,
    } = data;
    const [result] = await db.query(
      "INSERT INTO semesters (name, start_date, end_date, registration_open_date, registration_close_date, renewal_open_date, renewal_close_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        start_date,
        end_date,
        registration_open_date,
        registration_close_date,
        renewal_open_date,
        renewal_close_date,
        is_active,
      ]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const {
      name,
      start_date,
      end_date,
      registration_open_date,
      registration_close_date,
      renewal_open_date,
      renewal_close_date,
      is_active,
    } = data;
    await db.query(
      "UPDATE semesters SET name = ?, start_date = ?, end_date = ?, registration_open_date = ?, registration_close_date = ?, renewal_open_date = ?, renewal_close_date = ?, is_active = ? WHERE id = ?",
      [
        name,
        start_date,
        end_date,
        registration_open_date,
        registration_close_date,
        renewal_open_date,
        renewal_close_date,
        is_active,
        id,
      ]
    );
    return { id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM semesters WHERE id = ?", [id]);
    return { id };
  },
};

export default Semester;
