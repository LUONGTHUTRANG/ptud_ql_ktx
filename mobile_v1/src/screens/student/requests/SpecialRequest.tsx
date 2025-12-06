import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";

type SpecialRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpecialRequest"
>;

interface Props {
  navigation: SpecialRequestScreenNavigationProp;
}

const SpecialRequest = ({ navigation }: Props) => {
  const [building, setBuilding] = useState("");
  const [circumstance, setCircumstance] = useState("other"); // poor, disabled, other
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);

  // Mock file state
  const [files, setFiles] = useState([
    { name: "giay_chung_nhan_ho_ngheo.pdf", size: "1.2 MB" },
  ]);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddFile = () => {
    Alert.alert("Upload File", "This is a mock file upload.");
  };

  const handleSubmit = () => {
    if (!building) {
      Alert.alert("Lỗi", "Vui lòng chọn tòa nhà mong muốn.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    // Simulate API call
    setTimeout(() => {
      Alert.alert("Thành công", "Đơn đăng ký đã được gửi thành công.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("RegisterAccommodation"),
        },
      ]);
    }, 500);
  };

  const buildings = [
    { label: "Tòa A1", value: "a1" },
    { label: "Tòa A2", value: "a2" },
    { label: "Tòa B1", value: "b1" },
  ];

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
        <Text style={styles.headerTitle}>Đăng Ký Chỗ Ở - Ưu Tiên</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section 1: Building Selection */}
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
        </View>

        {/* Section 2: Circumstance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khai báo hoàn cảnh đặc biệt</Text>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("poor")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "poor" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "poor" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>
              Sinh viên thuộc hộ nghèo/cận nghèo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("disabled")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "disabled" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "disabled" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>Sinh viên khuyết tật</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("other")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "other" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "other" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>Khác (Ghi rõ lý do bên dưới)</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú thêm</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Mô tả chi tiết về hoàn cảnh của bạn..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
        </View>

        {/* Section 4: File Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minh chứng kèm theo</Text>
          <Text style={styles.helperText}>
            Vui lòng tải lên các giấy tờ chứng minh hoàn cảnh (Định dạng: PDF,
            JPG, PNG. Tối đa 5MB)
          </Text>

          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                <MaterialIcons name="description" size={24} color="#64748b" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileSize}>{file.size}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                <MaterialIcons name="close" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.uploadButton} onPress={handleAddFile}>
            <MaterialIcons name="cloud-upload" size={24} color="#0ea5e9" />
            <Text style={styles.uploadButtonText}>Tải lên tài liệu</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi đơn đăng ký</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận gửi đơn"
        message="Bạn có chắc chắn muốn gửi đơn đăng ký này không? Thông tin sẽ không thể thay đổi sau khi gửi."
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

export default SpecialRequest;
