import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";
import { fetchBuildings } from "../../../services/buildingApi";
import { createRegistration } from "../../../services/registrationApi";
import { useTranslation } from "react-i18next";

type SpecialRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpecialRequest"
>;

interface Props {
  navigation: SpecialRequestScreenNavigationProp;
}

const SpecialRequest = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [building, setBuilding] = useState("");
  const [circumstance, setCircumstance] = useState("OTHER"); // POOR_HOUSEHOLD, DISABILITY, OTHER
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [buildings, setBuildings] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // File state
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user.id);
        }

        // Load buildings
        const buildingsData = await fetchBuildings();
        const formattedBuildings = buildingsData.map((b: any) => ({
          label: b.name,
          value: b.id.toString(),
        }));
        setBuildings(formattedBuildings);
      } catch (error) {
        console.error("Failed to load data", error);
        Alert.alert(t("common.error"), t("building.loadError"));
      }
    };
    loadData();
  }, []);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        setFiles([
          ...files,
          {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || "application/octet-stream",
            size: asset.size
              ? `${(asset.size / 1024 / 1024).toFixed(2)} MB`
              : "Unknown",
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(t("common.error"), t("registration.cannotSelectFile"));
    }
  };

  const handleSubmit = () => {
    if (!building) {
      Alert.alert(t("common.error"), t("registration.pleaseSelectBuilding"));
      return;
    }
    if (!userId) {
      Alert.alert(t("common.error"), t("registration.userNotFound"));
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("student_id", userId!.toString());
      formData.append("registration_type", "PRIORITY");
      formData.append("desired_building_id", building);
      formData.append("priority_category", circumstance);
      formData.append("priority_description", note);

      if (files.length > 0) {
        // Append the first file as evidence
        const file = files[0];
        formData.append("evidence", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      }

      await createRegistration(formData);

      Alert.alert(t("common.success"), t("registration.requestSentMessage"), [
        {
          text: "OK",
          onPress: () => navigation.navigate("RegisterAccommodation"), // Or navigate back/home
        },
      ]);
    } catch (error: any) {
      console.error("Registration failed", error);
      Alert.alert(
        t("common.error"),
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
        <Text style={styles.headerTitle}>
          {t("registration.registration")} - {t("registration.priority")}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section 1: Building Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("registration.expectedRegistration")}
          </Text>
          <Text style={styles.label}>{t("registration.expectedBuilding")}</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowBuildingDropdown(!showBuildingDropdown)}
          >
            <Text
              style={building ? styles.dropdownText : styles.placeholderText}
            >
              {building
                ? buildings.find((b) => b.value === building)?.label
                : t("registration.selectBuilding")}
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
          <Text style={styles.sectionTitle}>{t("registration.priority")}</Text>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("POOR_HOUSEHOLD")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "POOR_HOUSEHOLD" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "POOR_HOUSEHOLD" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>
              {t("registration.poorHousehold")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("DISABILITY")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "DISABILITY" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "DISABILITY" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>{t("registration.disability")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setCircumstance("OTHER")}
          >
            <View
              style={[
                styles.radioCircle,
                circumstance === "OTHER" && styles.radioCircleSelected,
              ]}
            >
              {circumstance === "OTHER" && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>
              {t("registration.other")} ({t("registration.specifyReasonBelow")})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("registration.note")}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={t("registration.reasonPlaceholder")}
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
          <Text style={styles.sectionTitle}>
            {t("registration.attachedEvidence")}
          </Text>
          <Text style={styles.helperText}>
            {t("registration.uploadInstructions")}
          </Text>

          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                <MaterialIcons
                  name={file.type?.includes("image") ? "image" : "description"}
                  size={24}
                  color="#64748b"
                />
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
            <Text style={styles.uploadButtonText}>
              {t("registration.uploadDocuments")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {t("registration.submitRegistration")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title={t("registration.confirmSubmit")}
        message={t("registration.confirmSubmitMessage")}
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
