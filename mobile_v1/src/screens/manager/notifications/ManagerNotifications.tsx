import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { notificationApi } from "../../../services/notificationApi";

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
  content?: string;
}

const ManagerNotifications = ({ navigation }: Props) => {
  const [filter, setFilter] = useState<"all" | "sent" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getManagerSentNotifications();
      const formattedData = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        date: new Date(item.created_at).toLocaleDateString("locale"),
        status: "sent", // Assuming all fetched are sent for now
        content: item.content,
      }));
      setNotifications(formattedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert(t("common.error"), "Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

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
          onPress: async () => {
            try {
              setLoading(true);
              const idsToDelete = Array.from(selectedIds);
              await Promise.all(
                idsToDelete.map((id) => notificationApi.deleteNotification(id))
              );
              Alert.alert("Thành công", "Đã xóa các thông báo đã chọn");
              setIsSelectionMode(false);
              setSelectedIds(new Set());
              await fetchNotifications();
            } catch (error) {
              console.error("Error deleting notifications:", error);
              Alert.alert(t("common.error"), "Không thể xóa một số thông báo");
            } finally {
              setLoading(false);
            }
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
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Không có thông báo nào</Text>
            </View>
          }
        />
      )}

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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});

export default ManagerNotifications;
