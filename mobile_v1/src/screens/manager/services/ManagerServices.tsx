import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";

type ManagerServicesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerServices"
>;

interface Props {
  navigation: ManagerServicesScreenNavigationProp;
}

const ManagerServices = ({ navigation }: Props) => {
  const services = [
    {
      title: "Quản lý sinh viên",
      description: "Danh sách sinh viên và thông tin chi tiết.",
      icon: "people",
      iconColor: "#2563eb", // text-blue-600
      iconBg: "#dbeafe", // bg-blue-100
      path: "StudentList",
    },
    {
      title: "Quản lý phòng",
      description: "Danh sách tòa nhà và phòng ở.",
      icon: "apartment",
      iconColor: "#0d9488", // text-teal-600
      iconBg: "#ccfbf1", // bg-teal-100
      path: "BuildingList",
    },
    {
      title: "Yêu cầu hỗ trợ",
      description: "Xử lý các yêu cầu sửa chữa từ sinh viên.",
      icon: "support-agent",
      iconColor: "#ea580c", // text-orange-600
      iconBg: "#ffedd5", // bg-orange-100
      path: "ManagerRegularRequest",
    },
    {
      title: "Yêu cầu đặc biệt",
      description: "Duyệt các đơn xin ra vào muộn, vắng mặt...",
      icon: "assignment-late",
      iconColor: "#db2777", // text-pink-600
      iconBg: "#fce7f3", // bg-pink-100
      path: "ManagerSpecialRequest",
    },
    {
      title: "Quản lý hóa đơn",
      description: "Theo dõi tình hình thanh toán điện nước.",
      icon: "receipt-long",
      iconColor: "#9333ea", // text-purple-600
      iconBg: "#f3e8ff", // bg-purple-100
      path: "ManagerBills",
    },
    {
      title: "Quản lý thông báo",
      description: "Tạo và gửi thông báo đến sinh viên.",
      icon: "notifications",
      iconColor: "#ca8a04", // text-yellow-600
      iconBg: "#fef9c3", // bg-yellow-100
      path: "ManagerNotifications",
    },
    {
      title: "Quản lý kỳ ở",
      description: "Thiết lập thời gian và hạn đăng ký.",
      icon: "date-range",
      iconColor: "#4f46e5", // text-indigo-600
      iconBg: "#e0e7ff", // bg-indigo-100
      path: "ManagerTerm",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Quản lý</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (service.path !== "#") {
                  navigation.navigate(service.path as any);
                }
              }}
              style={styles.card}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: service.iconBg },
                ]}
              >
                <MaterialIcons
                  name={service.icon as any}
                  size={32}
                  color={service.iconColor}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDescription}>
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNav role="manager" />
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
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for BottomNav
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    width: "47%", // Approximate for 2 columns with gap
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  textContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
});

export default ManagerServices;
