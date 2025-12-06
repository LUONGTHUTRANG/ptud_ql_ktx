import db from "../config/db.js";

const Invoice = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM invoices");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM invoices WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      invoice_code,
      type,
      semester_id,
      room_id,
      student_id,
      amount,
      description,
      status,
      due_date,
      paid_at,
      paid_by_student_id,
      created_by_manager_id,
    } = data;
    const [result] = await db.query(
      "INSERT INTO invoices (invoice_code, type, semester_id, room_id, student_id, amount, description, status, due_date, paid_at, paid_by_student_id, created_by_manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        invoice_code,
        type,
        semester_id,
        room_id,
        student_id,
        amount,
        description,
        status,
        due_date,
        paid_at,
        paid_by_student_id,
        created_by_manager_id,
      ]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const {
      invoice_code,
      type,
      semester_id,
      room_id,
      student_id,
      amount,
      description,
      status,
      due_date,
      paid_at,
      paid_by_student_id,
      created_by_manager_id,
    } = data;
    await db.query(
      "UPDATE invoices SET invoice_code = ?, type = ?, semester_id = ?, room_id = ?, student_id = ?, amount = ?, description = ?, status = ?, due_date = ?, paid_at = ?, paid_by_student_id = ?, created_by_manager_id = ? WHERE id = ?",
      [
        invoice_code,
        type,
        semester_id,
        room_id,
        student_id,
        amount,
        description,
        status,
        due_date,
        paid_at,
        paid_by_student_id,
        created_by_manager_id,
        id,
      ]
    );
    return { id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM invoices WHERE id = ?", [id]);
    return { id };
  },
};

export default Invoice;
