import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import { RouteProp } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { updateInvoiceStatus } from "@/src/services/invoiceApi";
import ConfirmModal from "@/src/components/ConfirmModal";

type ManagerBillDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerBillDetail"
>;

type ManagerBillDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ManagerBillDetail"
>;

interface Props {
  navigation: ManagerBillDetailScreenNavigationProp;
  route: ManagerBillDetailScreenRouteProp;
}

const ManagerBillDetail = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const { invoice, onRefresh } = route.params;
  console.log("Invoice Details:", invoice);
  const [adminNote, setAdminNote] = useState("");

  const isSubmitted =
    (invoice.status ?? invoice.invoice_status) === "SUBMITTED";
  const isPaid = (invoice.status ?? invoice.invoice_status) === "PAID";
  const invoiceAmount = invoice.amount ?? invoice.total_amount;
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "PAID" | "UNPAID" | "SUBMITTED"
  >("UNPAID");

  const formatMoney = (value: string) =>
    Number(value).toLocaleString("locale") + " VNĐ";

  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleString("locale") : "--";

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateInvoiceStatus(
        invoice.invoice_code,
        newStatus as "PAID" | "UNPAID" | "SUBMITTED"
      );
      onRefresh?.();
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update invoice status:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {invoice.type === "ROOM_FEE" ? t("manageBills.roomBills") : t("manageBills.utilityBills")}
          </Text>
          <View style={styles.iconButton}></View>
        </View>
      </View>

      {/* Warning */}
      {!isPaid && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            {t("manageBills.hasNotPaid")}
          </Text>
        </View>
      )}

      {isPaid && (
        <View style={styles.statusPaidBox}>
          <Text style={styles.statusPaidText}>{t("manageBills.hasPaid")}</Text>
        </View>
      )}

      {/* Student Info */}
      {invoice.type === "ROOM_FEE" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("student.studentInfo")}</Text>
          <Text style={styles.row}>{t("student.studentName")}: {invoice.student_name}</Text>
          <Text style={styles.row}>
            {t("student.studentId")}: {invoice.mssv}
          </Text>
        </View>
      )}

      {/* Room Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("building.buildingAndRoom")}</Text>
        <Text style={styles.row}>{t("building.building")}: {invoice.building_name}</Text>
        <Text style={styles.row}>{t("room.roomNumber")}: {invoice.room_number}</Text>
      </View>

      {/* Invoice Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("invoice.invoiceDetails")}</Text>
        <Text style={styles.row}>{invoice.description}</Text>

        {invoice.invoice_type === "UTILITY_FEE" && (
          <>
            <Text style={styles.sectionTitle}>{t("invoice.electricityIndex")}</Text>
            <Text style={styles.row}>
              {t("invoice.oldIndex")}: {invoice.old_electricity || 0}
            </Text>
            <Text style={styles.row}>
              {t("invoice.newIndex")}: {invoice.current_electricity || 0}
            </Text>
            <Text style={styles.sectionTitle}>{t("invoice.waterIndex")}</Text>
            <Text style={styles.row}>
              {t("invoice.oldIndex")}: {invoice.old_water || 0}
            </Text>
            <Text style={styles.row}>
              {t("invoice.newIndex")}: {invoice.current_water || 0}
            </Text>
          </>
        )}

        <Text style={styles.amount}>{formatMoney(invoiceAmount)}</Text>

        <Text style={styles.row}>
          {t("invoice.issueDate")}: {formatDate(invoice.time_invoiced || invoice.last_updated)}
        </Text>
        <Text style={styles.row}>
          {t("invoice.dueDate")}: {formatDate(invoice.due_date)}
        </Text>
      </View>

      {/* Admin Note */}
      {(isSubmitted || isPaid) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("invoice.adminNote")}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={t("invoice.enterAdminNote")}
            multiline
            value={adminNote}
            onChangeText={setAdminNote}
          />
        </View>
      )}

      {/* Actions */}
      {!isPaid && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => {
              setPendingStatus("UNPAID");
              setConfirmModalVisible(true);
            }}
          >
            <Text style={styles.rejectText}>{t("invoice.unpaid")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => {
              setPendingStatus("PAID");
              setConfirmModalVisible(true);
            }}
          >
            <Text style={styles.approveText}>{t("invoice.paid")}</Text>
          </TouchableOpacity>
        </View>
      )}
      <ConfirmModal
        title="Xác nhận cập nhật trạng thái"
        isOpen={isConfirmModalVisible}
        onConfirm={() => {
          handleUpdateStatus(pendingStatus);
          setConfirmModalVisible(false);
        }}
        onClose={() => setConfirmModalVisible(false)}
        message={`Bạn có chắc chắn muốn cập nhật trạng thái thành "${
          pendingStatus === "PAID" ? "Đã thanh toán" : ""
        }" không?`}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 64,
  },
  iconButton: {
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
  },

  invoiceCode: {
    color: "#64748b",
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusPaid: { backgroundColor: "#16a34a" },
  statusSubmitted: { backgroundColor: "#2563eb" },
  statusUnpaid: { backgroundColor: "#dc2626" },

  warningBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#fee2e2",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: {
    color: "#991b1b",
    flex: 1,
  },

  statusPaidBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#dcfce7",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  statusPaidText: {
    color: "#16a34a",
    flex: 1,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    marginBottom: 4,
    color: "#334155",
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#16a34a",
    marginVertical: 8,
  },

  attachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  attachmentText: {
    color: "#2563eb",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#fee2e2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  rejectText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  approveBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  approveText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ManagerBillDetail;
