import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import { Bill, MenuItem, User } from "../../../models";
import { getMe } from "../../../services/authApi";
import { getRoomById } from "../../../services/roomApi";
import { getBuildingById } from "../../../services/buildingApi";
import { studentApi } from "../../../services/studentApi";
import { fetchInvoices } from "../../../services/invoiceApi";
import { notificationApi } from "../../../services/notificationApi";
import { getAvatarInitials } from "../../../utils/avatarHelper";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Home = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  console.log("Rendering Home Screen");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Get current user
        const userData = await getMe();
        console.log("User Data:", userData);

        // Get unread notification count
        try {
          const count = await notificationApi.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.warn("Failed to fetch unread count:", error);
          setUnreadCount(0);
        }

        let roomName = t("common.noData");
        let buildingName = t("common.noData");
        let roommateName = t("common.noData");

        // 2. Get room and building info if user has a room
        if (userData.current_room_id) {
          const roomData = await getRoomById(userData.current_room_id);
          roomName = roomData.room_number;

          if (roomData.building_id) {
            const buildingData = await getBuildingById(roomData.building_id);
            buildingName = buildingData.name;
          }

          // 3. Get roommates
          const studentsInRoom = await studentApi.getStudentsByRoom(
            userData.current_room_id
          );
          const roommates = studentsInRoom.filter(
            (s: any) => s.id !== userData.id
          );
          if (roommates.length > 0) {
            roommateName = roommates.map((s: any) => s.full_name).join(", ");
          }
        }

        setUser({
          name: userData.full_name,
          room: roomName,
          building: buildingName,
          roommate: roommateName,
          avatarUrl: "", // Will be generated from initials
        });

        // 4. Get invoices
        const allInvoices = await fetchInvoices(userData.id);
        console.log("All Invoices:", allInvoices, userData.id);
        // Filter invoices for this student
        const myInvoices = allInvoices.filter(
          (inv: any) => inv.status !== "PAID"
        );

        const formattedBills: Bill[] = myInvoices.map((inv: any) => ({
          id: inv.id.toString(),
          title:
            inv.description ||
            `Hóa đơn ${inv.type === "ROOM_FEE" ? "tiền phòng" : "điện nước"}`,
          status: new Date(inv.due_date) < new Date() ? "overdue" : "pending",
          amount: `${parseInt(inv.amount).toLocaleString("vi-VN")}đ`,
          dueDate: new Date(inv.due_date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }),
          type: inv.type === "UTILITY_FEE" ? "utility" : "room",
        }));

        setBills(formattedBills);
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const menuItems: (MenuItem & { path: keyof RootStackParamList | "#" })[] = [
    {
      icon: "cottage",
      title: t("common.add"),
      subtitle: t("student.studentList"),
      path: "RegisterAccommodation",
    },
    {
      icon: "support-agent",
      title: t("supportRequest.createRequest"),
      subtitle: t("supportRequest.supportRequestList"),
      path: "RequestHistory",
    },
    {
      icon: "autorenew",
      title: t("semester.semesterName"),
      subtitle: t("semester.endDate"),
      path: "ExtendAccommodation",
    },
    {
      icon: "apartment",
      title: t("building.buildingList"),
      subtitle: t("building.buildingDetails"),
      path: "BuildingList",
    },
  ];

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>{t("common.error")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
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
          </View>
          <Text style={styles.greeting}>
            {t("common.greeting")} {user.name}!
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#475569" />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Warning Card */}
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <MaterialIcons name="warning" size={20} color="#ca8a04" />
            <Text style={styles.warningTitle}>{t("common.warning")}</Text>
          </View>
          <Text style={styles.warningSubject}>
            {t("notification.powerCutTitle")}
          </Text>
          <Text style={styles.warningText}>
            {t("notification.powerCutDescription")}
          </Text>
        </View>

        {/* Grid Menu */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (item.path !== "#") {
                  navigation.navigate(item.path as any);
                }
              }}
              style={styles.menuItem}
            >
              <MaterialIcons
                name={item.icon as any}
                size={32}
                color="#0ea5e9"
              />
              <View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Your Room */}
        <TouchableOpacity
          style={styles.roomCard}
          onPress={() => navigation.navigate("RoomMembers")}
        >
          <View style={styles.roomInfo}>
            <View>
              <Text style={styles.roomTitle}>{t("building.yourRoom")}</Text>
              <Text style={styles.roomDetail}>
                {t("building.buildingShort")} {user.building} -{" "}
                {t("room.roomName")} {user.room}
              </Text>
              <Text style={styles.roomDetail}>
                {t("student.roommate")}: {user.roommate}
              </Text>
            </View>
            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText}>{t("common.details")}</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#0ea5e9" />
            </View>
          </View>
          <Image
            source={{ uri: "https://picsum.photos/300/200" }}
            style={styles.roomImage}
          />
        </TouchableOpacity>

        {/* Bills */}
        <View style={styles.billsSection}>
          <Text style={styles.sectionTitle}>
            {t("invoice.billsNeedPayment")}
          </Text>
          <View style={styles.billsList}>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <View
                  key={bill.id}
                  style={[
                    styles.billCard,
                    bill.status === "overdue" && styles.billCardOverdue,
                  ]}
                >
                  <View
                    style={[
                      styles.billIcon,
                      bill.status === "overdue"
                        ? styles.billIconOverdue
                        : styles.billIconPending,
                    ]}
                  >
                    <MaterialIcons
                      name="receipt-long"
                      size={24}
                      color={bill.status === "overdue" ? "#dc2626" : "#64748b"}
                    />
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={styles.billTitle} numberOfLines={1}>
                      {bill.title}
                    </Text>
                    <Text
                      style={[
                        styles.billStatus,
                        bill.status === "overdue"
                          ? styles.billStatusOverdue
                          : styles.billStatusPending,
                      ]}
                    >
                      {bill.status === "overdue"
                        ? t("invoice.overdue")
                        : t("invoice.upcomingDue")}
                    </Text>
                  </View>
                  <View style={styles.billAmount}>
                    <Text style={styles.amountText}>{bill.amount}</Text>
                    <Text style={styles.dueDateText}>
                      {t("common.dueDate")}: {bill.dueDate}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="check-circle" size={40} color="#22c55e" />
                <View>
                  <Text style={styles.emptyTitle}>{t("invoice.noBills")}</Text>
                  <Text style={styles.emptyText}>
                    {t("invoice.billsPaidAll")}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <BottomNav role="student" />
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
    padding: 16,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: "70%",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatar: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for BottomNav
    gap: 24,
  },
  warningCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ca8a04",
  },
  warningSubject: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menuItem: {
    width: "48%", // Approximate for 2 columns with gap
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  roomCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  roomInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  roomDetail: {
    fontSize: 14,
    color: "#64748b",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  roomImage: {
    width: 120,
    height: "100%",
  },
  billsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  billsList: {
    gap: 12,
  },
  billCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 16,
  },
  billCardOverdue: {
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  billIconPending: {
    backgroundColor: "#f1f5f9",
  },
  billIconOverdue: {
    backgroundColor: "#fef2f2",
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  billStatus: {
    fontSize: 12,
  },
  billStatusPending: {
    color: "#64748b",
  },
  billStatusOverdue: {
    color: "#dc2626",
    fontWeight: "500",
  },
  billAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  dueDateText: {
    fontSize: 12,
    color: "#64748b",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  emptyText: {
    fontSize: 12,
    color: "#64748b",
  },
});

export default Home;
