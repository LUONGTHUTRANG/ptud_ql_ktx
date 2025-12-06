import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ExtendAccommodationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExtendAccommodation"
>;

interface Props {
  navigation: ExtendAccommodationScreenNavigationProp;
}

const ExtendAccommodation = ({ navigation }: Props) => {
  const [note, setNote] = useState("");

  // Mock Data - In a real app, this would come from context or API
  const currentContract = {
    studentName: "Nguyễn Văn A",
    studentId: "B20DCCN001",
    building: "A1",
    room: "P.401",
    currentTerm: "01/09/2023 - 01/07/2024",
  };

  const handleConfirm = () => {
    Alert.alert(
      "Xác nhận gia hạn",
      "Bạn có chắc chắn muốn gia hạn học kỳ 1 năm học 2024-2025?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            // Call API here
            Alert.alert(
              "Thành công",
              "Yêu cầu gia hạn đã được gửi thành công!",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Gia hạn Chỗ ở</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Contract Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hợp đồng hiện tại</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên sinh viên</Text>
              <Text style={styles.infoValue}>
                {currentContract.studentName}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã số sinh viên</Text>
              <Text style={styles.infoValue}>{currentContract.studentId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tòa nhà</Text>
              <Text style={styles.infoValue}>{currentContract.building}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số phòng</Text>
              <Text style={styles.infoValue}>{currentContract.room}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thời hạn hiện tại</Text>
              <Text style={styles.infoValue}>
                {currentContract.currentTerm}
              </Text>
            </View>
          </View>
        </View>

        {/* Extension Period Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian gia hạn</Text>
          <View style={styles.radioGroup}>
            <View style={[styles.radioOption, styles.radioOptionSelected]}>
              <View style={styles.radioLabelContainer}>
                <Text style={styles.radioLabel}>
                  Gia hạn học kỳ 1 năm học 2024-2025
                </Text>
              </View>
              <View style={styles.radioButton}>
                <View style={styles.radioButtonInner} />
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú hoặc Yêu cầu khác</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Nếu bạn có yêu cầu đặc biệt, vui lòng nhập tại đây..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Xác nhận Gia hạn</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  radioOptionSelected: {
    borderColor: "#136dec",
    backgroundColor: "#eff6ff", // Light blue bg
  },
  radioLabelContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#136dec",
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 4,
  },
  textArea: {
    padding: 12,
    fontSize: 14,
    color: "#0f172a",
    minHeight: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#136dec",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default ExtendAccommodation;
