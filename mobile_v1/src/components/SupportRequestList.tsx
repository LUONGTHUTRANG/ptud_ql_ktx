import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface RequestItem {
  id: string;
  code: string;
  type: "repair" | "complaint" | "proposal";
  title?: string; // Add title
  studentName?: string;
  room: string;
  date: string;
  status: "pending" | "completed" | "new" | "rejected";
}

interface SupportRequestListProps {
  role: "manager" | "admin" | "student";
  title: string;
  data: RequestItem[];
  onBackPress: () => void;
  onAddPress?: () => void;
  onItemPress: (id: string) => void;
}

const SupportRequestList = ({
  role,
  title,
  data,
  onBackPress,
  onAddPress,
  onItemPress,
}: SupportRequestListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<
    "status" | "type" | "building" | null
  >(null);
  const [selectedFilters, setSelectedFilters] = useState({
    status: "Tất cả",
    type: "Tất cả",
    building: "Tất cả",
  });

  const statusOptions = [
    "Tất cả",
    "Mới",
    "Đang xử lý",
    "Hoàn thành",
    "Từ chối",
  ];
  const typeOptions = ["Tất cả", "Sửa chữa", "Khiếu nại", "Đề xuất"];
  const buildingOptions = ["Tất cả", "C1", "C2", "C3"];

  const handleOpenFilter = (type: "status" | "type" | "building") => {
    setActiveFilterType(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (activeFilterType) {
      setSelectedFilters((prev) => ({
        ...prev,
        [activeFilterType]: option,
      }));
    }
    setModalVisible(false);
  };

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.code.toLowerCase().includes(query) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.studentName && item.studentName.toLowerCase().includes(query)) ||
        item.room.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (selectedFilters.status !== "Tất cả") {
        const statusMap: Record<string, string> = {
          "Đang xử lý": "pending",
          "Hoàn thành": "completed",
          "Từ chối": "rejected",
          Mới: "new",
        };
        if (item.status !== statusMap[selectedFilters.status]) return false;
      }

      // 3. Type Filter
      if (selectedFilters.type !== "Tất cả") {
        const typeMap: Record<string, string> = {
          "Sửa chữa": "repair",
          "Khiếu nại": "complaint",
          "Đề xuất": "proposal",
        };
        if (item.type !== typeMap[selectedFilters.type]) return false;
      }

      // 4. Building Filter
      if (selectedFilters.building !== "Tất cả") {
        if (!item.room.includes(selectedFilters.building)) return false;
      }

      return true;
    });
  }, [data, searchQuery, selectedFilters]);

  const getActiveOptions = () => {
    switch (activeFilterType) {
      case "status":
        return statusOptions;
      case "type":
        return typeOptions;
      case "building":
        return buildingOptions;
      default:
        return [];
    }
  };

  const getStatusStyle = (status: RequestItem["status"]) => {
    switch (status) {
      case "pending":
        return {
          bg: "#ffedd5",
          text: "#ea580c",
          dot: "#fb923c",
          label: "Đang xử lý",
        };
      case "completed":
        return {
          bg: "#dcfce7",
          text: "#16a34a",
          dot: "#4ade80",
          label: "Hoàn thành",
        };
      case "new":
        return {
          bg: "#dbeafe",
          text: "#2563eb",
          dot: "#60a5fa",
          label: "Mới",
        };
      case "rejected":
        return {
          bg: "#f1f5f9",
          text: "#475569",
          dot: "#94a3b8",
          label: "Từ chối",
        };
      default:
        return {
          bg: "#f1f5f9",
          text: "#64748b",
          dot: "#94a3b8",
          label: "Khác",
        };
    }
  };

  const getTypeInfo = (type: RequestItem["type"]) => {
    switch (type) {
      case "repair":
        return {
          icon: "build",
          bg: "#ffedd5",
          color: "#f97316",
          label: "Sửa chữa",
        };
      case "complaint":
        return {
          icon: "report",
          bg: "#fee2e2",
          color: "#ef4444",
          label: "Khiếu nại",
        };
      case "proposal":
        return {
          icon: "lightbulb",
          bg: "#dbeafe",
          color: "#3b82f6",
          label: "Đề xuất",
        };
      default:
        return {
          icon: "help",
          bg: "#f1f5f9",
          color: "#64748b",
          label: "Khác",
        };
    }
  };

  const renderItem = ({ item }: { item: RequestItem }) => {
    const statusStyle = getStatusStyle(item.status);
    const typeInfo = getTypeInfo(item.type);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onItemPress(item.id)}
      >
        <View style={styles.cardHeader}>
          <View
            style={[styles.typeIconContainer, { backgroundColor: typeInfo.bg }]}
          >
            <MaterialIcons
              name={typeInfo.icon as any}
              size={24}
              color={typeInfo.color}
            />
          </View>
          <View style={styles.cardContent}>
            {/* Add Title */}
            {item.title && (
              <Text
                style={[styles.cardTitle, { fontSize: 16, marginBottom: 4 }]}
              >
                {item.title}
              </Text>
            )}
            <Text
              style={[
                styles.cardSubtitle,
                { color: "#64748b", fontWeight: "500" },
              ]}
            >
              {typeInfo.label} #{item.code}
            </Text>
            {(role === "manager" || role === "admin") && (
              <Text style={styles.cardSubtitle}>
                {item.studentName
                  ? `${item.studentName} - ${item.room}`
                  : item.room}
              </Text>
            )}
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusStyle.dot }]}
            />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusStyle.label}
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
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
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
            placeholder={
              (role === "manager" || role === "admin")
                ? "Tìm theo mã, tên sinh viên..."
                : "Tìm theo mã..."
            }
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilters.status !== "Tất cả" && styles.activeFilterChip,
            ]}
            onPress={() => handleOpenFilter("status")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilters.status !== "Tất cả" && styles.activeFilterText,
              ]}
            >
              {selectedFilters.status === "Tất cả"
                ? "Trạng thái"
                : selectedFilters.status}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={
                selectedFilters.status !== "Tất cả" ? "#136dec" : "#64748b"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilters.type !== "Tất cả" && styles.activeFilterChip,
            ]}
            onPress={() => handleOpenFilter("type")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilters.type !== "Tất cả" && styles.activeFilterText,
              ]}
            >
              {selectedFilters.type === "Tất cả"
                ? "Loại"
                : selectedFilters.type}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={selectedFilters.type !== "Tất cả" ? "#136dec" : "#64748b"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilters.building !== "Tất cả" && styles.activeFilterChip,
            ]}
            onPress={() => handleOpenFilter("building")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilters.building !== "Tất cả" &&
                  styles.activeFilterText,
              ]}
            >
              {selectedFilters.building === "Tất cả"
                ? "Tòa nhà"
                : selectedFilters.building}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={
                selectedFilters.building !== "Tất cả" ? "#136dec" : "#64748b"
              }
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      {role === "student" && onAddPress && (
        <TouchableOpacity style={styles.fab} onPress={onAddPress}>
          <MaterialIcons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Chọn{" "}
                  {activeFilterType === "status"
                    ? "Trạng thái"
                    : activeFilterType === "type"
                    ? "Loại"
                    : "Tòa nhà"}
                </Text>
                {getActiveOptions().map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalOption}
                    onPress={() => handleSelectOption(option)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedFilters[activeFilterType!] === option &&
                          styles.selectedModalOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {selectedFilters[activeFilterType!] === option && (
                      <MaterialIcons name="check" size={20} color="#136dec" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    gap: 4,
  },
  activeFilterChip: {
    backgroundColor: "rgba(19, 109, 236, 0.2)", // primary/20
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  activeFilterText: {
    color: "#136dec",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 14,
    color: "#94a3b8",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedModalOptionText: {
    color: "#136dec",
    fontWeight: "600",
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
});

export default SupportRequestList;
