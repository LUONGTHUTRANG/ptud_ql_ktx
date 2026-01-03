import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import { fetchInvoices } from "../../../services/invoiceApi";
import { getMe } from "../../../services/authApi";
import moment from "moment";

type BillsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Bills"
>;

interface Props {
  navigation: BillsScreenNavigationProp;
}

interface BillItem {
  id: string;
  type: "electricity" | "room" | "water" | "other";
  title: string;
  amount: number;
  amountDisplay: string;
  dueDate: string;
  status: "overdue" | "submitted" | "pending" | "paid";
  icon: string;
  originalData: any;
}

const Bills = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "unpaid" | "submitted" | "paid" | "overdue"
  >("unpaid");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [bills, setBills] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getMe();
      const data = await fetchInvoices(user.id);

      const mappedBills = data.map((item: any) => {
        const isOverdue =
          item.status === "UNPAID" &&
          moment(item.due_date).isBefore(moment(), "day");

        let status: "overdue" | "pending" | "paid" | "submitted" = "pending";
        if (item.status === "PAID") {
          status = "paid";
        } else if (item.status === "SUBMITTED") {
          status = "submitted";
        } else if (isOverdue) {
          status = "overdue";
        }

        let icon = "receipt";
        let type: any = "other";

        if (item.type === "ROOM_FEE") {
          icon = "night-shelter";
          type = "room";
        } else if (item.type === "UTILITY_FEE") {
          icon = "electric-bolt"; // Default to electric icon for utility
          type = "electricity";
        }

        let title = item.description || `Hóa đơn ${item.invoice_code}`;
        if (item.type === "UTILITY_FEE" && item.room_number) {
          title = `${t("monthlyUsage.water")} ${t(
            "monthlyUsage.electricity"
          )} ${t("room.roomName")} ${item.room_number}`;
          if (item.description) title += ` - ${item.description}`;
        }

        return {
          id: item.id.toString(),
          type,
          title,
          amount: item.amount,
          amountDisplay: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.amount),
          dueDate: moment(item.due_date).format("DD/MM/YYYY"),
          status,
          icon,
          originalData: item,
        };
      });

      setBills(mappedBills);
    } catch (error) {
      console.error("Failed to load bills:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  // Filter bills based on active tab
  const filteredBills = useMemo(() => {
    if (activeTab === "paid") return bills.filter((b) => b.status === "paid");

    if (activeTab === "submitted")
      return bills.filter((b) => b.status === "submitted");

    if (activeTab === "overdue")
      return bills.filter((b) => b.status === "overdue");

    // unpaid
    return bills.filter((b) => b.status === "pending");
  }, [activeTab, bills]);

  const handleLongPress = (id: string) => {
    if (activeTab === "paid") return; // Cannot select paid bills
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedBills([id]);
    }
  };

  const handlePress = (id: string) => {
    if (isSelectionMode) {
      toggleBillSelection(id);
    } else {
      const bill = bills.find((b) => b.id === id);
      if (bill) {
        navigation.navigate("BillDetail", {
          invoiceId: bill.originalData.id,
          source: "BILLS",
          onRefresh: loadData,
        });
      }
    }
  };

  const toggleBillSelection = (id: string) => {
    let newSelectedBills;
    if (selectedBills.includes(id)) {
      newSelectedBills = selectedBills.filter((billId) => billId !== id);
    } else {
      newSelectedBills = [...selectedBills, id];
    }

    setSelectedBills(newSelectedBills);

    if (newSelectedBills.length === 0) {
      setIsSelectionMode(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === filteredBills.length) {
      setSelectedBills([]);
      setIsSelectionMode(false);
    } else {
      setSelectedBills(filteredBills.map((b) => b.id));
    }
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedBills([]);
  };

  const totalAmount = useMemo(() => {
    return bills
      .filter((bill) => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0);
  }, [selectedBills, bills]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    if (status === "overdue") {
      return (
        <View style={[styles.badge, styles.badgeOverdue]}>
          <Text style={styles.badgeTextOverdue}>{t("invoice.overdue")}</Text>
        </View>
      );
    }

    if (status === "submitted") {
      return (
        <View style={[styles.badge, styles.badgeSubmitted]}>
          <Text style={styles.badgeTextSubmitted}>Đã gửi</Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgePending]}>
        <Text style={styles.badgeTextPending}>{t("invoice.unpaid")}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        {isSelectionMode ? (
          <TouchableOpacity
            onPress={cancelSelectionMode}
            style={styles.backButton}
          >
            <MaterialIcons name="close" size={24} color="#1e293b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Services")}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>
          {isSelectionMode
            ? `${t("common.select")} ${selectedBills.length}`
            : t("invoice.billsNeedPayment")}
        </Text>

        {isSelectionMode ? (
          <TouchableOpacity
            onPress={toggleSelectAll}
            style={styles.headerRightButton}
          >
            <Text style={styles.headerRightText}>
              {selectedBills.length === filteredBills.length
                ? t("common.deselect")
                : t("common.selectAll")}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRight} />
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          <TouchableOpacity
  onPress={() => {
    setActiveTab("unpaid");
    cancelSelectionMode();
  }}
  style={[styles.tab, activeTab === "unpaid" && styles.activeTab]}
>
  <Text
    style={[
      styles.tabText,
      activeTab === "unpaid" && styles.activeTabText,
    ]}
  >
    {t("invoice.unpaid")}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    setActiveTab("submitted");
    cancelSelectionMode();
  }}
  style={[styles.tab, activeTab === "submitted" && styles.activeTab]}
>
  <Text
    style={[
      styles.tabText,
      activeTab === "submitted" && styles.activeTabText,
    ]}
  >
    Chờ xác nhận
  </Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    setActiveTab("paid");
    cancelSelectionMode();
  }}
  style={[styles.tab, activeTab === "paid" && styles.activeTab]}
