import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerTermScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerTerm"
>;

interface Props {
  navigation: ManagerTermScreenNavigationProp;
}

interface TermItem {
  id: string;
  title: string;
  status: "active" | "upcoming" | "ended";
  regular: { start: string; end: string };
  special: { start: string; end: string };
  extension: { start: string; end: string };
}

const ManagerTerm = ({ navigation }: Props) => {
  const terms: TermItem[] = [
    {
      id: "1",
      title: "Học kỳ I 2024-2025",
      status: "active",
      regular: { start: "08:00 01/08/2024", end: "17:00 15/08/2024" },
      special: { start: "08:00 25/07/2024", end: "17:00 31/07/2024" },
      extension: { start: "08:00 16/08/2024", end: "17:00 20/08/2024" },
    },
    {
      id: "2",
      title: "Học kỳ II 2024-2025",
      status: "upcoming",
      regular: { start: "08:00 01/01/2025", end: "17:00 15/01/2025" },
      special: { start: "08:00 25/12/2024", end: "17:00 31/12/2024" },
      extension: { start: "08:00 16/01/2025", end: "17:00 20/01/2025" },
    },
    {
      id: "3",
      title: "Học kỳ Hè 2024",
      status: "ended",
      regular: { start: "08:00 01/06/2024", end: "17:00 15/06/2024" },
      special: { start: "08:00 25/05/2024", end: "17:00 31/05/2024" },
      extension: { start: "08:00 16/06/2024", end: "17:00 20/06/2024" },
    },
  ];

  const getStatusInfo = (status: TermItem["status"]) => {
    switch (status) {
      case "active":
        return { label: "Đang diễn ra", bg: "#dcfce7", text: "#15803d" };
      case "upcoming":
        return { label: "Sắp diễn ra", bg: "#f1f5f9", text: "#475569" };
      case "ended":
        return { label: "Đã kết thúc", bg: "#fef3c7", text: "#b45309" };
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa kỳ đăng ký này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => console.log("Deleted term", id),
      },
    ]);
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
        <Text style={styles.headerTitle}>Quản lý kỳ ở</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {terms.map((term) => {
          const statusInfo = getStatusInfo(term.status);
          return (
            <View key={term.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{term.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusInfo.bg },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusInfo.text },
                    ]}
                  />
                  <Text style={[styles.statusText, { color: statusInfo.text }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#94a3b8"
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Đăng ký thông thường</Text>
                    <Text style={styles.infoValue}>
                      Mở: {term.regular.start} - Đóng: {term.regular.end}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="verified-user"
                    size={20}
                    color="#136dec"
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Đơn hoàn cảnh đặc biệt</Text>
                    <Text style={styles.infoValue}>
                      Mở: {term.special.start} - Đóng: {term.special.end}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="autorenew"
                    size={20}
                    color="#f97316"
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Gia hạn chỗ ở</Text>
                    <Text style={styles.infoValue}>
                      Mở: {term.extension.start} - Đóng: {term.extension.end}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("ManagerTermDetail", {
                      mode: "edit",
                      term,
                    })
                  }
                >
                  <MaterialIcons name="edit" size={20} color="#136dec" />
                  <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(term.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#ef4444" />
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() =>
            navigation.navigate("ManagerTermDetail", { mode: "create" })
          }
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
          <Text style={styles.createButtonText}>Tạo kỳ đăng ký mới</Text>
        </TouchableOpacity>
      </View>
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
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
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
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  infoValue: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#136dec",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#136dec",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#136dec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default ManagerTerm;
