import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";
import { createSupportRequest } from "../../../services/requestApi";

type CreateRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateRequest"
>;

interface Props {
  navigation: CreateRequestScreenNavigationProp;
}

const CreateRequest = ({ navigation }: Props) => {
  const [requestType, setRequestType] = useState<
    "repair" | "complaint" | "suggestion"
  >("repair");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mô tả chi tiết");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Map frontend types to backend enums
      let backendType = "REPAIR";

      if (requestType === "complaint") {
        backendType = "COMPLAINT";
      } else if (requestType === "suggestion") {
        backendType = "PROPOSAL";
      }

      // TODO: Get actual student ID from auth context/storage
      formData.append("student_id", "1");
      formData.append("type", backendType);
      formData.append("title", title);
      formData.append("content", description);

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

      await createSupportRequest(formData);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating request:", error);
      Alert.alert("Lỗi", "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigation.navigate("RequestHistory");
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
        <Text style={styles.headerTitle}>Yêu Cầu Hỗ Trợ</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tạo Yêu Cầu Mới</Text>
          <Text style={styles.subtitle}>Bạn cần hỗ trợ về việc gì?</Text>
        </View>

        {/* Request Type Selector */}
        <View style={styles.typeSelector}>
          <View style={styles.typeSelectorInner}>
            {(["repair", "complaint", "suggestion"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setRequestType(type)}
                style={[
                  styles.typeButton,
                  requestType === type && styles.activeTypeButton,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    requestType === type && styles.activeTypeText,
                  ]}
                >
                  {type === "repair"
                    ? "Sửa chữa"
                    : type === "complaint"
                    ? "Khiếu nại"
                    : "Đề xuất"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tiêu đề</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tiêu đề yêu cầu..."
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô tả chi tiết sự việc</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Vui lòng mô tả rõ vấn đề bạn đang gặp phải..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Đính kèm ảnh minh họa</Text>
          {selectedImage ? (
            <View
              style={[
                styles.imagePreviewContainer,
                { aspectRatio: imageAspectRatio },
              ]}
            >
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <MaterialIcons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <MaterialIcons name="photo-camera" size={32} color="#94a3b8" />
              <Text style={styles.uploadText}>Nhấn để tải ảnh lên</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
          )}
        </TouchableOpacity>
      </View>

      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        onConfirm={handleCloseSuccess}
        title="Gửi thành công"
        message="Yêu cầu hỗ trợ của bạn đã được gửi thành công. Ban quản lý sẽ phản hồi trong thời gian sớm nhất."
        confirmLabel="Đồng ý"
        cancelLabel=""
        variant="success"
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
    backgroundColor: "rgba(248, 250, 252, 0.8)",
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
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    gap: 24,
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  typeSelector: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
  },
  typeSelectorInner: {
    flexDirection: "row",
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTypeText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
    minHeight: 120,
  },
  uploadButton: {
    height: 120,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  submitButton: {
    backgroundColor: "#0ea5e9",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateRequest;
