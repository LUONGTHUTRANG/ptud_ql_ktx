import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";

type RequestDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RequestDetail"
>;
type RequestDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "RequestDetail"
>;

interface Props {
  navigation: RequestDetailScreenNavigationProp;
  route: RequestDetailScreenRouteProp;
}

const RequestDetail = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [role, setRole] = useState<"student" | "manager">("student");

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        if (storedRole === "manager" || storedRole === "student") {
          setRole(storedRole);
        }
      } catch (e) {
        console.error("Failed to load role", e);
      }
    };
    loadRole();
  }, []);

  // Mock Data matching the design
  const request = {
    id: id || "YC-12345",
    code: "YC-12345",
    type: "Sửa chữa điện",
    date: "25/10/2023",
    status: "pending",
    statusText: "Đang chờ xử lý",
    description:
      "Bóng đèn trong phòng tắm bị cháy và không thể sử dụng được. Vui lòng hỗ trợ thay thế bóng đèn mới. Xin cảm ơn.",
    images: [
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=200&auto=format&fit=crop",
    ],
    timeline: [
      {
        status: "Đang xử lý",
        time: "26/10/2023 09:15",
        user: "Lê Minh",
        comment:
          "Đã tiếp nhận và sẽ cử nhân viên kỹ thuật đến kiểm tra trong hôm nay.",
        active: true,
        icon: "autorenew",
        color: "blue",
      },
      {
        status: "Đã gửi yêu cầu",
        time: "25/10/2023 20:30",
        user: "Bạn",
        active: false,
        icon: "receipt-long", // receipt_long -> receipt-long
        color: "slate",
      },
    ],
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
        <Text style={styles.headerTitle}>Chi tiết Yêu cầu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Information Card */}
        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã yêu cầu:</Text>
              <Text style={styles.infoValue}>{request.code}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loại yêu cầu:</Text>
              <Text style={styles.infoValue}>{request.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày gửi:</Text>
              <Text style={styles.infoValue}>{request.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{request.statusText}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Section Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.description}>{request.description}</Text>

          {/* Image Gallery */}
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>Ảnh đính kèm</Text>
            <View style={styles.galleryGrid}>
              {request.images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={styles.galleryImage}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Timeline/History Log Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch sử cập nhật</Text>
          <View style={styles.timelineContainer}>
            {/* Vertical Line */}
            <View style={styles.timelineLine} />

            {request.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineIconContainer,
                    {
                      backgroundColor:
                        item.color === "blue" ? "#3b82f6" : "#94a3b8",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={16}
                    color="#ffffff"
                  />
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStatus,
                      { color: item.color === "blue" ? "#2563eb" : "#1e293b" },
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Text style={styles.timelineMeta}>
                    {item.time} - Bởi: {item.user}
                  </Text>

                  {item.comment && (
                    <View style={styles.timelineComment}>
                      <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons - Only visible to Managers */}
          {role === "manager" && (
            <View style={styles.managerActions}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Hủy Yêu cầu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.respondButton}>
                <Text style={styles.respondButtonText}>Gửi Phản Hồi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  statusBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#b45309",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  galleryContainer: {
    marginTop: 16,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  galleryImage: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  timelineContainer: {
    marginTop: 16,
    paddingLeft: 8,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 19, // Center of the icon (22/2 + 8 paddingLeft)
    top: 8,
    bottom: 0,
    width: 2,
    backgroundColor: "#e2e8f0",
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    position: "relative",
  },
  timelineIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timelineMeta: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  timelineComment: {
    marginTop: 8,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  commentText: {
    fontSize: 14,
    color: "#334155",
  },
  managerActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  rejectButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "bold",
  },
  respondButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  respondButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RequestDetail;
