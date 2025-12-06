import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerSpecialRequestDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerSpecialRequestDetail"
>;

type ManagerSpecialRequestDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ManagerSpecialRequestDetail"
>;

interface Props {
  navigation: ManagerSpecialRequestDetailScreenNavigationProp;
  route: ManagerSpecialRequestDetailScreenRouteProp;
}

const ManagerSpecialRequestDetail = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [adminNotes, setAdminNotes] = useState("");

  // Mock Data - In a real app, fetch based on ID
  const requestDetails = {
    id: "DK0815",
    studentName: "Nguyễn Văn An",
    studentId: "20210001",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBUB4OH9hQqt9TwjTSLMe-VYpomezF0ksqgoVFoEhjCp1w1pm4HmODYFrzfLFlkJoNQ9m9U5_CDo7eEkMAZXiuM06Z2Ay_OJ2jdW11r1DMnAMmHpWX3VTeqCRyvoUMcm_12CERIlfHBwRrq48M9zMYfUmQFxt-wNrnDHI2r8y2PCPTf69OrtWuI0ECdKVUi-xJr_-6zO1aytIttFb8Jfamcbw4f3ZVl2kLm1t-meScljaLKXWdyRz8IcQkuBvKRFg2mPPYiRQl0es",
    status: "pending",
    roomType: "Phòng 4 người, khép kín",
    desiredBuilding: "Tòa nhà B5",
    submissionDate: "15/08/2024",
    circumstance:
      "Gia đình em thuộc diện hộ nghèo, có giấy xác nhận của địa phương. Bố mẹ em tuổi đã cao và sức khỏe yếu, không thể lao động nặng. Em là lao động chính trong nhà nên rất mong được nhà trường xem xét hỗ trợ chỗ ở để giảm bớt gánh nặng chi phí.",
    attachments: [
      {
        name: "giay_xac_nhan.pdf",
        size: "1.2 MB",
        type: "pdf",
      },
      {
        name: "anh_so_ho_ngheo.jpg",
        size: "3.5 MB",
        type: "image",
      },
    ],
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xử lý", color: "#d97706", bg: "#fef3c7" }; // amber-700, amber-100
      case "approved":
        return { label: "Đã duyệt", color: "#16a34a", bg: "#dcfce7" };
      case "rejected":
        return { label: "Từ chối", color: "#dc2626", bg: "#fee2e2" };
      default:
        return { label: "Không xác định", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const statusInfo = getStatusInfo(requestDetails.status);

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
        <Text style={styles.headerTitle}>
          Chi tiết Đơn #{requestDetails.id}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Student Info */}
        <View style={styles.section}>
          <View style={styles.studentCard}>
            <Image
              source={{ uri: requestDetails.avatarUrl }}
              style={styles.avatar}
            />
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {requestDetails.studentName}
              </Text>
              <Text style={styles.studentId}>
                MSSV: {requestDetails.studentId}
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusInfo.color },
                ]}
              />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Registration Details */}
        <View style={styles.section}>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loại phòng</Text>
              <Text style={styles.detailValue}>{requestDetails.roomType}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tòa mong muốn</Text>
              <Text style={styles.detailValue}>
                {requestDetails.desiredBuilding}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ngày nộp đơn</Text>
              <Text style={styles.detailValue}>
                {requestDetails.submissionDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Special Circumstances */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Lý do và Hoàn cảnh đặc biệt</Text>
            <Text style={styles.circumstanceText}>
              {requestDetails.circumstance}
            </Text>
          </View>
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Minh chứng đính kèm</Text>
            <View style={styles.attachmentList}>
              {requestDetails.attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <View
                    style={[
                      styles.attachmentIconContainer,
                      file.type === "pdf"
                        ? { backgroundColor: "#fee2e2" }
                        : { backgroundColor: "#dbeafe" },
                    ]}
                  >
                    <MaterialIcons
                      name={file.type === "pdf" ? "description" : "image"}
                      size={24}
                      color={file.type === "pdf" ? "#dc2626" : "#2563eb"}
                    />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{file.name}</Text>
                    <Text style={styles.attachmentSize}>{file.size}</Text>
                  </View>
                  <TouchableOpacity style={styles.downloadButton}>
                    <MaterialIcons name="download" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Admin Notes */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ghi chú của người duyệt</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Nhập lý do phê duyệt, từ chối hoặc thông tin cần bổ sung..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={adminNotes}
              onChangeText={setAdminNotes}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveButton}>
            <Text style={styles.approveButtonText}>Phê duyệt</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.requestInfoButton}>
          <Text style={styles.requestInfoText}>Yêu cầu thêm thông tin</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: "#e2e8f0",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  circumstanceText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
  attachmentList: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  attachmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: "#64748b",
  },
  downloadButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  notesInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    fontSize: 14,
    color: "#0f172a",
    minHeight: 100,
  },
  footer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  requestInfoButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  requestInfoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563eb",
  },
});

export default ManagerSpecialRequestDetail;
