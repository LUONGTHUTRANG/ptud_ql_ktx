import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import {
  fetchManagerInvoices,
  formatInvoiceData,
  groupUtilityInvoicesByMonth,
} from "../../../services/invoiceApi";

type ManagerBillsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerBills"
>;

interface Props {
  navigation: ManagerBillsScreenNavigationProp;
}

const ManagerBills = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<"room" | "utility">("room");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "unpaid" | "submitted" | "paid"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bills, setBills] = useState<any[]>([]);
  const [utilityBills, setUtilityBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBills();
  }, [activeTab, filterStatus]);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "room") {
        const data = await fetchManagerInvoices("room", filterStatus);
        const formattedBills = data.map((invoice: any) => ({
          id: invoice.id,
          room: `Phòng ${invoice.room_number}`,
          period: invoice.time_invoiced
            ? new Date(invoice.time_invoiced).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
              })
            : "N/A",
          amount: `${parseInt(invoice.amount).toLocaleString("vi-VN")} đ`,
          status: invoice.status.toLowerCase(),
          type: "room",
          invoice,
        }));
        setBills(formattedBills);
      } else {
        const data = await fetchManagerInvoices("utility", filterStatus);
        const grouped = groupUtilityInvoicesByMonth(data);
        setUtilityBills(grouped);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error loading bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return { bg: "#dcfce7", text: "#16a34a", label: "Đã thanh toán" };
      case "submitted":
        return { bg: "#fef9c3", text: "#ca8a04", label: "Chờ xác nhận" };
      case "unpaid":
        return { bg: "#fee2e2", text: "#dc2626", label: "Chưa thanh toán" };
      case "overdue":
        return { bg: "#fee2e2", text: "#dc2626", label: "Quá hạn" };
      default:
        return { bg: "#f1f5f9", text: "#64748b", label: "Khác" };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý Hóa đơn</Text>
          <View style={styles.iconButton}></View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === "room" && styles.activeTab]}
            onPress={() => setActiveTab("room")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "room"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Hóa đơn tiền phòng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "utility" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("utility")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "utility"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Hóa đơn điện nước
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={24} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm hóa đơn..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "all"
                ? styles.activeFilterChip
                : styles.inactiveFilterChip,
            ]}
            onPress={() => setFilterStatus("all")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "all"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "unpaid"
                ? styles.activeFilterChip
                : styles.inactiveFilterChip,
            ]}
            onPress={() => setFilterStatus("unpaid")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "unpaid"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Chưa thanh toán
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "submitted"
                ? styles.activeFilterChip
                : styles.inactiveFilterChip,
            ]}
            onPress={() => setFilterStatus("submitted")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "submitted"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Chờ xác nhận
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "paid"
                ? styles.activeFilterChip
                : styles.inactiveFilterChip,
            ]}
            onPress={() => setFilterStatus("paid")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "paid"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText,
              ]}
            >
              Đã thanh toán
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Loading or Error State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#136dec" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={40} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadBills}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bill List */}
        {!loading && !error && (
          <View style={styles.listContainer}>
            {activeTab === "room" ? (
              bills.length > 0 ? (
                bills.map((bill) => {
                  const statusStyle = getStatusColor(bill.status);
                  return (
                    <View key={bill.id} style={styles.billCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardInfo}>
                          <View style={styles.iconContainer}>
                            <MaterialIcons
                              name="receipt-long"
                              size={24}
                              color="#4f46e5"
                            />
                          </View>
                          <View>
                            <Text style={styles.roomName}>{bill.room}</Text>
                            <Text style={styles.periodText}>{bill.period}</Text>
                          </View>
                        </View>
                        <View style={styles.amountInfo}>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: statusStyle.bg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                { color: statusStyle.text },
                              ]}
                            >
                              {statusStyle.label}
                            </Text>
                          </View>
                          <Text style={styles.amountText}>{bill.amount}</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.cardFooter}>
                        <View style={{ flex: 1 }} />

                        <TouchableOpacity 
                        style={styles.detailButton}
                        onPress={() => {
                          navigation.navigate("ManagerBillDetail", { invoice: bill.invoice });
                        }}
                      >
                          <Text style={styles.detailButtonText}>
                            Xem chi tiết
                          </Text>
                          <MaterialIcons
                            name="arrow-forward"
                            size={16}
                            color="#136dec"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name="receipt-long"
                    size={48}
                    color="#cbd5e1"
                  />
                  <Text style={styles.emptyText}>
                    Không có hóa đơn tiền phòng
                  </Text>
                </View>
              )
            ) : utilityBills.length > 0 ? (
              utilityBills.map((bill) => (
                <TouchableOpacity
                  key={bill.month}
                  style={[
                    styles.utilityCard,
                    bill.status === "completed" && styles.utilityCardCompleted,
                  ]}
                  onPress={() =>
                    navigation.navigate("RecordMeterReading", {
                      period: bill.month,
                    })
                  }
                >
                  <View
                    style={[
                      styles.leftBorder,
                      {
                        backgroundColor:
                          bill.status === "active" ? "#3b82f6" : "#cbd5e1",
                      },
                    ]}
                  />
                  <View style={styles.utilityContent}>
                    <View style={styles.utilityHeader}>
                      <View style={styles.utilityInfo}>
                        <View
                          style={[
                            styles.utilityIcon,
                            {
                              backgroundColor:
                                bill.status === "active"
                                  ? "#eff6ff"
                                  : "#f1f5f9",
                            },
                          ]}
                        >
                          <MaterialIcons
                            name={
                              bill.status === "active"
                                ? "calendar-today"
                                : "event"
                            }
                            size={24}
                            color={
                              bill.status === "active" ? "#2563eb" : "#475569"
                            }
                          />
                        </View>
                        <View>
                          <Text style={styles.utilityMonth}>{bill.month}</Text>
                          <Text style={styles.utilityCount}>{bill.count}</Text>
                        </View>
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="#94a3b8"
                      />
                    </View>

                    {bill.status === "active" ? (
                      <>
                        <View style={styles.statsContainer}>
                          <View style={styles.statBox}>
                            <Text style={styles.statLabel}>ĐÃ THU</Text>
                            <Text style={styles.statValueSuccess}>
                              {bill.collected || "0 đ"}
                            </Text>
                          </View>
                          <View style={styles.statBox}>
                            <Text style={styles.statLabel}>CHỜ THU</Text>
                            <Text style={styles.statValueWarning}>
                              {bill.pending || "0 đ"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.closedDateContainer}>
                          <View style={styles.dot} />
                          <Text style={styles.closedDateText}>
                            Đã chốt sổ: {bill.closedDate}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.completedRow}>
                        <View style={styles.completedStatus}>
                          <MaterialIcons
                            name="check-circle"
                            size={16}
                            color="#16a34a"
                          />
                          <Text style={styles.completedText}>
                            Hoàn thành 100%
                          </Text>
                        </View>
                        <Text style={styles.totalAmount}>{bill.total}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="calendar-today"
                  size={48}
                  color="#cbd5e1"
                />
                <Text style={styles.emptyText}>Không có hóa đơn điện nước</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 64,
  },
  iconButton: {
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
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#136dec",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#136dec",
  },
  inactiveTabText: {
    color: "#64748b",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#0f172a",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#136dec",
    borderColor: "#136dec",
  },
  inactiveFilterChip: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  inactiveFilterText: {
    color: "#334155",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  billCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardInfo: {
    flexDirection: "row",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginTop: 2,
  },
  amountInfo: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#136dec",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#136dec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#136dec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  utilityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  utilityCardCompleted: {
    opacity: 0.9,
  },
  leftBorder: {
    width: 6,
    height: "100%",
  },
  utilityContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 20,
  },
  utilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  utilityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  utilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  utilityMonth: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  utilityCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValueSuccess: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a34a",
  },
  statValueWarning: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d97706",
  },
  closedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  closedDateText: {
    fontSize: 12,
    color: "#64748b",
  },
  completedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completedStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#136dec",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});

export default ManagerBills;
