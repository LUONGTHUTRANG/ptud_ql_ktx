import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { fetchInvoices } from "../../../services/invoiceApi";
import { getMe } from "../../../services/authApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import moment from "moment";

type TransactionHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TransactionHistory"
>;

interface Props {
  navigation: TransactionHistoryScreenNavigationProp;
}

interface Transaction {
  id: string;
  type: "room" | "electricity" | "water" | "other";
  title: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "submitted" | "overdue";
  month: string;
  originalData: any;
}

const TransactionHistory = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<"all" | "this_month" | "type">("all");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getMe();
      const invoices = await fetchInvoices(user.id);

      const transactions: Transaction[] = invoices.map((item: any) => {
        let type: "room" | "electricity" | "water" | "other" = "other";
        let title = "Thanh toán hóa đơn";

        if (item.type === "ROOM_FEE") {
          type = "room";
          title = "Thanh toán tiền phòng";
        } else if (item.type === "UTILITY_FEE") {
          // Determine if it's electricity or water based on the invoice details
          if (item.invoice_code && item.invoice_code.includes("ELEC")) {
            type = "electricity";
            title = "Thanh toán tiền điện";
          } else if (item.invoice_code && item.invoice_code.includes("WATER")) {
            type = "water";
            title = "Thanh toán tiền nước";
          } else {
            type = "electricity";
            title = "Thanh toán tiền tiện ích";
          }
        } else {
          title = "Thanh toán khác";
        }

        let status: "paid" | "pending" | "submitted" | "overdue" = "pending";
        if (item.status === "PAID") {
          status = "paid";
        } else if (item.status === "SUBMITTED") {
          status = "submitted";
        } else if (
          item.status === "UNPAID" &&
          moment(item.due_date).isBefore(moment(), "day")
        ) {
          status = "overdue";
        }

        const invoiceDate = moment(item.time_invoiced || item.due_date);
        const month = invoiceDate.format("MMMM, YYYY");

        return {
          id: item.id.toString(),
          type,
          title,
          date: invoiceDate.format("DD/MM/YYYY"),
          amount: formatCurrency(item.amount, "VND"),
          status,
          month,
          originalData: item,
        };
      });

      setAllTransactions(transactions);
    } catch (err: any) {
      console.error("Error loading transactions:", err);
      setError("Không thể tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonth = () => {
    return moment().format("MMMM, YYYY");
  };

  const filteredTransactions = allTransactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "this_month") return t.month === getCurrentMonth();
    if (filter === "type") return false; // Demo empty state
    return true;
  });

  const getIconInfo = (type: Transaction["type"]) => {
    switch (type) {
      case "room":
        return { icon: "bed", color: "#3b82f6", bg: "#dbeafe" };
      case "electricity":
        return { icon: "bolt", color: "#ca8a04", bg: "#fef9c3" };
      case "water":
        return { icon: "water-drop", color: "#0891b2", bg: "#cffafe" };
      default:
        return { icon: "receipt", color: "#475569", bg: "#f1f5f9" };
    }
  };

  const getStatusDisplay = (status: Transaction["status"]) => {
    switch (status) {
      case "paid":
        return { text: "Đã thanh toán", color: "#22c55e" };
      case "submitted":
        return { text: "Đã nộp", color: "#3b82f6" };
      case "overdue":
        return { text: "Quá hạn", color: "#ef4444" };
      case "pending":
        return { text: "Chờ thanh toán", color: "#f59e0b" };
      default:
        return { text: "Chờ thanh toán", color: "#f59e0b" };
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const { icon, color, bg } = getIconInfo(item.type);
    const { text: statusText, color: statusColor } = getStatusDisplay(
      item.status
    );
    return (
      <TouchableOpacity style={styles.transactionItem}>
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <MaterialIcons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.transactionContent}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>{item.amount}</Text>
          <Text style={[styles.transactionStatus, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "this_month" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("this_month")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "this_month" && styles.filterTextActive,
            ]}
          >
            Tháng này
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "type" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("type")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "type" && styles.filterTextActive,
            ]}
          >
            Loại phí
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadTransactions}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="receipt-long" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>Không có giao dịch nào</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  filterButtonActive: {
    backgroundColor: "#0ea5e9",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#0ea5e9",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#64748b",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusPaid: {
    color: "#22c55e",
  },
  statusPending: {
    color: "#f59e0b",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
});

export default TransactionHistory;
