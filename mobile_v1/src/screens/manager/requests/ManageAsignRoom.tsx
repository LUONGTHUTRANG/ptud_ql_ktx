import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";
import { fetchBuildings } from "../../../services/buildingApi";
import { putAssignRoom } from "../../../services/studentApi";
import { updateRegistrationStatus } from "@/src/services/registrationApi";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManageAssignRoom"
>;

interface Props {
  navigation: NavigationProp;
  route: {
    params: {
      registration: any;
    };
  };
}

const ManageAssignRoom = ({ navigation, route }: Props) => {
  const { registration } = route.params;

  const [selectedBuildingId, setSelectedBuildingId] = useState(registration.building_id);
  const [selectedBuildingName, setSelectedBuildingName] = useState(registration.building_name);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const [buildings, setBuildings] = useState<
    { label: string; value: string }[]
  >([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    const data = await fetchBuildings();
    setBuildings(
      data.map((b: any) => ({
        label: b.name,
        value: b.id.toString(),
      }))
    );
  };

  
  const handleAssign = async () => {
    if (!selectedRoom) {
      Alert.alert("Lỗi", "Vui lòng chọn phòng");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmAssign = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      await putAssignRoom(registration.student_id, selectedRoom.id);
      await updateRegistrationStatus(registration.id, "COMPLETED", "Phân phòng thành công");

      Alert.alert("Thành công", "Đã phân phòng cho sinh viên");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data?.message || "Phân phòng thất bại");
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Phân phòng</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Student info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin sinh viên</Text>
          <Text style={styles.infoText}>
            Họ tên: {registration.student_name}
          </Text>
          <Text style={styles.infoText}>MSSV: {registration.mssv}</Text>
          <Text style={styles.infoText}>
            Loại đăng ký: {registration.registration_type}
          </Text>
        </View>

        {/* Building */}
        <View style={styles.section}>
          <Text style={styles.label}>Chọn tòa nhà</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowBuildingDropdown(!showBuildingDropdown)}
          >
            <Text
              style={selectedBuildingId ? styles.dropdownText : styles.placeholderText}
            >
              {selectedBuildingName ? selectedBuildingName : "Chọn tòa nhà"}
            </Text>
            <MaterialIcons
              name={showBuildingDropdown ? "expand-less" : "expand-more"}
              size={24}
              color="#64748b"
            />
          </TouchableOpacity>

          {showBuildingDropdown && (
            <View style={styles.dropdownList}>
              {buildings.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedBuildingId(item.value);
                    setSelectedBuildingName(item.label);
                    setShowBuildingDropdown(false);
                    setSelectedRoom(null);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Room */}
        <View style={styles.roomSection}>
            <Text style={styles.label}>Chọn phòng</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            disabled={!selectedBuildingId}
            onPress={() => {
              navigation.navigate("RoomList", {
                id: selectedBuildingId,
                name: selectedBuildingName,
                selectMode: true,
                onSelectRoom: (room) => {
                  setSelectedRoom(room);
                },
              });
            }}
          >
            <Text
              style={
                selectedRoom ? styles.dropdownText : styles.placeholderText
              }
            >
              {selectedRoom ? selectedRoom.name : "Chọn phòng"}
            </Text>
            <MaterialIcons name="meeting-room" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !selectedRoom && styles.disabledButton]}
          disabled={!selectedRoom}
          onPress={handleAssign}
        >
          <Text style={styles.submitButtonText}>Phân phòng</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAssign}
        title="Xác nhận phân phòng"
        message="Bạn có chắc chắn muốn phân phòng cho sinh viên này?"
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      )}
    </View>
  );
};

export default ManageAssignRoom;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  headerRight: { width: 40 },
  contentContainer: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  infoText: { fontSize: 15, color: "#334155", marginBottom: 4 },
  dropdownButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  dropdownText: { fontSize: 16, color: "#0f172a" },
  placeholderText: { fontSize: 16, color: "#64748b" },
  dropdownList: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: { padding: 12 },
  dropdownItemText: { fontSize: 16 },
  roomSection: {
    marginTop: 0,
  },
  roomText: { fontSize: 16 },
  submitButton: {
    backgroundColor: "#0ea5e9",
    marginTop: 45,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: { opacity: 0.5 },
});
