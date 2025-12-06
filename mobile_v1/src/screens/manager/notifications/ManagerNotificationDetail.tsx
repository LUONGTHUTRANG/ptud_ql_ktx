import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { RootStackParamList } from "../../../types";

type ManagerNotificationDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerNotificationDetail"
>;

type ManagerNotificationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ManagerNotificationDetail"
>;

interface Props {
  navigation: ManagerNotificationDetailScreenNavigationProp;
  route: ManagerNotificationDetailScreenRouteProp;
}

const ManagerNotificationDetail = ({ navigation, route }: Props) => {
  const { id } = route.params || {};
  const isEditing = !!id;

  // Mock data based on ID (in a real app, fetch from API)
  const [title, setTitle] = useState(
    isEditing ? "Thông báo về việc đăng ký điện nước" : ""
  );
  const [content, setContent] = useState(
    isEditing
      ? "Kính gửi các bạn sinh viên,\nPhòng Quản lý KTX xin thông báo về lịch đăng ký và gia hạn hợp đồng điện, nước cho học kỳ tới. Vui lòng hoàn tất đăng ký trước ngày 25/08/2024.\nTrân trọng cảm ơn."
      : ""
  );

  const [scope, setScope] = useState("ALL");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [showRecipientSelection, setShowRecipientSelection] = useState(
    !isEditing
  );
  // Mock Data
  const buildingData = [
    { label: "Tòa A1", value: "1" },
    { label: "Tòa B1", value: "2" },
    { label: "Tòa C1", value: "3" },
  ];

  const roomData = [
    { label: "Phòng 101", value: "1" },
    { label: "Phòng 102", value: "2" },
    { label: "Phòng 201", value: "3" },
    { label: "Phòng 202", value: "4" },
  ];

  const studentData = [
    { label: "Lê Văn Sinh Viên", value: "1" },
    { label: "Phạm Thị Sinh Viên", value: "2" },
    { label: "Nguyễn Văn A", value: "3" },
  ];

  const scopeData = [
    { label: "Tất cả", value: "ALL" },
    { label: "Tòa nhà", value: "BUILDING" },
    { label: "Phòng", value: "ROOM" },
    { label: "Sinh viên", value: "STUDENT" },
  ];

  const getTargetData = () => {
    switch (scope) {
      case "BUILDING":
        return buildingData;
      case "ROOM":
        return roomData;
      case "STUDENT":
        return studentData;
      default:
        return [];
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
        <Text style={styles.headerTitle}>
          {isEditing ? "Chi tiết Thông báo" : "Tạo Thông báo"}
        </Text>
        {/* Empty view for balance, replacing the trash icon as requested */}
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tiêu đề thông báo"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="Nhập nội dung thông báo"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Recipient Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đối tượng nhận</Text>
            {!showRecipientSelection ? (
              <View style={styles.recipientCard}>
                <View style={styles.recipientContent}>
                  <View style={styles.recipientIcon}>
                    <MaterialIcons name="groups" size={24} color="#136dec" />
                  </View>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientLabel}>Đã chọn</Text>
                    <Text style={styles.recipientValue} numberOfLines={2}>
                      {scope === "ALL"
                        ? "Tất cả sinh viên"
                        : `${scope} - ${selectedTargets.length} đối tượng`}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setShowRecipientSelection(true)}
                >
                  <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectionContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  containerStyle={styles.dropdownContainer}
                  data={scopeData}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn phạm vi"
                  value={scope}
                  onChange={(item: any) => {
                    setScope(item.value);
                    setSelectedTargets([]);
                  }}
                />

                {scope !== "ALL" && (
                  <MultiSelect
                    style={[styles.dropdown, { marginTop: 12 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={styles.itemTextStyle}
                    containerStyle={styles.dropdownContainer}
                    search
                    data={getTargetData()}
                    labelField="label"
                    valueField="value"
                    placeholder="Chọn đối tượng"
                    searchPlaceholder="Tìm kiếm..."
                    value={selectedTargets}
                    onChange={(item: any) => {
                      setSelectedTargets(item);
                    }}
                    selectedStyle={styles.selectedStyle}
                    activeColor="#c9ebfdff"
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {isEditing ? "Lưu thay đổi" : "Tạo mới"}
            </Text>
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Gửi lại</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
    paddingBottom: 100,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  textArea: {
    minHeight: 192, // min-h-48 (48 * 4 = 192)
  },
  recipientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 16,
    minHeight: 72,
  },
  recipientContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  recipientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(19, 109, 236, 0.1)", // primary/10
    alignItems: "center",
    justifyContent: "center",
  },
  recipientInfo: {
    flex: 1,
  },
  recipientLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  recipientValue: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  selectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  dropdown: {
    height: 40,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#0f172a",
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
  inputSearchStyle: {
    height: 36,
    fontSize: 14,
    borderRadius: 8,
  },
  itemTextStyle: {
    fontSize: 14,
    color: "#0f172a",
  },
  dropdownContainer: {
    borderRadius: 8,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  selectedStyle: {
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
    borderColor: "#0ea5e9",
    marginTop: 8,
    marginRight: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#136dec",
  },
  footer: {
    padding: 16,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#136dec",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    height: 48,
    backgroundColor: "rgba(19, 109, 236, 0.1)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#136dec",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManagerNotificationDetail;
