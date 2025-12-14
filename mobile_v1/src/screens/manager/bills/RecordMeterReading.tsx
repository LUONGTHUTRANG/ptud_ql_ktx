import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

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

const RecordMeterReading = ({ navigation, route }: Props) => {
  const { period } = route.params || { period: "T10/2023" };
  const [selectedBuilding, setSelectedBuilding] = useState("Tất cả");
  const [selectedRoom, setSelectedRoom] = useState("Tất cả");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<"building" | "room">(
    "building"
  );
  const [activeTab, setActiveTab] = useState<"completed" | "pending">(
    "completed"
  );

  // Mock data
  const stats = {
    recorded: 45,
    total_recorded: 57, // 45 + 12
    pending: 12,
  };

  const rooms = [
    {
      id: "1",
      name: "Phòng 101",
      building: "Tòa A",
      floor: "Tầng 1",
      status: "pending",
      lastUpdated: "10/09/2023",
    },
    {
      id: "2",
      name: "Phòng 102",
      building: "Tòa A",
      floor: "Tầng 1",
      status: "pending",
      lastUpdated: "10/09/2023",
    },
    {
      id: "3",
      name: "Phòng 103",
      building: "Tòa A",
      floor: "Tầng 1",
      status: "completed",
      electricity: 2450,
      water: 120,
    },
    {
      id: "4",
      name: "Phòng 104",
      building: "Tòa A",
      floor: "Tầng 1",
      status: "completed",
      electricity: 2512,
      water: 128,
    },
  ];

  const buildingOptions = ["Tất cả", "Tòa A", "Tòa B", "Tòa C", "Tòa D"];
  const roomOptions = [
    "Tất cả",
    "Phòng 101",
    "Phòng 102",
    "Phòng 103",
    "Phòng 104",
  ];

  const handleOpenFilter = (type: "building" | "room") => {
    setActiveFilterType(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (activeFilterType === "building") {
      setSelectedBuilding(option);
    } else {
      setSelectedRoom(option);
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
          selectedBuilding !== "Tất cả" && styles.activeFilterChip,
        ]}
        onPress={() => handleOpenFilter("building")}
      >
        <Text
          style={[
            styles.filterText,
            selectedBuilding !== "Tất cả" && styles.activeFilterText,
          ]}
        >
          {selectedBuilding === "Tất cả" ? "Tòa nhà" : selectedBuilding}
        </Text>
        <MaterialIcons
          name="expand-more"
          size={20}
          color={selectedBuilding !== "Tất cả" ? "#136dec" : "#64748b"}
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
    </View>
  );

  const getActiveOptions = () => {
    return activeFilterType === "building" ? buildingOptions : roomOptions;
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
                  : "Chọn phòng"}
              </Text>
              {getActiveOptions().map((option, index) => {
                const isSelected =
                  activeFilterType === "building"
                    ? selectedBuilding === option
                    : selectedRoom === option;
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
                      {option}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check" size={20} color="#136dec" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderRoomItem = (item: any) => {
    if (item.status === "pending") {
      return (
        <View key={item.id} style={styles.roomCard}>
          <View style={styles.roomHeader}>
            <View style={styles.roomInfo}>
              <View style={styles.roomIcon}>
                <MaterialIcons name="meeting-room" size={24} color="#475569" />
              </View>
              <View>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomDetail}>
                  {item.building} - {item.floor}
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
              Cập nhật lần cuối: {item.lastUpdated}
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Nhập chỉ số</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#136dec" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View key={item.id} style={[styles.roomCard, styles.completedCard]}>
        <View style={styles.roomHeader}>
          <View style={styles.roomInfo}>
            <View style={[styles.roomIcon, { backgroundColor: "#e0f2fe" }]}>
              <MaterialIcons name="check" size={24} color="#136dec" />
            </View>
            <View>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDetail}>
                {item.building} - {item.floor}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: "#f0fdf4" }]}>
            <Text style={[styles.statusText, { color: "#16a34a" }]}>
              Đã ghi
            </Text>
          </View>
        </View>

        <View style={styles.readingsContainer}>
          <View style={styles.readingItem}>
            <MaterialIcons name="bolt" size={16} color="#f59e0b" />
            <View>
              <Text style={styles.readingLabel}>ĐIỆN</Text>
              <Text style={styles.readingValue}>
                {item.electricity} <Text style={styles.unit}>kWh</Text>
              </Text>
            </View>
          </View>
          <View style={styles.readingItem}>
            <MaterialIcons name="water-drop" size={16} color="#3b82f6" />
            <View>
              <Text style={styles.readingLabel}>NƯỚC</Text>
              <Text style={styles.readingValue}>
                {item.water} <Text style={styles.unit}>m³</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {renderTabs()}
      <ScrollView contentContainerStyle={styles.content}>
        {renderFilter()}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh sách phòng</Text>
          <Text style={styles.sectionSubtitle}>
            {selectedBuilding === "Tất cả" ? "Tất cả tòa" : selectedBuilding} •
            Tầng 1
          </Text>
        </View>

        <View style={styles.listContainer}>
          {rooms
            .filter((item) => item.status === activeTab)
            .filter((item) =>
              selectedBuilding === "Tất cả"
                ? true
                : item.building === selectedBuilding
            )
            .filter((item) =>
              selectedRoom === "Tất cả" ? true : item.name === selectedRoom
            )
            .map((item) => renderRoomItem(item))}
        </View>
      </ScrollView>
      {renderModal()}
    </SafeAreaView>
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
});

export default RecordMeterReading;
