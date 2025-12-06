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
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import ConfirmModal from "../../../components/ConfirmModal";

type ChangePasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

interface Props {
  navigation: ChangePasswordScreenNavigationProp;
}

const ChangePassword = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (name: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmChange = () => {
    setIsConfirmModalOpen(false);
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        "Thành công",
        "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        [
          {
            text: "OK",
            onPress: () => {
              // In a real app, you might clear tokens here
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]
      );
    }, 500);
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
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu hiện tại</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.current}
                value={formData.currentPassword}
                onChangeText={(text) => handleChange("currentPassword", text)}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity
                onPress={() => toggleShowPassword("current")}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={showPassword.current ? "visibility" : "visibility-off"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="vpn-key"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.new}
                value={formData.newPassword}
                onChangeText={(text) => handleChange("newPassword", text)}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity
                onPress={() => toggleShowPassword("new")}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={showPassword.new ? "visibility" : "visibility-off"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword.confirm}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity
                onPress={() => toggleShowPassword("confirm")}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={showPassword.confirm ? "visibility" : "visibility-off"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmChange}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu không? Bạn sẽ cần đăng nhập lại sau khi đổi thành công."
        confirmLabel="Đổi mật khẩu"
        variant="warning"
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
  content: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#f8fafc",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  eyeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: "#0ea5e9",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangePassword;
