import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { getInvoiceDetail } from "../../../services/invoiceApi";
import moment from "moment";

type BillDetailRouteProp = RouteProp<RootStackParamList, "BillDetail">;

const BillDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<BillDetailRouteProp>();
  const { invoiceId } = route.params || {};
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      fetchDetail();
    }
  }, [invoiceId]);

  const fetchDetail = async () => {
    try {
      const data = await getInvoiceDetail(invoiceId!);
      setDetail(data);
    } catch (error) {
      console.error("Error fetching invoice detail:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Đã sao chép", text);
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

  const displayData = detail || {};
  const isUtility = displayData.type === "UTILITY_FEE" || displayData.usage_id;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const billData = {
    amount: formatCurrency(displayData.amount),
    dueDate: moment(displayData.due_date).format("DD/MM/YYYY"),
    status: displayData.status === "PAID" ? "paid" : "unpaid",
    room: displayData.room_number || "N/A",
    building: displayData.building_name || "N/A",
    period: displayData.usage_month
      ? `Tháng ${displayData.usage_month}/${displayData.usage_year}`
      : displayData.description || "N/A",
    issueDate: moment(displayData.time_invoiced).format("DD/MM/YYYY"),
    electricity: {
      old: displayData.electricity_old_index || 0,
      new: displayData.electricity_new_index || 0,
      usage: `${
        displayData.electricity_new_index - displayData.electricity_old_index ||
        0
      } kWh`,
      rate: `${formatCurrency(displayData.electricity_price || 0)}/kWh`,
      total: formatCurrency(
        (displayData.electricity_new_index -
          displayData.electricity_old_index) *
          displayData.electricity_price || 0
      ),
    },
    water: {
      old: displayData.water_old_index || 0,
      new: displayData.water_new_index || 0,
      usage: `${
        displayData.water_new_index - displayData.water_old_index || 0
      } m³`,
      rate: `${formatCurrency(displayData.water_price || 0)}/m³`,
      envFee: "0 ₫",
      total: formatCurrency(
        (displayData.water_new_index - displayData.water_old_index) *
          displayData.water_price || 0
      ),
    },
    bank: {
      name: "MB Bank",
      accountNumber: "0333 444 555 666",
      content: `KTX ${displayData.room_number} ${displayData.invoice_code}`,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết Hóa đơn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                billData.status === "paid"
                  ? styles.statusBadgePaid
                  : styles.statusBadgeUnpaid,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  billData.status === "paid"
                    ? styles.statusTextPaid
                    : styles.statusTextUnpaid,
                ]}
              >
                {billData.status === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Text>
            </View>
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Tổng thanh toán</Text>
            <Text style={styles.summaryAmount}>{billData.amount}</Text>
          </View>
          <View style={styles.dueDateContainer}>
            <MaterialIcons name="warning" size={16} color="#f97316" />
            <Text style={styles.dueDateText}>Hạn đóng: {billData.dueDate}</Text>
          </View>
        </View>

        {/* General Info Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={[styles.gridItem, styles.gridItemBorderRight]}>
              <Text style={styles.gridLabel}>Phòng</Text>
              <Text style={styles.gridValue}>{billData.room}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tòa nhà</Text>
              <Text style={styles.gridValue}>{billData.building}</Text>
            </View>
          </View>
          <View style={styles.gridDivider} />
          <View style={styles.gridRow}>
            <View style={[styles.gridItem, styles.gridItemBorderRight]}>
              <Text style={styles.gridLabel}>Kỳ thanh toán</Text>
              <Text style={styles.gridValue}>{billData.period}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ngày phát hành</Text>
              <Text style={styles.gridValue}>{billData.issueDate}</Text>
            </View>
          </View>
        </View>

        {/* Electricity Details - Only show if utility */}
        {isUtility && (
          <>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, styles.bgYellow]}>
                  <MaterialIcons name="bolt" size={16} color="#ca8a04" />
                </View>
                <Text style={styles.sectionTitle}>Tiền Điện</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Số cũ</Text>
                    <Text style={styles.detailValue}>
                      {billData.electricity.old}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Số mới</Text>
                    <Text style={styles.detailValue}>
                      {billData.electricity.new}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tiêu thụ</Text>
                    <Text style={styles.detailValue}>
                      {billData.electricity.usage}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Đơn giá</Text>
                    <Text style={styles.detailValue}>
                      {billData.electricity.rate}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerLabel}>Thành tiền</Text>
                  <Text style={styles.footerValue}>
                    {billData.electricity.total}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, styles.bgBlue]}>
                  <MaterialIcons name="water-drop" size={16} color="#2563eb" />
                </View>
                <Text style={styles.sectionTitle}>Tiền Nước</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Số cũ</Text>
                    <Text style={styles.detailValue}>{billData.water.old}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Số mới</Text>
                    <Text style={styles.detailValue}>{billData.water.new}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tiêu thụ</Text>
                    <Text style={styles.detailValue}>
                      {billData.water.usage}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Đơn giá</Text>
                    <Text style={styles.detailValue}>
                      {billData.water.rate}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardFooterColumn}>
                  <View style={styles.footerRow}>
                    <Text style={styles.footerLabelSmall}>
                      Phí vệ sinh môi trường
                    </Text>
                    <Text style={styles.footerValueSmall}>
                      {billData.water.envFee}
                    </Text>
                  </View>
                  <View style={[styles.footerRow, { marginTop: 4 }]}>
                    <Text style={styles.footerLabel}>Thành tiền</Text>
                    <Text style={styles.footerValue}>
                      {billData.water.total}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* QR Payment Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Thanh toán VietQR</Text>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <MaterialIcons name="qr-code-scanner" size={16} color="#136dec" />
              <Text style={styles.qrHeaderText}>
                Quét mã để thanh toán nhanh
              </Text>
            </View>
            <View style={styles.qrBody}>
              <View style={styles.qrImageContainer}>
                <Image
                  source={{
                    uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePaymentData",
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.bankInfoContainer}>
                <View style={styles.bankInfoRow}>
                  <View>
                    <Text style={styles.bankLabel}>Ngân hàng</Text>
                    <Text style={styles.bankValue}>{billData.bank.name}</Text>
                  </View>
                  <View style={styles.bankIcon}>
                    <MaterialIcons
                      name="account-balance"
                      size={16}
                      color="#94a3b8"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.bankInfoRowClickable}
                  onPress={() => copyToClipboard(billData.bank.accountNumber)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankLabel}>Số tài khoản</Text>
                    <Text style={styles.bankValue} numberOfLines={1}>
                      {billData.bank.accountNumber}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="content-copy"
                    size={18}
                    color="#136dec"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bankInfoRowClickable}
                  onPress={() => copyToClipboard(billData.bank.content)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankLabel}>Nội dung chuyển khoản</Text>
                    <Text style={styles.bankValue} numberOfLines={1}>
                      {billData.bank.content}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="content-copy"
                    size={18}
                    color="#136dec"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Xác nhận đã thanh toán</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.historyButton}>
          <MaterialIcons name="history" size={20} color="#64748b" />
          <Text style={styles.historyButtonText}>Xem Lịch sử Thanh toán</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
    overflow: "hidden",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusBadgeUnpaid: {
    backgroundColor: "#fef2f2",
    borderColor: "rgba(220, 38, 38, 0.1)",
  },
  statusBadgePaid: {
    backgroundColor: "#f0fdf4",
    borderColor: "rgba(22, 163, 74, 0.1)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextUnpaid: {
    color: "#b91c1c",
  },
  statusTextPaid: {
    color: "#15803d",
  },
  summaryContent: {
    gap: 4,
    marginTop: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  summaryAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#136dec",
    letterSpacing: -0.5,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  dueDateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ea580c",
  },
  gridContainer: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: "row",
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  gridItemBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  gridDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  gridLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bgYellow: {
    backgroundColor: "#fef9c3",
  },
  bgBlue: {
    backgroundColor: "#dbeafe",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailItem: {
    width: "50%",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooterColumn: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
    gap: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  footerValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  footerLabelSmall: {
    fontSize: 12,
    color: "#64748b",
  },
  footerValueSmall: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  qrSection: {
    marginTop: 8,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  qrCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  qrHeader: {
    backgroundColor: "rgba(19, 109, 236, 0.05)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(19, 109, 236, 0.1)",
  },
  qrHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#136dec",
  },
  qrBody: {
    padding: 24,
    alignItems: "center",
  },
  qrImageContainer: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  bankInfoContainer: {
    width: "100%",
    gap: 12,
  },
  bankInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  bankInfoRowClickable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  bankLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  bankValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  bankIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
    gap: 12,
  },
  payButton: {
    backgroundColor: "#136dec",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#136dec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
  },
  historyButtonText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BillDetail;
