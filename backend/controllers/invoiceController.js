import Invoice from "../models/invoiceModel.js";

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.getAll();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.getById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.update(req.params.id, req.body);
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.delete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
