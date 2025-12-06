import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import { NotificationItem } from "../../../models";

type NotificationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Notifications"
>;

interface Props {
  navigation: NotificationsScreenNavigationProp;
}

const Notifications = ({ navigation }: Props) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const notifications: NotificationItem[] = [
    {
      id: "1",
      type: "power",
      title: "Lịch cắt điện toàn KTX ngày 30/11",
      content:
        "Để phục vụ công tác bảo trì hệ thống, BQL sẽ tiến hành cắt điện toàn khu vực...",
      time: "2 giờ trước",
      isRead: false,
    },
    {
      id: "2",
      type: "document",
      title: "Đăng ký nội trú học kỳ mới",
      content:
        "Sinh viên có nhu cầu ở lại KTX trong học kỳ tới vui lòng hoàn tất đăng ký...",
      time: "Hôm qua",
      isRead: false,
    },
    {
      id: "3",
      type: "cleaning",
      title: "Yêu cầu giữ gìn vệ sinh chung",
      content:
        "Nhắc nhở toàn thể sinh viên về việc giữ gìn vệ sinh tại các khu vực sinh hoạt chung.",
      time: "25/10/2023",
      isRead: true,
    },
    {
      id: "4",
      type: "bug",
      title: "Lịch phun thuốc diệt côn trùng",
      content:
        "BQL sẽ tiến hành phun thuốc diệt muỗi và côn trùng toàn bộ các phòng ở.",
      time: "22/10/2023",
      isRead: true,
    },
  ];

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "power":
        return "power-off";
      case "document":
        return "description"; // edit_document -> description
      case "cleaning":
        return "cleaning-services";
      case "bug":
        return "bug-report";
      default:
        return "notifications";
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
      navigation.navigate("NotificationDetail", { id: item.id });
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
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.id)}
        delayLongPress={300}
        style={[
          styles.itemContainer,
          item.isRead && styles.itemRead,
          isSelected && styles.selectedItem,
        ]}
      >
        <View style={styles.itemContentWrapper}>
          <View
            style={[
              styles.iconContainer,
              !item.isRead ? styles.iconUnread : styles.iconRead,
            ]}
          >
            <MaterialIcons
              name={getIcon(item.type) as any}
              size={24}
              color={!item.isRead ? "#0ea5e9" : "#475569"}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                !item.isRead ? styles.titleUnread : styles.titleRead,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.content} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          {isSelectionMode && (
            <View style={styles.checkboxContainer}>
              <MaterialIcons
                name={isSelected ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={isSelected ? "#0ea5e9" : "#94a3b8"}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {!isSelectionMode ? (
        <BottomNav role="student" />
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
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: {
    width: 40,
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
    backgroundColor: "transparent",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 8,
  },
  itemContainer: {
    backgroundColor: "#ffffff", // transparent in web but usually white in mobile lists
    borderRadius: 12,
    padding: 12,
    // Add shadow/border for better visibility on mobile
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemRead: {
    opacity: 0.7,
    backgroundColor: "#f1f5f9",
  },
  itemContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconUnread: {
    backgroundColor: "#e0f2fe", // bg-primary/20
  },
  iconRead: {
    backgroundColor: "#e2e8f0", // bg-slate-200
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: "#0f172a",
  },
  titleUnread: {
    fontWeight: "600",
  },
  titleRead: {
    fontWeight: "400",
  },
  content: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  selectedItem: {
    backgroundColor: "#e2e8f0",
    borderColor: "#0ea5e9",
  },
  checkboxContainer: {
    marginLeft: 8,
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

export default Notifications;
