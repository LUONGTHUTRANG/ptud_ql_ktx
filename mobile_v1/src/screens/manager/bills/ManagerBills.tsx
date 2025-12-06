import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerBillsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerBills"
>;

interface Props {
  navigation: ManagerBillsScreenNavigationProp;
}

interface BillItem {
  id: string;
  code: string;
  status: "paid" | "unpaid" | "overdue";
  payerName: string;
  room: string;
  amount: string;
  createdDate: string;
  dueDate: string;
}

const ManagerBills = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "overdue">(
    "all"
  );

  const bills: BillItem[] = [
    {
      id: "1",
      code: "#HD001",
      status: "paid",
      payerName: "Nguyễn Văn A",
      room: "101 - A1",
      amount: "500.000 VND",
      createdDate: "01/10/2023",
      dueDate: "15/10/2023",
    },
    {
      id: "2",
      code: "#HD002",
      status: "unpaid",
      payerName: "Trần Thị B",
      room: "102 - A1",
      amount: "2.500.000 VND",
      createdDate: "01/11/2023",
      dueDate: "15/11/2023",
    },
    {
      id: "3",
      code: "#HD003",
      status: "overdue",
      payerName: "Lê Văn C",
      room: "201 - B1",
      amount: "300.000 VND",
      createdDate: "01/09/2023",
      dueDate: "15/09/2023",
    },
    {
      id: "4",
      code: "#HD004",
      status: "unpaid",
      payerName: "Phạm Thị D",
      room: "305 - G6",
      amount: "1.200.000 VND",
      createdDate: "05/11/2023",
      dueDate: "20/11/2023",
    },
    {
      id: "5",
      code: "#HD005",
      status: "paid",
      payerName: "Hoàng Văn E",
      room: "101 - A2",
      amount: "500.000 VND",
      createdDate: "01/10/2023",
      dueDate: "15/10/2023",
    },
  ];

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true;
    return bill.status === filter;
  });

  const getStatusStyle = (status: BillItem["status"]) => {
    switch (status) {
      case "paid":
        return { bg: "#dcfce7", text: "#16a34a", label: "Đã thanh toán" };
      case "unpaid":
        return { bg: "#ffedd5", text: "#ea580c", label: "Chưa thanh toán" };
      case "overdue":
        return { bg: "#fee2e2", text: "#dc2626", label: "Đã quá hạn" };
    }
  };

  const renderItem = ({ item }: { item: BillItem }) => {
    const style = getStatusStyle(item.status);
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemCode}>{item.code}</Text>
          <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[styles.statusText, { color: style.text }]}>
              {style.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Người đóng:</Text>
            <Text style={styles.infoValue}>{item.payerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phòng:</Text>
            <Text style={styles.infoValue}>{item.room}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tiền:</Text>
            <Text style={styles.amountValue}>{item.amount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày tạo:</Text>
            <Text style={styles.infoValue}>{item.createdDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hết hạn:</Text>
            <Text
              style={[
                styles.infoValue,
                item.status === "overdue" && {
                  color: "#dc2626",
                  fontWeight: "bold",
                },
              ]}
            >
              {item.dueDate}
            </Text>
          </View>
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
        <Text style={styles.headerTitle}>Quản lý hóa đơn</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "paid" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("paid")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "paid" && styles.activeFilterText,
            ]}
          >
            Đã thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unpaid" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("unpaid")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "unpaid" && styles.activeFilterText,
            ]}
          >
            Chưa thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "overdue" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("overdue")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "overdue" && styles.activeFilterText,
            ]}
          >
            Đã quá hạn
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredBills}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Handle add new bill
        }}
      >
        <MaterialIcons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
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
    backgroundColor: "rgba(248, 250, 252, 0.8)",
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
    gap: 8,
    flexWrap: "wrap",
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterTab: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  filterText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
    paddingBottom: 80, // Space for FAB
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  itemBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default ManagerBills;
