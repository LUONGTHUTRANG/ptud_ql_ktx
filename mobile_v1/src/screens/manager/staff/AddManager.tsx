import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Switch,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { Colors } from "@/constants/theme";
import { managerApi } from "../../../services/managerApi";
import { useTranslation } from "react-i18next";

type AddManagerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddManager"
>;

interface Props {
  navigation: AddManagerScreenNavigationProp;
}

interface FormData {
  fullName: string;
  dateOfBirth: Date | null;
  idCard: string;
  phoneNumber: string;
  email: string;
  buildings: string;
}

const BUILDINGS = [
  { value: "0", label: "Toàn khu" },
  { value: "1", label: "Tòa C1" },
  { value: "2", label: "Tòa C2" },
  { value: "3", label: "Tòa C3" },
];

const AddManager = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: null,
    idCard: "",
    phoneNumber: "",
    email: "",
    buildings: "",
  });

  const [showBuildingsModal, setShowBuildingsModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDatePicked = (event: any, selectedDate?: Date) => {
    const isDismissed =
      event?.type === "dismissed" ||
      (selectedDate === undefined && Platform.OS === "android");

    if (isDismissed) {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const getDateDisplay = () => {
    if (!formData.dateOfBirth) return "Chọn ngày sinh";
    try {
      return formData.dateOfBirth.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      const dd = formData.dateOfBirth.getDate().toString().padStart(2, "0");
      const mm = (formData.dateOfBirth.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const yyyy = formData.dateOfBirth.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập họ và tên");
      return false;
    }
    if (!formData.dateOfBirth) {
      Alert.alert(t("common.error"), "Vui lòng chọn ngày tháng năm sinh");
      return false;
    }
    if (!formData.idCard.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập số CCCD/CMND");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập email");
      return false;
    }
    if (!formData.buildings || formData.buildings.trim() === "") {
      Alert.alert(t("common.error"), "Vui lòng chọn tòa nhà phụ trách");
      return false;
    }
    return true;
  };

  const handleAddManager = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Format date to YYYY-MM-DD
      const dateOfBirth = formData.dateOfBirth;
      const year = dateOfBirth!.getFullYear();
      const month = String(dateOfBirth!.getMonth() + 1).padStart(2, "0");
      const day = String(dateOfBirth!.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // Prepare data for API
      const apiData = {
        full_name: formData.fullName,
        date_of_birth: formattedDate,
        id_card: formData.idCard,
        phone_number: formData.phoneNumber,
        email: formData.email,
        building_id:
          formData.buildings === "0" ? null : parseInt(formData.buildings),
      };

      const response = await managerApi.addManager(apiData);

      Alert.alert("Thành công", "Thêm cán bộ thành công", [
        {
          text: "OK",
          onPress: () => {
            setLoading(false);
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error?.response?.data?.error || "Không thể thêm cán bộ";
      Alert.alert(t("common.error"), errorMessage);
      console.error(error);
    }
  };
  const handleSelectOption = (value: string) => {
    setFormData({ ...formData, buildings: value });
    setShowBuildingsModal(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Cán bộ</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Họ và tên <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên đầy đủ"
              placeholderTextColor="#cbd5e1"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Ngày tháng năm sinh <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>{getDateDisplay()}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* ID Card */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Số CCCD / CMND <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số căn cước"
              placeholderTextColor="#cbd5e1"
              keyboardType="numeric"
              value={formData.idCard}
              onChangeText={(value) => handleInputChange("idCard", value)}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

          {/* Phone Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Số điện thoại <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="09xxxxxxxx"
              placeholderTextColor="#cbd5e1"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
            />
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#cbd5e1"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Work Information Section */}
        <View style={[styles.section, { marginBottom: 125 }]}>
          <Text style={styles.sectionTitle}>Công tác</Text>
          {/* Buildings */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Tòa nhà phụ trách <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowBuildingsModal(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !formData.buildings && styles.dropdownPlaceholder,
                ]}
              >
                {formData.buildings
                  ? BUILDINGS.find((b) => b.value === formData.buildings)
                      ?.label || "Chọn tòa nhà"
                  : "Chọn tòa nhà"}
              </Text>
              <MaterialIcons
                name="expand-more"
                size={20}
                color={formData.buildings ? "#136dec" : "#64748b"}
              />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Chọn "Toàn khu" để quản lý tất cả các tòa nhà.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddManager}
          disabled={loading}
        >
          <MaterialIcons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Thêm cán bộ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>

      {/* Buildings Modal */}
      <Modal
        visible={showBuildingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBuildingsModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBuildingsModal(false)}>
          <View style={styles.filterModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.filterModalContent}>
                <Text style={styles.filterModalTitle}>
                  Chọn tòa nhà phụ trách
                </Text>
                {BUILDINGS.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterModalOption,
                      formData.buildings === option.value &&
                        styles.filterModalOptionSelected,
                    ]}
                    onPress={() => handleSelectOption(option.value)}
                  >
                    <Text
                      style={[
                        styles.filterModalOptionText,
                        formData.buildings === option.value &&
                          styles.filterModalOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {formData.buildings === option.value && (
                      <MaterialIcons name="check" size={24} color="#136dec" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDatePicked}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "#fff",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: "#cbd5e1",
  },
  buildingsDisplay: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: 8,
  },
  badge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#136dec",
  },
  helperText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  addButton: {
    backgroundColor: "#136dec",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    maxHeight: "60%",
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  filterModalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  filterModalOptionText: {
    fontSize: 16,
    color: "#334155",
  },
  filterModalOptionSelected: {
    backgroundColor: "transparent",
  },
  filterModalOptionTextSelected: {
    color: "#136dec",
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  modalOptionSelected: {
    backgroundColor: "#dbeafe",
  },
  modalOptionTextSelected: {
    color: "#136dec",
    fontWeight: "600",
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#136dec",
    textAlign: "center",
  },
});

export default AddManager;