>
  <Text
    style={[
      styles.tabText,
      activeTab === "paid" && styles.activeTabText,
    ]}
  >
    {t("invoice.paid")}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    setActiveTab("overdue");
    cancelSelectionMode();
  }}
  style={[styles.tab, activeTab === "overdue" && styles.activeTab]}
>
  <Text
    style={[
      styles.tabText,
      activeTab === "overdue" && styles.activeTabText,
    ]}
  >
    {t("invoice.overdue")}
  </Text>
</TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredBills.map((bill) => {
          const isSelected = selectedBills.includes(bill.id);
          return (
            <TouchableOpacity
              key={bill.id}
              onLongPress={() => handleLongPress(bill.id)}
              onPress={() => handlePress(bill.id)}
              delayLongPress={300}
              activeOpacity={0.7}
              style={[styles.billCard, isSelected && styles.billCardSelected]}
            >
              {/* Icon & Selection Circle */}
              <View style={styles.billLeft}>
                <View style={styles.billIconContainer}>
                  <MaterialIcons
                    name={bill.icon as any}
                    size={24}
                    color="#0ea5e9"
                  />
                </View>

                {/* Checkbox Logic - Only show in selection mode */}
                {isSelectionMode && (
                  <View style={styles.checkboxContainer}>
                    {isSelected ? (
                      <View style={styles.checkboxSelected}>
                        <MaterialIcons name="check" size={16} color="#ffffff" />
                      </View>
                    ) : (
                      <View style={styles.checkboxUnselected} />
                    )}
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.billContent}>
                <Text style={styles.billTitle}>{bill.title}</Text>
                <Text style={styles.billAmount}>{bill.amountDisplay}</Text>
                <Text
                  style={[
                    styles.billDueDate,
                    bill.status === "overdue" && styles.textRed,
                  ]}
                >
                  {t("common.dueDate")}: {bill.dueDate}
                </Text>
              </View>

              {/* Status Badge */}
              {getStatusBadge(bill.status)}
            </TouchableOpacity>
          );
        })}

        {filteredBills.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="assignment-turned-in"
              size={48}
              color="#64748b"
            />
            <Text style={styles.emptyText}>{t("invoice.noBills")}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      {isSelectionMode && selectedBills.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {t("common.total")} ({selectedBills.length} {t("invoice.bills")})
            </Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const selectedBillObjects = bills.filter((b) =>
                selectedBills.includes(b.id)
              );
              const total = selectedBillObjects.reduce(
                (sum, b) => sum + b.amount,
                0
              );
              const firstBill = selectedBillObjects[0]?.originalData || {};

              const combinedBill = {
                ...firstBill,
                amount: total,
                description: `${t("invoice.payment")} ${
                  selectedBills.length
                } ${t("invoice.bills")}`,
                invoice_code: selectedBillObjects
                  .map((b) => b.originalData.invoice_code)
                  .join(", "),
              };

              navigation.navigate("PaymentDetail", { bill: combinedBill });
            }}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>{t("invoice.payment")}</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#ffffff",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  headerRight: {
    width: 40,
  },
  headerRightButton: {
    padding: 8,
  },
  headerRightText: {
    color: "#0ea5e9",
    fontWeight: "600",
    fontSize: 14,
  },
  tabWrapper: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 8,
    paddingVertical: 14,
    marginRight: 6,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0ea5e9",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748b",
  },
  activeTabText: {
    color: "#0ea5e9",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  selectAllContainer: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  billCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  billCardSelected: {
    backgroundColor: "#eff6ff", // bg-blue-50
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.5)",
  },
  billLeft: {
    alignItems: "center",
    gap: 6,
  },
  billIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#dbeafe", // bg-blue-100
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
  },
  billContent: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  billAmount: {
    fontSize: 14,
    color: "#64748b",
  },
  billDueDate: {
    fontSize: 14,
    color: "#64748b",
  },
  textRed: {
    color: "#ef4444",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOverdue: {
    backgroundColor: "#fee2e2",
  },
  badgePending: {
    backgroundColor: "#fef3c7",
  },
  badgeTextOverdue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#b91c1c",
  },
  badgeTextPending: {
    fontSize: 12,
    fontWeight: "500",
    color: "#b45309",
  },
  badgeSubmitted: {
    backgroundColor: "#e0f2fe",
  },
  badgeTextSubmitted: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0284c7",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    gap: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: "#64748b",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  payButton: {
    height: 48,
    backgroundColor: "#0ea5e9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Bills;
