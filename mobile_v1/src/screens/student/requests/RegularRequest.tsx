import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";
import { fetchBuildings } from "../../../services/buildingApi";
import { createRegistration } from "../../../services/registrationApi";

type RegularRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegularRequest"
>;

interface Props {
  navigation: RegularRequestScreenNavigationProp;
}

const RegularRequest = ({ navigation }: Props) => {
  const [building, setBuilding] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [buildings, setBuildings] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user.id);
        }

        const buildingsData = await fetchBuildings();
        const formattedBuildings = buildingsData.map((b: any) => ({
          label: b.name,
          value: b.id.toString(),
        }));
        setBuildings(formattedBuildings);
      } catch (error) {
        console.error("Failed to load data", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu");
      }
    };

    loadData();
  }, []);

  const handleSubmit = () => {
    if (!building) {
      Alert.alert("Lỗi", "Vui lòng chọn tòa nhà.");
      return;
    }

    if (!selectedRoom) {
      Alert.alert("Lỗi", "Vui lòng chọn phòng.");
      return;
    }

    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      return;
    }

    setShowConfirmModal(true);
  };

const handleConfirmSubmit = async () => {
  if (!selectedRoom) {
    Alert.alert("Lỗi", "Vui lòng chọn phòng.");
    return;
  }

  setShowConfirmModal(false);
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("student_id", userId!.toString());
    formData.append("registration_type", "NORMAL");
    formData.append("desired_building_id", building);
    formData.append("desired_room_id", selectedRoom.id);

    const res = await createRegistration(formData);

    Alert.alert(
      "Đăng ký thành công",
      "Vui lòng thanh toán trong vòng 24 giờ để được giữ chỗ.",
      [
        {
          text: "Thanh toán",
          onPress: () =>
            navigation.navigate("BillDetail", { 
              invoiceId: res.invoice_id,
              source: "REGISTER_SUCCESS",
            }),
        },
      ]
    );
  } catch (error: any) {
    console.error("Registration failed", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Đăng ký thất bại"
    );
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
        <Text style={styles.headerTitle}>Đăng Ký Chỗ Ở</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Building selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin phòng mong muốn</Text>
          <Text style={styles.label}>Tòa mong muốn ở</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowBuildingDropdown(!showBuildingDropdown)}
          >
            <Text
              style={building ? styles.dropdownText : styles.placeholderText}
            >
              {building
                ? buildings.find((b) => b.value === building)?.label
                : "Chọn tòa nhà"}
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
                    setBuilding(item.value);
                    setShowBuildingDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      building === item.value &&
                        styles.selectedDropdownItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {building === item.value && (
                    <MaterialIcons name="check" size={20} color="#0ea5e9" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.roomSection}>
            <Text style={styles.label}>Phòng mong muốn</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              disabled={!building}
              onPress={() => {
                const buildingName =
                  buildings.find((b) => b.value === building)?.label || "";

                navigation.navigate("RoomList", {
                  id: building,
                  name: buildingName,
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
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi đăng ký</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận đăng ký"
        message="Bạn có chắc chắn muốn đăng ký chỗ ở không? Bạn cần thanh toán trong vòng 24 giờ để giữ chỗ."
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    position: "relative",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#0f172a",
  },
  placeholderText: {
    fontSize: 16,
    color: "#64748b",
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    overflow: "hidden",
    position: "absolute",
    top: 115, 
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedDropdownItemText: {
    color: "#0ea5e9",
    fontWeight: "600",
  },
  roomSection: {
    marginTop: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: "#0ea5e9",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0ea5e9",
  },
  radioText: {
    fontSize: 16,
    color: "#334155",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#0f172a",
    minHeight: 100,
  },
  helperText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  fileSize: {
    fontSize: 12,
    color: "#64748b",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0ea5e9",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default RegularRequest;
