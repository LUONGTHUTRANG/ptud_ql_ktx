import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import {
  getSupportRequestById,
  updateSupportRequestStatus,
} from "../../../services/requestApi";

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
  const [role, setRole] = useState<"student" | "manager" | "admin">("student");
  const [userId, setUserId] = useState<number | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Response Modal State
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [responseStatus, setResponseStatus] = useState<
    "PROCESSING" | "COMPLETED" | "CANCELLED"
  >("PROCESSING");
  const [responseContent, setResponseContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRoleAndUser = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedRole === "manager" || storedRole === "admin" || storedRole === "student") {
          setRole(storedRole);
        }

        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user.id);
        }
      } catch (e) {
        console.error("Failed to load role or user", e);
      }
    };
    loadRoleAndUser();
  }, []);

  const fetchRequestDetail = async () => {
    try {
      const data = await getSupportRequestById(id);

      // Map backend data to UI format
      const mappedRequest = {
        id: data.id.toString(),
        code: `REQ${data.id}`,
        type: getTypeText(data.type), // Map from data.type to Vietnamese
        title: data.title, // Add title
        date: new Date(data.created_at).toLocaleDateString("vi-VN"),
        status: data.status.toLowerCase(),
        statusText: getStatusText(data.status),
        description: data.content,
        images: data.attachment_url ? [data.attachment_url] : [],
        timeline: [
          // Create timeline based on status and dates
          ...(data.status === "COMPLETED" ||
          data.status === "PROCESSING" ||
          data.status === "CANCELLED"
            ? [
                {
                  status: getStatusText(data.status),
                  time: new Date(
                    data.updated_at || data.created_at
                  ).toLocaleString("vi-VN"),
                  user: data.manager_name || "Quản lý",
                  comment:
                    data.response_content || getStatusComment(data.status),
                  active: true,
                  icon: getStatusIcon(data.status),
                  color: getStatusColor(data.status),
                },
              ]
            : []),
          {
            status: "Đã gửi yêu cầu",
            time: new Date(data.created_at).toLocaleString("vi-VN"),
            user: data.student_name || "Bạn",
            active: data.status === "PENDING",
            icon: "receipt-long",
            color: "slate",
          },
        ],
      };

      setRequest(mappedRequest);
    } catch (error) {
      console.error("Failed to fetch request detail", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequestDetail();
    }
  }, [id]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy/Từ chối";
      default:
        return status;
    }
  };

  const getStatusComment = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "Yêu cầu đang được xử lý.";
      case "COMPLETED":
        return "Yêu cầu đã được giải quyết.";
      case "CANCELLED":
        return "Yêu cầu đã bị từ chối hoặc hủy bỏ.";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "autorenew";
      case "COMPLETED":
        return "check-circle";
      case "CANCELLED":
        return "cancel";
      default:
        return "info";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "slate";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "repair":
      case "REPAIR":
        return "Sửa chữa";
      case "complaint":
      case "COMPLAINT":
        return "Khiếu nại";
      case "proposal":
      case "PROPOSAL":
        return "Đề xuất";
      default:
        return type;
    }
  };

  const handleOpenResponse = (
    status: "PROCESSING" | "COMPLETED" | "CANCELLED"
  ) => {
    setResponseStatus(status);
    setResponseContent("");
    setResponseModalVisible(true);
  };

  const handleSendResponse = async () => {
    if (!responseContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung phản hồi");
      return;
    }

    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    setSubmitting(true);
    try {
      await updateSupportRequestStatus(id, {
        status: responseStatus,
        manager_id: userId,
        response_content: responseContent,
      });

      Alert.alert("Thành công", "Đã gửi phản hồi", [
        {
          text: "OK",
          onPress: () => {
            setResponseModalVisible(false);
            // Refresh data
            fetchRequestDetail();
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating support request status:", error);
      Alert.alert("Lỗi", "Không thể gửi phản hồi");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!request) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Không tìm thấy thông tin yêu cầu</Text>
      </View>
    );
  }

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
          <Text style={styles.sectionTitle}>Tiêu đề</Text>
          <Text
            style={[
              styles.description,
              { marginBottom: 16, fontWeight: "600" },
            ]}
          >
            {request.title}
          </Text>

          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.description}>{request.description}</Text>

          {/* Image Gallery */}
          {request.images && request.images.length > 0 && (
            <View style={styles.galleryContainer}>
              <Text style={styles.sectionTitle}>Ảnh đính kèm</Text>
              <View style={styles.galleryGrid}>
                {request.images.map((img: any, idx: any) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedImage(img)}
                  >
                    <Image source={{ uri: img }} style={styles.galleryImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Timeline/History Log Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch sử cập nhật</Text>
          <View style={styles.timelineContainer}>
            {/* Vertical Line */}
            <View style={styles.timelineLine} />

            {request.timeline.map((item: any, index: any) => (
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
          {(role === "manager" || role === "admin") && (
            <View style={styles.managerActions}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleOpenResponse("CANCELLED")}
              >
                <Text style={styles.rejectButtonText}>Hủy Yêu cầu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.respondButton}
                onPress={() => handleOpenResponse("PROCESSING")}
              >
                <Text style={styles.respondButtonText}>Gửi Phản Hồi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage || "" }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Response Modal */}
      <Modal
        visible={responseModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setResponseModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.responseModalContainer}
        >
          <View style={styles.responseModalContent}>
            <View style={styles.responseModalHeader}>
              <Text style={styles.responseModalTitle}>Gửi Phản Hồi</Text>
              <TouchableOpacity onPress={() => setResponseModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Trạng thái mới:</Text>
            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  responseStatus === "PROCESSING"
                    ? { backgroundColor: "#fb923c", borderColor: "#fb923c" }
                    : { borderColor: "#fb923c", backgroundColor: "#fff" },
                ]}
                onPress={() => setResponseStatus("PROCESSING")}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    responseStatus === "PROCESSING"
                      ? { color: "#fff" }
                      : { color: "#fb923c" },
                  ]}
                >
                  Đang xử lý
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  responseStatus === "COMPLETED"
                    ? { backgroundColor: "#4ade80", borderColor: "#4ade80" }
                    : { borderColor: "#4ade80", backgroundColor: "#fff" },
                ]}
                onPress={() => setResponseStatus("COMPLETED")}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    responseStatus === "COMPLETED"
                      ? { color: "#fff" }
                      : { color: "#16a34a" },
                  ]}
                >
                  Hoàn thành
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  responseStatus === "CANCELLED"
                    ? { backgroundColor: "#ef4444", borderColor: "#ef4444" }
                    : { borderColor: "#ef4444", backgroundColor: "#fff" },
                ]}
                onPress={() => setResponseStatus("CANCELLED")}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    responseStatus === "CANCELLED"
                      ? { color: "#fff" }
                      : { color: "#ef4444" },
                  ]}
                >
                  Hủy bỏ
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nội dung phản hồi:</Text>
            <TextInput
              style={styles.responseInput}
              multiline
              placeholder="Nhập nội dung phản hồi cho sinh viên..."
              value={responseContent}
              onChangeText={setResponseContent}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSendResponse}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Gửi Phản Hồi</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    width: 100,
    height: 100,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
  responseModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  responseModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  responseModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  responseModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 12,
  },
  statusOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  statusOptionActive: {
    backgroundColor: "#f8fafc",
    borderWidth: 2,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  responseInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    height: 120,
    backgroundColor: "#f8fafc",
    fontSize: 14,
    color: "#0f172a",
  },
  submitButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RequestDetail;
