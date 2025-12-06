import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";

type PaymentDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentDetail"
>;

interface Props {
  navigation: PaymentDetailScreenNavigationProp;
}

const PaymentDetail = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<"account" | "qr">("account");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCopy = (text: string) => {
    Alert.alert("Đã sao chép", `Đã sao chép ${text} vào bộ nhớ tạm`);
  };

  const handleConfirm = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigation.navigate("Home");
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
        <Text style={styles.headerTitle}>Thông tin thanh toán</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>4.000.000 VNĐ</Text>
            <Text style={styles.period}>
              Kỳ hạn thanh toán: Học kỳ 1, 2024-2025
            </Text>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phòng</Text>
              <Text style={styles.detailValue}>Phòng A301</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tòa nhà</Text>
              <Text style={styles.detailValue}>Ký túc xá khu A</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loại phòng</Text>
              <Text style={styles.detailValue}>Phòng 4 người, có máy lạnh</Text>
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Nội dung chuyển khoản:{" "}
              <Text style={styles.noteBold}>NGUYEN VAN A 123456 TT KTX</Text>
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsCard}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab("account")}
              style={[
                styles.tabButton,
                activeTab === "account" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "account" && styles.activeTabText,
                ]}
              >
                Số tài khoản
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("qr")}
              style={[
                styles.tabButton,
                activeTab === "qr" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "qr" && styles.activeTabText,
                ]}
              >
                Mã QR
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "account" ? (
              <View style={styles.accountInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngân hàng</Text>
                  <Text style={styles.infoValue}>Vietcombank</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Chủ tài khoản</Text>
                  <Text style={styles.infoValueUppercase}>
                    Truong Dai Hoc XYZ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Số tài khoản</Text>
                  <View style={styles.accountNumberContainer}>
                    <Text style={styles.infoValue}>1234567890</Text>
                    <TouchableOpacity
                      onPress={() => handleCopy("1234567890")}
                      style={styles.copyButton}
                    >
                      <MaterialIcons
                        name="content-copy"
                        size={20}
                        color="#0ea5e9"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.helperText}>
                  Vui lòng ghi đúng nội dung chuyển khoản để được xác nhận nhanh
                  chóng.
                </Text>
              </View>
            ) : (
              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <Image
                    source={{
                      uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePaymentData",
                    }}
                    style={styles.qrImage}
                  />
                </View>
                <Text style={styles.qrHelperText}>
                  Quét mã QR trên bằng ứng dụng ngân hàng của bạn để thanh toán
                  nhanh chóng.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Xác nhận đã thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        onConfirm={handleCloseSuccess}
        title="Đã gửi xác nhận"
        message="Hệ thống đã ghi nhận yêu cầu xác nhận thanh toán của bạn. Vui lòng chờ Ban quản lý duyệt trong 24h."
        confirmLabel="Về trang chủ"
        cancelLabel=""
        variant="success"
      />
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
    flexGrow: 1,
    padding: 16,
    gap: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0ea5e9",
    marginBottom: 4,
  },
  period: {
    fontSize: 14,
    color: "#64748b",
  },
  detailsList: {
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    textAlign: "right",
  },
  noteContainer: {
    marginTop: 20,
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#0ea5e9",
    textAlign: "center",
  },
  noteBold: {
    fontWeight: "bold",
  },
  methodsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f1f5f9",
    margin: 8,
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "#0ea5e9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#ffffff",
  },
  tabContent: {
    padding: 20,
    paddingTop: 12,
  },
  accountInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  infoValueUppercase: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  accountNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  copyButton: {
    padding: 4,
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
  },
  helperText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  qrContainer: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  qrWrapper: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  qrHelperText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  bottomActions: {
    padding: 16,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  confirmButton: {
    backgroundColor: "#0ea5e9",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentDetail;
