import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { fetchBuildings } from "../../../services/buildingApi";
import { monthlyUsageApi } from "../../../services/monthlyUsageApi";

type RecordMeterReadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecordMeterReading"
>;

type RecordMeterReadingScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecordMeterReading"
>;

interface Props {
  navigation: RecordMeterReadingScreenNavigationProp;
  route: RecordMeterReadingScreenRouteProp;
}

interface RoomUsage {
  room_id: number;
  room_number: string;
  floor: number;
  building_name: string;
  usage_id: number | null;
  current_electricity: number | null;
  current_water: number | null;
  last_updated: string | null;
  old_electricity: number | null;
  old_water: number | null;
  total_amount: string | null;
  invoice_status: string | null;
}

interface Building {
  id: number;
  name: string;
}

const RecordMeterReading = ({ navigation, route }: Props) => {
  const { period } = route.params || { period: "Tháng 12/2025" };
  const [monthStr, yearStr] = period.replace("Tháng ", "").split("/");
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState("Tất cả");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<
    "building" | "room" | "payment"
  >("building");
  const [activeTab, setActiveTab] = useState<"completed" | "pending">(
    "completed"
  );
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "submitted" | "unpaid">(
    "all"
  );

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<RoomUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [buildingsData, usagesData] = await Promise.all([
        fetchBuildings(),
        monthlyUsageApi.getUsageStatus(
          month,
          year,
          selectedBuilding ? selectedBuilding.id.toString() : undefined
        ),
      ]);

      console.log("check usagesData:", usagesData);

      setBuildings(buildingsData);
      setRooms(usagesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [month, year, selectedBuilding]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const stats = {
    recorded: rooms.filter((r) => r.usage_id).length,
    total_recorded: rooms.length,
    pending: rooms.filter((r) => !r.usage_id).length,
  };

  const buildingOptions = [
    { id: -1, name: "Tất cả" },
    ...buildings.map((b) => ({ id: b.id, name: b.name })),
  ];

  // Get unique room numbers for filter
  const roomOptions = [
    "Tất cả",
    ...Array.from(new Set(rooms.map((r) => r.room_number))).sort(),
  ];

  const paymentOptions = [
    { id: "all", name: "Tất cả" },
    { id: "paid", name: "Đã đóng" },
    { id: "unpaid", name: "Chưa đóng" },
    { id: "submitted", name: "Chờ duyệt" },
  ];

  const handleOpenFilter = (type: "building" | "room" | "payment") => {
    setActiveFilterType(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: any) => {
    if (activeFilterType === "building") {
      setSelectedBuilding(option.id === -1 ? null : option);
    } else if (activeFilterType === "room") {
      setSelectedRoom(option);
    } else {
      setPaymentFilter(option.id);
    }
    setModalVisible(false);
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "completed" && { borderBottomColor: "#16a34a" },
        ]}
        onPress={() => setActiveTab("completed")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "completed" && { color: "#16a34a" },
          ]}
        >
          Đã ghi ({stats.recorded})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "pending" && { borderBottomColor: "#dc2626" },
        ]}
        onPress={() => setActiveTab("pending")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "pending" && { color: "#dc2626" },
          ]}
        >
          Chưa ghi ({stats.pending})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
        <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Ghi chỉ số {period}</Text>
      <View style={styles.iconButton}></View>
    </View>
  );

  const renderFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedBuilding !== null && styles.activeFilterChip,
        ]}
        onPress={() => handleOpenFilter("building")}
      >
        <Text
          style={[
            styles.filterText,
            selectedBuilding !== null && styles.activeFilterText,
          ]}
        >
          {selectedBuilding ? selectedBuilding.name : "Tòa nhà"}
        </Text>
        <MaterialIcons
          name="expand-more"
          size={20}
          color={selectedBuilding !== null ? "#136dec" : "#64748b"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedRoom !== "Tất cả" && styles.activeFilterChip,
        ]}
        onPress={() => handleOpenFilter("room")}
      >
        <Text
          style={[
            styles.filterText,
            selectedRoom !== "Tất cả" && styles.activeFilterText,
          ]}
        >
          {selectedRoom === "Tất cả" ? "Phòng" : selectedRoom}
        </Text>
        <MaterialIcons
          name="expand-more"
          size={20}
          color={selectedRoom !== "Tất cả" ? "#136dec" : "#64748b"}
        />
      </TouchableOpacity>

      {activeTab === "completed" && (
        <TouchableOpacity
          style={[
            styles.filterChip,
            paymentFilter !== "all" && styles.activeFilterChip,
          ]}
          onPress={() => handleOpenFilter("payment")}
        >
          <Text
            style={[
              styles.filterText,
              paymentFilter !== "all" && styles.activeFilterText,
            ]}
          >
            {paymentFilter === "all"
              ? "Trạng thái"
              : paymentFilter === "paid"
              ? "Đã đóng" 
              : paymentFilter === "submitted"
              ? "Chờ duyệt"
              : "Chưa đóng"}
          </Text>
          <MaterialIcons
            name="expand-more"
            size={20}
            color={paymentFilter !== "all" ? "#136dec" : "#64748b"}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const getActiveOptions = () => {
    if (activeFilterType === "building") return buildingOptions;
    if (activeFilterType === "payment") return paymentOptions;
    return roomOptions;
  };

  const renderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {activeFilterType === "building"
                  ? "Chọn tòa nhà"
                  : activeFilterType === "payment"
                  ? "Chọn trạng thái"
                  : "Chọn phòng"}
              </Text>
              <ScrollView>
                {getActiveOptions().map((option: any, index) => {
                  let isSelected = false;
                  let label = "";

                  if (activeFilterType === "building") {
                    isSelected =
                      selectedBuilding?.id === option.id ||
                      (selectedBuilding === null && option.id === -1);
                    label = option.name;
                  } else if (activeFilterType === "payment") {
                    isSelected = paymentFilter === option.id;
                    label = option.name;
                  } else {
                    isSelected = selectedRoom === option;
                    label = option;
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalOption}
                      onPress={() => handleSelectOption(option)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.selectedModalOptionText,
                        ]}
                      >
                        {label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check" size={20} color="#136dec" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderRoomItem = (item: RoomUsage) => {
    const isPending = !item.usage_id;

    if (activeTab === "pending" && !isPending) return null;
    if (activeTab === "completed" && isPending) return null;

    if (activeTab === "completed") {
      if (paymentFilter === "paid" && item.invoice_status !== "PAID")
        return null;
      if (paymentFilter === "unpaid" && item.invoice_status === "PAID")
        return null;
      if (paymentFilter === "submitted" && item.invoice_status !== "SUBMITTED")
        return null;
    }

    if (isPending) {
      return (
        <View key={item.room_id} style={styles.roomCard}>
          <View style={styles.roomHeader}>
            <View style={styles.roomInfo}>
              <View style={styles.roomIcon}>
                <MaterialIcons name="meeting-room" size={24} color="#475569" />
              </View>
              <View>
                <Text style={styles.roomName}>Phòng {item.room_number}</Text>
                <Text style={styles.roomDetail}>
                  {item.building_name} - Tầng {item.floor}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: "#fef2f2" }]}>
              <Text style={[styles.statusText, { color: "#dc2626" }]}>
                Chưa ghi
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardFooter}>
            <Text style={styles.lastUpdated}>
              Chỉ số cũ: Đ {item.old_electricity || 0} - N {item.old_water || 0}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("EnterMeterIndex", {
                  room: {
                    id: item.room_id.toString(),
                    name: `Phòng ${item.room_number}`,
                    building: item.building_name,
                    oldElectricity: item.old_electricity || 0,
                    oldWater: item.old_water || 0,
                  },
                  period: period,
                })
              }
            >
              <Text style={styles.actionButtonText}>Nhập chỉ số</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#136dec" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const statusConfig =
      item.invoice_status === "PAID"
        ? { text: "Đã đóng", color: "#16a34a", bg: "#dcfce7" }
        : item.invoice_status === "SUBMITTED"
        ? { text: "Chờ duyệt", color: "#f59e0b", bg: "#fef3c7" }
        : { text: "Chưa đóng", color: "#dc2626", bg: "#fee2e2" };

    return (
      <TouchableOpacity 
        key={item.room_id} 
        style={[styles.roomCard, styles.completedCard]}
        onPress={() => navigation.navigate("ManagerBillDetail", {
          invoice: item,
          onRefresh: loadData,
        })}
      >
        <View style={styles.roomHeader}>
          <View style={styles.roomInfo}>
            <View style={[styles.roomIcon, { backgroundColor: "#e0f2fe" }]}>
              <MaterialIcons name="check" size={24} color="#136dec" />
            </View>
            <View>
              <Text style={styles.roomName}>Phòng {item.room_number}</Text>
              <Text style={styles.roomDetail}>
                {item.building_name} - Tầng {item.floor}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
          >
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        <View style={styles.readingsContainer}>
          <View style={styles.readingItem}>
            <MaterialIcons name="bolt" size={16} color="#f59e0b" />
            <View>
              <Text style={styles.readingLabel}>ĐIỆN</Text>
              <Text style={styles.readingValue}>
                {item.current_electricity} <Text style={styles.unit}>kWh</Text>
              </Text>
            </View>
          </View>
          <View style={styles.readingItem}>
            <MaterialIcons name="water-drop" size={16} color="#3b82f6" />
            <View>
              <Text style={styles.readingLabel}>NƯỚC</Text>
              <Text style={styles.readingValue}>
                {item.current_water} <Text style={styles.unit}>m³</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalAmount}>
            {item.total_amount
              ? parseInt(item.total_amount).toLocaleString("vi-VN")
              : 0}{" "}
            đ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {renderTabs()}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#136dec" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderFilter()}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh sách phòng</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedBuilding ? selectedBuilding.name : "Tất cả tòa"}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {rooms
              .filter((item) =>
                selectedRoom === "Tất cả"
                  ? true
                  : item.room_number === selectedRoom
              )
              .map((item) => renderRoomItem(item))}
          </View>
        </ScrollView>
      )}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: "#fff",
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
  content: {
    paddingBottom: 80,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  activeFilterChip: {
    backgroundColor: "rgba(19, 109, 236, 0.2)",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  activeFilterText: {
    color: "#136dec",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedModalOptionText: {
    color: "#136dec",
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 4,
  },
  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.9,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  roomInfo: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  roomIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  roomDetail: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#64748b",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#136dec",
  },
  readingsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  readingItem: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readingLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  readingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  unit: {
    fontSize: 10,
    fontWeight: "normal",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#136dec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#136dec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  totalLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
});

export default RecordMeterReading;
