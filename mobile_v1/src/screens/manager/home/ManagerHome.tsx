import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import { managerApi } from "../../../services/managerApi";
import { notificationApi } from "../../../services/notificationApi";
import { getAvatarInitials } from "../../../utils/avatarHelper";

type ManagerHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerHome"
>;

interface Props {
  navigation: ManagerHomeScreenNavigationProp;
}

const ManagerHome = ({ navigation }: Props) => {
  const [user, setUser] = useState({
    name: "",
    avatarUrl: "",
  });

  const [userRole, setUserRole] = useState<"admin" | "manager" | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    emptyRooms: 0,
    newRegistrations: 0,
    pendingRequests: 0,
    overdueInvoices: 0,
    totalCapacity: 1, // Avoid division by zero
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log("Parsed User:", parsedUser);
            setUser({
              name: parsedUser.fullName,
              avatarUrl: "", // Will be generated from initials
            });
          }

          const role = await AsyncStorage.getItem("role");
          setUserRole(role as "admin" | "manager");

          // Get unread notification count
          try {
            const count = await notificationApi.getUnreadCount();
            setUnreadCount(count);
          } catch (error) {
            console.warn("Failed to fetch unread count:", error);
            setUnreadCount(0);
          }

          const data = await managerApi.getDashboardStats();
          setStatsData({
            ...data,
            totalCapacity: data.totalCapacity || 1,
          });
        } catch (error) {
          console.error("Failed to fetch dashboard stats", error);
        }
      };

      fetchData();
    }, [])
  );

  const stats = [
    {
      label: "Tổng sinh viên",
      value: statsData.totalStudents.toString(),
      color: "#0f172a",
    },
    {
      label: "Phòng trống",
      value: statsData.emptyRooms.toString(),
      color: "#0f172a",
    },
    {
      label: "Đơn đăng ký mới",
      value: statsData.newRegistrations.toString(),
      color: "#eab308",
    },
    {
      label: "Yêu cầu cần xử lý",
      value: statsData.pendingRequests.toString(),
      color: "#ef4444",
    },
  ];

  const occupancyRate = Math.round(
    (statsData.totalStudents / statsData.totalCapacity) * 100
  );
  const emptySlots = statsData.totalCapacity - statsData.totalStudents;

  const baseQuickAccessItems = [
    {
      title: "Quản lý Tòa nhà",
      icon: "apartment",
      bgColor: "#dbeafe",
      iconColor: "#2563eb",
      path: "BuildingList",
      requiredRole: undefined,
    },
    {
      title: "Quản lý Sinh viên",
      icon: "groups",
      bgColor: "#dcfce7",
      iconColor: "#16a34a",
      path: "StudentList",
      requiredRole: undefined,
    },
    {
      title: "Quản lý Hóa đơn",
      icon: "receipt-long",
      bgColor: "#ffedd5",
      iconColor: "#ea580c",
      path: "ManagerBills",
      requiredRole: undefined,
    },
    {
      title: "Duyệt Đơn",
      icon: "checklist",
      bgColor: "#f3e8ff",
      iconColor: "#9333ea",
      path: "ManagerSpecialRequest",
      requiredRole: undefined,
    },
    {
      title: "Quản lý Thông báo",
      icon: "campaign",
      bgColor: "#fee2e2",
      iconColor: "#dc2626",
      path: "ManagerNotifications",
      requiredRole: undefined,
    },
    {
      title: "Quản lý yêu cầu hỗ trợ",
      icon: "build",
      bgColor: "#e0e7ff",
      iconColor: "#4f46e5",
      path: "ManagerRegularRequest",
      requiredRole: undefined,
    },
  ];

  const quickAccessItems = baseQuickAccessItems.filter((item) => {
    if (item.requiredRole === "admin" && userRole !== "admin") {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user && user.name ? (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: getAvatarInitials(user.name).color,
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {getAvatarInitials(user.name).initials}
              </Text>
            </View>
          ) : (
            <View style={[styles.avatar, { backgroundColor: "#e2e8f0" }]}>
              <Text style={styles.avatarText}>?</Text>
            </View>
          )}
          <Text style={styles.welcomeText}>Chào buổi sáng, {user.name}!</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#475569" />
          {unreadCount > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Warning Section */}
        {statsData.overdueInvoices > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cảnh báo</Text>
            <TouchableOpacity style={styles.warningCard}>
              <View style={styles.warningIconContainer}>
                <MaterialIcons name="receipt-long" size={24} color="#dc2626" />
              </View>
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>
                  {statsData.overdueInvoices} hóa đơn đã quá hạn
                </Text>
                <Text style={styles.warningSubtitle}>
                  Nhấn để xem chi tiết danh sách
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        )}

        {/* Occupancy Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tỷ lệ lấp đầy phòng</Text>
          <View style={styles.occupancyCard}>
            <View style={styles.chartContainer}>
              {/* Simple Circular Progress Representation */}
              <View style={styles.chartCircle}>
                <Text style={styles.chartPercentage}>{occupancyRate}%</Text>
                <Text style={styles.chartLabel}>Đã lấp đầy</Text>
              </View>
            </View>
            <View style={styles.occupancyStats}>
              <View style={styles.occupancyRow}>
                <View style={[styles.dot, { backgroundColor: "#0ea5e9" }]} />
                <Text style={styles.occupancyText}>
                  Đã có người ở: {statsData.totalStudents}
                </Text>
              </View>
              <View style={styles.occupancyRow}>
                <View style={[styles.dot, { backgroundColor: "#e2e8f0" }]} />
                <Text style={styles.occupancyText}>
                  Còn trống: {emptySlots}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate(item.path as any)}
              >
                <View
                  style={[
                    styles.quickAccessIcon,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={28}
                    color={item.iconColor}
                  />
                </View>
                <Text style={styles.quickAccessText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav role="manager" />
    </View>
  );
};

const { width } = Dimensions.get("window");
const gap = 16;
const itemWidth = (width - 32 - gap) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    maxWidth: width - 140,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#f1f5f9",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for BottomNav
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap,
    marginBottom: 24,
  },
  statCard: {
    width: itemWidth,
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
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  warningIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  warningSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  occupancyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  chartContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderLeftColor: "#e2e8f0", // Simulate partial fill
    transform: [{ rotate: "45deg" }], // Rotate to make the gap look like a chart
  },
  chartCircle: {
    transform: [{ rotate: "-45deg" }], // Rotate back text
    alignItems: "center",
  },
  chartPercentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
  },
  chartLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  occupancyStats: {
    width: "100%",
    gap: 8,
  },
  occupancyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  occupancyText: {
    fontSize: 14,
    color: "#334155",
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  quickAccessItem: {
    width: (width - 64) / 3,
    alignItems: "center",
    marginBottom: 8,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
  },
});

export default ManagerHome;
