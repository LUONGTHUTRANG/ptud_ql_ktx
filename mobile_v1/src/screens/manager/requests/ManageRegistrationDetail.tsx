import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { useTranslation } from "react-i18next";
import {
  getRegistrationById,
  updateRegistrationStatus,
} from "../../../services/registrationApi";

type ManageRegistrationDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManageRegistrationDetail"
>;

type ManageRegistrationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ManageRegistrationDetail"
>;

interface Props {
  navigation: ManageRegistrationDetailScreenNavigationProp;
  route: ManageRegistrationDetailScreenRouteProp;
}

const API_BASE_URL = "http://192.168.1.67:5000";

const ManageRegistrationDetail = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { id } = route.params;
  const [adminNotes, setAdminNotes] = useState("");
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isPriority = requestDetails?.registration_type === "PRIORITY";
  const isNormal = requestDetails?.registration_type === "NORMAL";
  const invoiceStatus = requestDetails?.invoice_status;
  const canApproveNormal = invoiceStatus === "PAID";

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await getRegistrationById(id);
      setRequestDetails(data);
      if (data.admin_note) {
        setAdminNotes(data.admin_note);
      }
    } catch (error) {
      console.error("Failed to fetch registration details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      setLoading(true);
      await updateRegistrationStatus(id, status, adminNotes);
      Alert.alert("Thành công", "Cập nhật trạng thái thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Failed to update registration status", error);
      Alert.alert(t("common.error"), "Không thể cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: t("manageRegistration.pending"),
          color: "#d97706",
          bg: "#fef3c7",
        };
      case "APPROVED":
        return {
          label: t("manageRegistration.approved"),
          color: "#16a34a",
          bg: "#dcfce7",
        };
      case "REJECTED":
        return {
          label: t("manageRegistration.rejected"),
          color: "#dc2626",
          bg: "#fee2e2",
        };
      case "RETURN":
        return {
          label: t("manageRegistration.return"),
          color: "#ca8a04",
          bg: "#fef9c3",
        };
      case "COMPLETED":
        return {
          label: t("manageRegistration.completed"),
          color: "#2563eb",
          bg: "#dbeafe",
        };
      default:
        return { label: "Không xác định", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const getCircumstanceText = (category: string) => {
    switch (category) {
      case "POOR_HOUSEHOLD":
        return t("registration.poorHousehold");
      case "DISABILITY":
        return t("registration.disability");
      case "OTHER":
        return t("registration.other");
      default:
        return category;
    }
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return "image";
    if (ext === "pdf") return "picture-as-pdf";
    if (["doc", "docx"].includes(ext || "")) return "description";
    return "attach-file";
  };

  const handleApprove = async () => {
    try {
      setLoading(true);

      if (isNormal) {
        // NORMAL: chỉ update status
        await updateRegistrationStatus(id, "COMPLETED", adminNotes);
        Alert.alert(
          t("common.success"),
          t("registration.registrationApproved")
        );
        navigation.goBack();
        return;
      }

      if (isPriority) {
        // PRIORITY: duyệt xong → sang phân phòng
        await updateRegistrationStatus(id, "APPROVED", adminNotes);

        navigation.replace("ManageAssignRoom", {
          registration: requestDetails,
        });
      }
    } catch (e) {
      Alert.alert(t("common.error"), "Không thể xử lý yêu cầu");
    } finally {
      setLoading(false);
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

  if (!requestDetails) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>{t("manageRegistration.noRegistrationDetails")}</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(requestDetails.status);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
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
          {t("registration.registrationDetails")} #{requestDetails.id}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Student Info */}
        <View style={styles.section}>
          <View style={styles.studentCard}>
            <Image
              source={{
                uri: requestDetails.avatar
                  ? requestDetails.avatar
                  : "https://ui-avatars.com/api/?name=" +
                    requestDetails.student_name,
              }}
              style={styles.avatar}
            />
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {requestDetails.student_name}
              </Text>
              <Text style={styles.studentId}>
                {t("student.studentId")}: {requestDetails.mssv}
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
              {isPriority && (
                <>
                  <Text style={styles.detailLabel}>{t("room.roomType")}</Text>
                  <Text style={styles.detailValue}>
                    {t("room.standardRoom")}
                  </Text>
                </>
              )}
              {isNormal && (
                <>
                  <Text style={styles.detailLabel}>{t("room.roomName")}</Text>
                  <Text style={styles.detailValue}>
                    {requestDetails.room_number}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t("registration.expectedBuilding")}
              </Text>
              <Text style={styles.detailValue}>
                {requestDetails.building_name || t("common.none")}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t("registration.submissionDate")}
              </Text>
              <Text style={styles.detailValue}>
                {new Date(requestDetails.created_at).toLocaleDateString(
                  "vi-VN"
                )}
              </Text>
            </View>
            {isNormal && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t("registration.paymentStatus")}
                  </Text>
                  <Text style={styles.detailValue}>
                    {invoiceStatus === "PAID"
                      ? t("invoice.paid")
                      : t("invoice.unpaid")}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Special Circumstances */}
        {isPriority && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t("manageRegistration.priority")}
              </Text>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                {getCircumstanceText(requestDetails.priority_category)}
              </Text>
              <Text style={styles.circumstanceText}>
                {requestDetails.priority_description}
              </Text>
            </View>
          </View>
        )}

        {/* Attachments */}
        {requestDetails.evidence_file_path && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Minh chứng đính kèm</Text>
              <View style={styles.attachmentList}>
                <View style={styles.attachmentItem}>
                  <View
                    style={[
                      styles.attachmentIconContainer,
                      { backgroundColor: "#dbeafe" },
                    ]}
                  >
                    <MaterialIcons
                      name={getFileIcon(requestDetails.evidence_file_path)}
                      size={24}
                      color="#2563eb"
                    />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {requestDetails.evidence_file_path.split("/").pop()}
                    </Text>
                    <Text style={styles.attachmentSize}>Tệp đính kèm</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => {
                      const url = `${API_BASE_URL}/${requestDetails.evidence_file_path}`;
                      Linking.openURL(url);
                    }}
                  >
                    <MaterialIcons
                      name="open-in-new"
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Admin Notes */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {t("registration.adminNotes")}
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t("registration.enterAdminNotes")}
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={adminNotes}
              onChangeText={setAdminNotes}
            />
          </View>
        </View>

        {/* Warning for NORMAL if invoice not PAID */}
        {isNormal && invoiceStatus !== "PAID" && (
          <View style={styles.warningBox}>
            <MaterialIcons name="warning" size={20} color="#dc2626" />
            <Text style={styles.warningText}>
              {t("registration.cannotApproveNormalUnpaid")}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {requestDetails.status !== "COMPLETED" && (
        <View style={styles.footer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleUpdateStatus("REJECTED")}
            >
              <Text style={styles.rejectButtonText}>
                {t("registration.reject")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.approveButton,
                isNormal && !canApproveNormal && styles.disabledButton,
              ]}
              disabled={isNormal && !canApproveNormal}
              onPress={handleApprove}
            >
              <Text style={styles.approveButtonText}>
                {isPriority
                  ? t("registration.approveAndAssignRoom")
                  : t("registration.approve")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.requestInfoButton}
            onPress={() => handleUpdateStatus("RETURN")}
          >
            <Text style={styles.requestInfoText}>
              {t("registration.requestInfo")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  warningText: {
    marginLeft: 8,
    color: "#991b1b",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
  disabledButton: {
    backgroundColor: "#999999",
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

export default ManageRegistrationDetail;
