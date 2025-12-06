import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type BillsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Bills"
>;

interface Props {
  navigation: BillsScreenNavigationProp;
}

interface BillItem {
  id: string;
  type: "electricity" | "room" | "water";
  title: string;
  amount: number;
  amountDisplay: string;
  dueDate: string;
  status: "overdue" | "pending" | "paid";
  icon: string;
}

const Bills = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<"unpaid" | "paid" | "overdue">(
    "unpaid"
  );
  const [selectedBills, setSelectedBills] = useState<string[]>([]);

  // Mock Data
  const allBills: BillItem[] = [
    {
      id: "1",
      type: "electricity",
      title: "Tiền điện tháng 10/2023",
      amount: 500000,
      amountDisplay: "500.000 VND",
      dueDate: "25/10/2023",
      status: "overdue",
      icon: "electric-bolt", // electric_bolt -> electric-bolt
    },
    {
      id: "2",
      type: "room",
      title: "Tiền phòng tháng 11/2023",
      amount: 2500000,
      amountDisplay: "2.500.000 VND",
      dueDate: "30/11/2023",
      status: "pending",
      icon: "night-shelter", // night_shelter -> night-shelter
    },
    {
      id: "3",
      type: "water",
      title: "Tiền nước tháng 10/2023",
      amount: 500000,
      amountDisplay: "500.000 VND",
      dueDate: "25/11/2023",
      status: "pending",
      icon: "water-drop", // water_drop -> water-drop
    },
  ];

  // Filter bills based on active tab
  const filteredBills = useMemo(() => {
    if (activeTab === "overdue")
      return allBills.filter((b) => b.status === "overdue");
    if (activeTab === "paid")
      return allBills.filter((b) => b.status === "paid");
    return allBills.filter((b) => b.status !== "paid");
  }, [activeTab]);

  const toggleBillSelection = (id: string) => {
    if (selectedBills.includes(id)) {
      setSelectedBills(selectedBills.filter((billId) => billId !== id));
    } else {
      setSelectedBills([...selectedBills, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === filteredBills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(filteredBills.map((b) => b.id));
    }
  };

  const totalAmount = useMemo(() => {
    return allBills
      .filter((bill) => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0);
  }, [selectedBills, allBills]);

  const formatCurrency = (amount: number) => {
    // Simple formatter for React Native if Intl is not fully supported or behaves differently
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const getStatusBadge = (status: string) => {
    if (status === "overdue") {
      return (
        <View style={[styles.badge, styles.badgeOverdue]}>
          <Text style={styles.badgeTextOverdue}>Quá hạn</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgePending]}>
        <Text style={styles.badgeTextPending}>Chưa TT</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hóa đơn & Thanh toán</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("unpaid")}
          style={[styles.tab, activeTab === "unpaid" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unpaid" && styles.activeTabText,
            ]}
          >
            Chưa thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("paid")}
          style={[styles.tab, activeTab === "paid" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "paid" && styles.activeTabText,
            ]}
          >
            Đã thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("overdue")}
          style={[styles.tab, activeTab === "overdue" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overdue" && styles.activeTabText,
            ]}
          >
            Quá hạn
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Select All Row */}
        {activeTab !== "paid" && filteredBills.length > 0 && (
          <View style={styles.selectAllContainer}>
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={styles.selectAllText}>
                {selectedBills.length === filteredBills.length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredBills.map((bill) => {
          const isSelected = selectedBills.includes(bill.id);
          return (
            <TouchableOpacity
              key={bill.id}
              onPress={() => toggleBillSelection(bill.id)}
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
                {/* Checkbox Logic */}
                {isSelected ? (
                  <View style={styles.checkboxSelected}>
                    <MaterialIcons name="check" size={16} color="#ffffff" />
                  </View>
                ) : (
                  <View style={styles.checkboxUnselected} />
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
                  Hạn cuối: {bill.dueDate}
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
            <Text style={styles.emptyText}>Không có hóa đơn nào</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedBills.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Tổng tiền ({selectedBills.length} hóa đơn)
            </Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PaymentDetail")}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Thanh toán</Text>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
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
