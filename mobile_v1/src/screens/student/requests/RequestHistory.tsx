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

type RequestHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RequestHistory"
>;

interface Props {
  navigation: RequestHistoryScreenNavigationProp;
}

interface RequestItem {
  id: string;
  code: string;
  title: string;
  status: "processing" | "completed" | "rejected";
  date: string;
}

const RequestHistory = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<
    "all" | "processing" | "completed" | "rejected"
  >("all");

  // Mock Data
  const requests: RequestItem[] = [
    {
      id: "1",
      code: "#S12345",
      title: "Sửa chữa vòi nước",
      status: "processing",
      date: "12/08/2024",
    },
    {
      id: "2",
      code: "#K67890",
      title: "Khiếu nại về tiếng ồn",
      status: "completed",
      date: "10/08/2024",
    },
    {
      id: "3",
      code: "#D11223",
      title: "Đề xuất lắp thêm máy bán nước",
      status: "rejected",
      date: "05/08/2024",
    },
    {
      id: "4",
      code: "#D45678",
      title: "Yêu cầu dọn dẹp hành lang",
      status: "completed",
      date: "02/08/2024",
    },
    {
      id: "5",
      code: "#M90123",
      title: "Báo mất thẻ sinh viên",
      status: "processing",
      date: "01/08/2024",
    },
    {
      id: "6",
      code: "#G45678",
      title: "Góp ý về thực đơn nhà ăn",
      status: "rejected",
      date: "28/07/2024",
    },
  ];

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const getStatusStyle = (status: RequestItem["status"]) => {
    switch (status) {
      case "processing":
        return { bg: "#eff6ff", text: "#2563eb", label: "Đang xử lý" };
      case "completed":
        return { bg: "#f0fdf4", text: "#16a34a", label: "Đã hoàn thành" };
      case "rejected":
        return { bg: "#fef2f2", text: "#dc2626", label: "Bị từ chối" };
    }
  };

  const renderItem = ({ item }: { item: RequestItem }) => {
    const style = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("RequestDetail", { id: item.id })}
        style={styles.itemContainer}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[styles.statusText, { color: style.text }]}>
              {style.label}
            </Text>
          </View>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemCode}>Mã: {item.code}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
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
        <Text style={styles.headerTitle}>Lịch Sử Yêu Cầu</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          {(["all", "processing", "completed", "rejected"] as const).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilter(tab)}
                style={[
                  styles.tabButton,
                  filter === tab && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    filter === tab && styles.activeTabText,
                  ]}
                >
                  {tab === "all"
                    ? "Tất cả"
                    : tab === "processing"
                    ? "Đang xử lý"
                    : tab === "completed"
                    ? "Hoàn thành"
                    : "Bị từ chối"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateRequest")}
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
  searchButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 80, // Space for FAB
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
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
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCode: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  itemDate: {
    fontSize: 14,
    color: "#64748b",
  },
  viewAllButton: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
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
    elevation: 6,
  },
});

export default RequestHistory;
