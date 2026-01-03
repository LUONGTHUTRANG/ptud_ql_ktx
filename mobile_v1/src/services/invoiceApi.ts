import api from "./api";

export const fetchInvoices = async (studentId?: string) => {
  try {
    const url = studentId ? `/invoices?student_id=${studentId}` : "/invoices";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceDetail = async (id: string) => {
  try {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice detail:", error);
    throw error;
  }
};

// Get invoices for manager's building
export const fetchManagerInvoices = async (
  type?: "room" | "utility",
  status?: "all" | "unpaid" | "paid" | "submitted"
) => {
  try {
    let url = "/invoices/manager/building";
    const params = [];

    if (type) params.push(`type=${type === "room" ? "room" : "utility"}`);
    if (status && status !== "all")
      params.push(`status=${status.toUpperCase()}`);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const response = await api.get(url);
    console.log("Manager Invoices Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching manager invoices:", error);
    throw error;
  }
};

// Format invoice data for display
export const formatInvoiceData = (invoice: any) => {
  return {
    id: invoice.id,
    invoice_code: invoice.invoice_code,
    room: `Phòng ${invoice.room_number}`,
    building: invoice.building_name,
    student_name: invoice.student_name,
    student_code: invoice.mssv,
    type: invoice.type,
    amount: invoice.amount,
    status: invoice.status,
    period: invoice.usage_month
      ? `Tháng ${invoice.usage_month}/${invoice.usage_year}`
      : null,
    time_invoiced: invoice.time_invoiced,
    due_date: invoice.due_date,
    paid_at: invoice.paid_at,
  };
};

export const updateInvoiceStatus = async (
  invoice_code: string,
  status: "PAID" | "UNPAID" | "SUBMITTED"
) => {
  try {
    const response = await api.put(`/invoices/${invoice_code}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
};

// Group invoices by month for utility bills
export const groupUtilityInvoicesByMonth = (invoices: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  invoices.forEach((invoice) => {
    const key = `${invoice.usage_month}/${invoice.usage_year}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(invoice);
  });

  return Object.entries(grouped).map(([period, invoiceList]) => {
    const paid = invoiceList.filter((i) => i.status === "PAID").length;
    const unpaid = invoiceList.filter((i) => i.status === "UNPAID").length;
    const submitted = invoiceList.filter((i) => i.status === "SUBMITTED").length;
    const paidAmount = invoiceList
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const unpaidAmount = invoiceList
      .filter((i) => i.status === "UNPAID")
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const submittedAmount = invoiceList
      .filter((i) => i.status === "SUBMITTED")
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);
    return {
      month: `Tháng ${period}`,
      count: `${invoiceList.length} hóa đơn`,
      collected:
        paidAmount > 0 ? `${paidAmount.toLocaleString("vi-VN")} đ` : null,
      pending:
        unpaidAmount > 0 ? `${unpaidAmount.toLocaleString("vi-VN")} đ` : null,
      closedDate: new Date().toLocaleDateString("vi-VN"),
      status: unpaid === 0 ? "completed" : "active",
      total: unpaid === 0 ? `${paidAmount.toLocaleString("vi-VN")} đ` : null,
      paidCount: paid,
      unpaidCount: unpaid,
      invoices: invoiceList,
    };
  });
};
