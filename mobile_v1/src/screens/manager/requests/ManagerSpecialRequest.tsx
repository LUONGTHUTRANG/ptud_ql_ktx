import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerSpecialRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerSpecialRequest"
>;

interface Props {
  navigation: ManagerSpecialRequestScreenNavigationProp;
}

interface SpecialRequestItem {
  id: string;
  name: string;
  studentId: string;
  circumstance: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const ManagerSpecialRequest = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const requests: SpecialRequestItem[] = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      studentId: "20181234",
      circumstance: "Hộ nghèo",
      date: "25/07/2024",
      status: "pending",
    },
    {
      id: "2",
      name: "Trần Thị Bích",
      studentId: "20195678",
      circumstance: "Khuyết tật",
      date: "24/07/2024",
      status: "approved",
    },
    {
      id: "3",
      name: "Lê Minh Cường",
      studentId: "20202468",
      circumstance: "Mồ côi",
      date: "23/07/2024",
      status: "rejected",
    },
  ];

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentId.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: SpecialRequestItem["status"]) => {
    switch (status) {
      case "pending":
        return "#FFC107"; // Yellow
      case "approved":
        return "#4CAF50"; // Green
      case "rejected":
        return "#F44336"; // Red
      default:
        return "#94a3b8";
    }
  };

  const renderItem = ({ item }: { item: SpecialRequestItem }) => (
    <View style={styles.card}>
      <View
        style={[
          styles.statusStrip,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      />
      <View style={styles.cardContent}>
        <View style={styles.rowHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentId}>MSSV: {item.studentId}</Text>
          </View>
          <TouchableOpacity
            style={styles.detailButtonCompact}
            onPress={() =>
              navigation.navigate("ManagerSpecialRequestDetail", {
                id: item.id,
              })
            }
          >
            <Text style={styles.detailButtonTextCompact}>Chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hoàn cảnh:</Text>
            <Text style={styles.detailValue}>{item.circumstance}</Text>
          </View>
          <View style={[styles.detailItem, { alignItems: "flex-end" }]}>
            <Text style={styles.detailLabel}>Ngày gửi:</Text>
            <Text style={styles.detailValue}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Duyệt Đơn Đặc Biệt</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={24}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, MSSV..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "all" && styles.activeFilterChip,
          ]}
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
            styles.filterChip,
            filter === "pending" && styles.activeFilterChip,
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "pending" && styles.activeFilterText,
            ]}
          >
            Chờ duyệt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "approved" && styles.activeFilterChip,
          ]}
          onPress={() => setFilter("approved")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "approved" && styles.activeFilterText,
            ]}
          >
            Đã duyệt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "rejected" && styles.activeFilterChip,
          ]}
          onPress={() => setFilter("rejected")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "rejected" && styles.activeFilterText,
            ]}
          >
            Từ chối
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterChip: {
    backgroundColor: "#136dec", // Primary color from HTML
    borderColor: "#136dec",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusStrip: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  studentId: {
    fontSize: 13,
    color: "#64748b",
  },
  detailButtonCompact: {
    backgroundColor: "rgba(19, 109, 236, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  detailButtonTextCompact: {
    fontSize: 12,
    fontWeight: "600",
    color: "#136dec",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  rowDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
});

export default ManagerSpecialRequest;
