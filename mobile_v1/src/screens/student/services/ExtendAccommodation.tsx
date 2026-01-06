import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { useTranslation } from "react-i18next";
import { getMe } from "../../../services/authApi";
import { getAllSemesters, Semester } from "../../../services/semesterApi";
import {
  createRegistration,
  getMyRegistrations,
} from "../../../services/registrationApi";
import { getRoomById } from "../../../services/roomApi";
import moment from "moment";

type ExtendAccommodationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExtendAccommodation"
>;

interface Props {
  navigation: ExtendAccommodationScreenNavigationProp;
}

type ScreenStatus =
  | "loading"
  | "not_open"
  | "closed"
  | "already_registered"
  | "open"
  | "error";

const ExtendAccommodation = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<ScreenStatus>("loading");
  const [semester, setSemester] = useState<Semester | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setStatus("loading");

      // 1. Get current user
      const userData = await getMe();
      setStudent(userData);

      if (!userData.current_room_id) {
        Alert.alert(
          t("common.error"),
          "Bạn hiện không ở trong phòng nào để gia hạn."
        );
        navigation.goBack();
        return;
      }

      // 2. Get room info
      const roomData = await getRoomById(userData.current_room_id);
      setCurrentRoom(roomData);

      // 3. Get active semester
      const semesters = await getAllSemesters();
      const activeSemester = semesters.find(
        (s) => s.is_active === 1 || s.is_active === true
      );

      if (!activeSemester) {
        Alert.alert("Thông báo", "Hiện không có học kỳ nào đang hoạt động.");
        setStatus("error");
        return;
      }
      setSemester(activeSemester);

      // 4. Check registration status
      const myRegistrations = await getMyRegistrations();
      const existingRegistration = myRegistrations.find(
        (r: any) =>
          r.semester_id === activeSemester.id &&
          r.registration_type === "RENEWAL"
      );

      if (existingRegistration) {
        setStatus("already_registered");
        return;
      }

      // 5. Check dates
      const now = moment();
      const openDate = moment(activeSemester.renewal_open_date);
      const closeDate = moment(activeSemester.renewal_close_date);

      if (now.isBefore(openDate)) {
        setStatus("not_open");
      } else if (now.isAfter(closeDate)) {
        setStatus("closed");
      } else {
        setStatus("open");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("error");
      Alert.alert(t("common.error"), "Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleConfirm = () => {
    if (!semester || !student) return;

    Alert.alert(
      "Xác nhận gia hạn",
      `Bạn có chắc chắn muốn gia hạn học kỳ ${semester.term} năm học ${semester.academic_year}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: submitRegistration,
        },
      ]
    );
  };

  const submitRegistration = async () => {
    if (!semester || !student) return;

    try {
      setLoadingSubmit(true);
      const formData = new FormData();
      formData.append("student_id", student.id.toString());
      formData.append("registration_type", "RENEWAL");
      formData.append("priority_description", note);
      if (student.current_room_id) {
        formData.append("desired_room_id", student.current_room_id.toString());
      }

      await createRegistration(formData);

      Alert.alert("Thành công", "Yêu cầu gia hạn đã được gửi thành công!", [
        {
          text: "OK",
          onPress: () => {
            setStatus("already_registered");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi yêu cầu gia hạn."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (status === "loading") {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (status === "not_open" && semester) {
    return (
      <View style={styles.container}>
        <Header
          navigation={navigation}
          title={t("extendAccommodation.extendAccommodation")}
        />
        <View style={styles.messageContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="access-time" size={64} color="#64748b" />
          </View>
          <Text style={styles.messageTitle}>Chưa tới thời gian gia hạn</Text>
          <Text style={styles.messageSubtitle}>
            Hệ thống sẽ mở gia hạn vào:
          </Text>
          <Text style={styles.messageDate}>
            {moment(semester.renewal_open_date).format("HH:mm DD/MM/YYYY")}
          </Text>
        </View>
      </View>
    );
  }

  if (status === "closed" && semester) {
    return (
      <View style={styles.container}>
        <Header
          navigation={navigation}
          title={t("extendAccommodation.extendAccommodation")}
        />
        <View style={styles.messageContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="timer-off" size={64} color="#ef4444" />
          </View>
          <Text style={styles.messageTitle}>
            {t("extendAccommodation.extensionTimeEnded")}
          </Text>
          <Text style={styles.messageSubtitle}>
            {t("extendAccommodation.extensionDeadline")}
          </Text>
          <Text style={styles.messageDate}>
            {moment(semester.renewal_close_date).format("HH:mm DD/MM/YYYY")}
          </Text>
          <Text style={styles.contactText}>
            {t("extendAccommodation.contactText")}
          </Text>
        </View>
      </View>
    );
  }

  if (status === "already_registered") {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="Gia hạn Chỗ ở" />
        <View style={styles.messageContainer}>
          <View style={[styles.iconContainer, { backgroundColor: "#dcfce7" }]}>
            <MaterialIcons name="check-circle" size={64} color="#22c55e" />
          </View>
          <Text style={styles.messageTitle}>Đã đăng ký gia hạn</Text>
          <Text style={styles.messageSubtitle}>
            Bạn đã gửi yêu cầu gia hạn cho học kỳ này.
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="Gia hạn Chỗ ở" />
        <View style={styles.messageContainer}>
          <Text>Có lỗi xảy ra. Vui lòng thử lại sau.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <Header navigation={navigation} title="Gia hạn Chỗ ở" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Contract Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hợp đồng hiện tại</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên sinh viên</Text>
              <Text style={styles.infoValue}>{student?.full_name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã số sinh viên</Text>
              <Text style={styles.infoValue}>{student?.mssv}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phòng hiện tại</Text>
              <Text style={styles.infoValue}>
                {currentRoom ? `P.${currentRoom.room_number}` : "N/A"}
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
                  Gia hạn học kỳ {semester?.term} năm học{" "}
                  {semester?.academic_year}
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
          disabled={loadingSubmit}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, loadingSubmit && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Xác nhận Gia hạn</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Header = ({ navigation, title }: { navigation: any; title: string }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}
    >
      <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.headerRight} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#eff6ff",
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
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  messageSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
    textAlign: "center",
  },
  messageDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0ea5e9",
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 12,
  },
  homeButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#0ea5e9",
    borderRadius: 8,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ExtendAccommodation;
