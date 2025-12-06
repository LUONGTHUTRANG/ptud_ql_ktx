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

type ServicesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Services"
>;

interface Props {
  navigation: ServicesScreenNavigationProp;
}

const Services = ({ navigation }: Props) => {
  const services = [
    {
      title: "Đăng ký ở",
      description: "Bắt đầu quá trình đăng ký chỗ ở mới.",
      icon: "sensor-door",
      iconColor: "#2563eb", // text-blue-600
      iconBg: "#dbeafe", // bg-blue-100
      path: "RegisterAccommodation",
    },
    {
      title: "Gia hạn chỗ ở",
      description: "Tiếp tục hợp đồng cho kỳ học tiếp theo.",
      icon: "autorenew",
      iconColor: "#16a34a", // text-green-600
      iconBg: "#dcfce7", // bg-green-100
      path: "ExtendAccommodation",
    },
    {
      title: "Yêu cầu hỗ trợ",
      description: "Báo cáo sự cố hoặc yêu cầu giúp đỡ.",
      icon: "support-agent",
      iconColor: "#ea580c", // text-orange-600
      iconBg: "#ffedd5", // bg-orange-100
      path: "RequestHistory",
    },
    {
      title: "Thanh toán",
      description: "Xem và thanh toán các hóa đơn của bạn.",
      icon: "receipt-long",
      iconColor: "#9333ea", // text-purple-600
      iconBg: "#f3e8ff", // bg-purple-100
      path: "Bills",
    },
    {
      title: "Lịch sử",
      description: "Tra cứu các giao dịch thanh toán đã thực hiện.",
      icon: "history",
      iconColor: "#dc2626", // text-red-600
      iconBg: "#fee2e2", // bg-red-100
      path: "TransactionHistory",
    },
    {
      title: "Tòa nhà & phòng",
      description: "Xem thông tin chi tiết về ký túc xá.",
      icon: "apartment",
      iconColor: "#0d9488", // text-teal-600
      iconBg: "#ccfbf1", // bg-teal-100
      path: "BuildingList",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Dịch vụ</Text>
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

export default Services;
