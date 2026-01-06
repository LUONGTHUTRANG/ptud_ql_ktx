import React, { useState, useEffect } from "react";
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
  Image,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import { notificationApi } from "../../../services/notificationApi";
import { fetchBuildings } from "../../../services/buildingApi";
import { fetchRooms } from "../../../services/roomApi";
import { studentApi } from "../../../services/studentApi";

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
  const [isEditingMode, setIsEditingMode] = useState(!isEditing);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [scope, setScope] = useState("ALL");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [showRecipientSelection, setShowRecipientSelection] = useState(
    !isEditing
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [buildingData, setBuildingData] = useState<
    { label: string; value: string }[]
  >([]);
  const [roomData, setRoomData] = useState<{ label: string; value: string }[]>(
    []
  );
  const [studentData, setStudentData] = useState<
    { label: string; value: string }[]
  >([]);

  const loadNotificationDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await notificationApi.getNotificationById(id);
      setTitle(data.title);
      setContent(data.content);
      setScope(data.target_scope);
      if (data.attachment_url) {
        setSelectedImage(data.attachment_url);
      }

      if (data.target_scope === "ROOM" && data.rooms) {
        setSelectedTargets(data.rooms.map((r: any) => r.id));
      } else if (data.target_scope === "BUILDING" && data.buildings) {
        setSelectedTargets(data.buildings.map((b: any) => b.id));
      } else if (data.target_scope === "INDIVIDUAL" && data.students) {
        setSelectedTargets(data.students.map((s: any) => s.id));
      }
    } catch (error) {
      console.error("Error loading notification details:", error);
      Alert.alert(t("common.error"), "Không thể tải chi tiết thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationDetails();
  }, [id]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error("Failed to load user role", error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (scope === "BUILDING") {
          const buildings = await fetchBuildings();
          setBuildingData(
            buildings.map((b: any) => ({ label: b.name, value: b.id }))
          );
        } else if (scope === "ROOM") {
          const rooms = await fetchRooms();
          setRoomData(
            rooms.map((r: any) => ({ label: r.room_number, value: r.id }))
          );
        } else if (scope === "STUDENT") {
          const response = await studentApi.getAllStudents(1, 100); // Fetch first 100 for now
          setStudentData(
            response.data.map((s: any) => ({
              label: `${s.full_name} - ${s.mssv}`,
              value: s.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (scope !== "ALL") {
      loadData();
    }
  }, [scope]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      setImageAspectRatio(asset.width / asset.height);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập tiêu đề");
      return;
    }
    if (!content.trim()) {
      Alert.alert(t("common.error"), "Vui lòng nhập nội dung");
      return;
    }
    if (scope !== "ALL" && selectedTargets.length === 0) {
      Alert.alert(t("common.error"), "Vui lòng chọn đối tượng nhận");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", "ANNOUNCEMENT");

      let targetScope = "ALL";
      if (scope === "BUILDING") targetScope = "BUILDING";
      else if (scope === "ROOM") targetScope = "ROOM";
      else if (scope === "STUDENT") targetScope = "INDIVIDUAL";

      formData.append("target_scope", targetScope);

      if (scope === "STUDENT") {
        formData.append("student_ids", JSON.stringify(selectedTargets));
      } else if (scope === "ROOM") {
        selectedTargets.forEach((id) => formData.append("room_id", id));
      } else if (scope === "BUILDING") {
        selectedTargets.forEach((id) => formData.append("building_id", id));
      }

      if (selectedImage) {
        const filename = selectedImage.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        // @ts-ignore
        formData.append("attachment", {
          uri: selectedImage,
          name: filename,
          type,
        });
      }

      await notificationApi.createNotification(formData);
      Alert.alert("Thành công", "Đã tạo thông báo thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating notification:", error);
      Alert.alert(t("common.error"), "Không thể tạo thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  const scopeData = [
    { label: "Tất cả", value: "ALL" },
    { label: "Tòa nhà", value: "BUILDING" },
    { label: "Phòng", value: "ROOM" },
    { label: "Sinh viên", value: "STUDENT" },
  ];

  const getScopeData = () => {
    if (userRole === "manager" || userRole === "admin") {
      return scopeData.filter((item) =>
        ["ROOM", "STUDENT"].includes(item.value)
      );
    }
    // Admin or others can see all (or restrict as needed)
    return scopeData;
  };

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
        {isEditing && !isEditingMode ? (
          <TouchableOpacity
            onPress={() => setIsEditingMode(true)}
            style={styles.backButton}
          >
            <MaterialIcons name="edit" size={24} color="#136dec" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
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
              style={[styles.input, !isEditingMode && styles.disabledInput]}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tiêu đề thông báo"
              placeholderTextColor="#94a3b8"
              editable={isEditingMode}
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditingMode && styles.disabledInput,
              ]}
              value={content}
              onChangeText={setContent}
              placeholder="Nhập nội dung thông báo"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              editable={isEditingMode}
            />
          </View>

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh đính kèm</Text>
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={[
                    styles.imagePreview,
                    { aspectRatio: imageAspectRatio },
                  ]}
                  resizeMode="contain"
                />
                {isEditingMode && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <MaterialIcons name="close" size={20} color="#ffffff" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              isEditingMode && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={32}
                    color="#64748b"
                  />
                  <Text style={styles.uploadText}>Tải ảnh lên</Text>
                </TouchableOpacity>
              )
            )}
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
                {isEditingMode && (
                  <TouchableOpacity
                    onPress={() => setShowRecipientSelection(true)}
                  >
                    <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.selectionContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  containerStyle={styles.dropdownContainer}
                  data={getScopeData()}
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
          {isEditingMode && (
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isEditing ? "Lưu thay đổi & Gửi lại" : "Tạo mới"}
                </Text>
              )}
            </TouchableOpacity>
          )}
          {isEditing && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                if (isEditingMode) {
                  setIsEditingMode(false);
                  loadNotificationDetails();
                }
              }}
            >
              <Text style={styles.secondaryButtonText}>
                {isEditingMode ? "Hủy" : "Gửi lại"}
              </Text>
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
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imagePreview: {
    width: "100%",
    backgroundColor: "#f1f5f9",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    height: 120,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
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
  disabledInput: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
  },
});

export default ManagerNotificationDetail;
