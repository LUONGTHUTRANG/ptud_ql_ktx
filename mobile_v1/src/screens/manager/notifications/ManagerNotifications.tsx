import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerNotificationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerNotifications"
>;

interface Props {
  navigation: ManagerNotificationsScreenNavigationProp;
}

interface NotificationItem {
  id: string;
  title: string;
  date: string;
  status: "sent" | "draft";
}

const ManagerNotifications = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<"all" | "sent" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const notifications: NotificationItem[] = [
    {
      id: "1",
      title: "Thông báo về lịch cắt điện tòa A1 do bảo trì hệ thống",
      date: "15/10/2023",
      status: "sent",
    },
    {
      id: "2",
      title: "Lịch tổng vệ sinh KTX khu B",
      date: "14/10/2023",
      status: "sent",
    },
    {
      id: "3",
      title: "Kế hoạch tổ chức giải bóng đá sinh viên",
      date: "12/10/2023",
      status: "draft",
    },
  ];

  const filteredNotifications = notifications.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: NotificationItem["status"]) => {
    switch (status) {
      case "sent":
        return { bg: "#dcfce7", text: "#16a34a", label: "Đã gửi" }; // Green
      case "draft":
        return { bg: "#ffedd5", text: "#ea580c", label: "Nháp" }; // Orange
      default:
        return { bg: "#f1f5f9", text: "#64748b", label: "Khác" };
    }
  };

  const handleLongPress = (id: string) => {
    setIsSelectionMode(true);
    setSelectedIds(new Set([id]));
  };

  const handlePress = (item: NotificationItem) => {
    if (isSelectionMode) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(item.id)) {
        newSelectedIds.delete(item.id);
        if (newSelectedIds.size === 0) {
          setIsSelectionMode(false);
        }
      } else {
        newSelectedIds.add(item.id);
      }
      setSelectedIds(newSelectedIds);
    } else {
      navigation.navigate("ManagerNotificationDetail", { id: item.id });
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa ${selectedIds.size} thông báo đã chọn?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            // Logic xóa ở đây (API call)
            console.log("Deleting:", Array.from(selectedIds));
            setIsSelectionMode(false);
            setSelectedIds(new Set());
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const style = getStatusStyle(item.status);
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && { backgroundColor: "#e2e8f0", borderColor: "#0066CC" },
        ]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.id)}
        delayLongPress={300}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardDate}>{item.date}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
              <Text style={[styles.statusText, { color: style.text }]}>
                {style.label}
              </Text>
            </View>
          </View>
        </View>
        {isSelectionMode ? (
          <MaterialIcons
            name={isSelected ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={isSelected ? "#0066CC" : "#94a3b8"}
          />
        ) : (
          <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
        )}
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
        <Text style={styles.headerTitle}>Quản lý Thông báo</Text>
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
            placeholder="Tìm kiếm theo tiêu đề..."
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
            filter === "sent" && styles.activeFilterChip,
          ]}
          onPress={() => setFilter("sent")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "sent" && styles.activeFilterText,
            ]}
          >
            Đã gửi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === "draft" && styles.activeFilterChip,
          ]}
          onPress={() => setFilter("draft")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "draft" && styles.activeFilterText,
            ]}
          >
            Nháp
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB or Selection Footer */}
      {!isSelectionMode ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ManagerNotificationDetail", {})}
        >
          <MaterialIcons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.selectionFooter}>
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Đã chọn {selectedIds.size} thông báo
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
              }}
            >
              <Text style={styles.cancelSelectionText}>Hủy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              selectedIds.size === 0 && styles.deleteButtonDisabled,
            ]}
            onPress={handleDeleteSelected}
            disabled={selectedIds.size === 0}
          >
            <MaterialIcons name="delete" size={24} color="#ffffff" />
            <Text style={styles.deleteButtonText}>Xóa</Text>
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
    backgroundColor: "#136dec",
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
    gap: 12,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
    lineHeight: 22,
  },
  cardDate: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
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
    elevation: 4,
  },
  selectionFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  cancelSelectionText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonDisabled: {
    backgroundColor: "#fca5a5",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ManagerNotifications;
