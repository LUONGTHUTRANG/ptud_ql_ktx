import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const Profile = ({ navigation }: Props) => {
  const [role, setRole] = useState<"student" | "manager">("student");

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        if (storedRole === "manager" || storedRole === "student") {
          setRole(storedRole);
        }
      } catch (e) {
        console.error("Failed to load role", e);
      }
    };
    loadRole();
  }, []);

  const studentData = {
    avatar: "https://picsum.photos/200",
    name: "Nguyễn Văn An",
    roleText: "Sinh viên - K66",
    details: [
      { icon: "person", label: "Họ và tên", value: "Nguyễn Văn An" },
      { icon: "badge", label: "Mã sinh viên", value: "20211234" },
      { icon: "school", label: "Lớp", value: "CNTT-04" },
      { icon: "calendar-today", label: "Ngày sinh", value: "01/01/2003" }, // calendar_month -> calendar-today
      { icon: "phone", label: "Số điện thoại", value: "0987654321" },
      { icon: "mail", label: "Email", value: "an.nv211234@sis.hust.edu.vn" },
      { icon: "bed", label: "Phòng", value: "Tòa B2 - 404" },
    ],
  };

  const managerData = {
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5fGTmbVq_ilZqybLg_MFxbrciC3Bwd2F1Ja5ljTMP2UoeHILChNE2GKPtJ_LRcJ0CKi27kpG0lYi-hUjVGJANzFBGFt7AoN00MyjeGpfcCVwGXuGLFysyzOai2Fa4UxCpx_eN3h7eVqdla8FMZHkiYhQYViAXRB0bPMjDJv76RmtQikYB5Bu6RD-WhvUO7JtANvxRhKku3vbnT-HphlCxXBglM6dWhJqPJIgL62r5K441QpTmGGqtnPpfxAE43qur3MAUoieQni8",
    name: "Nguyễn Văn An",
    roleText: "Quản lý Ký túc xá",
    details: [
      { icon: "person", label: "Họ và tên", value: "Nguyễn Văn An" },
      { icon: "calendar-today", label: "Ngày sinh", value: "01/01/1985" },
      { icon: "phone", label: "Số điện thoại", value: "0912345678" },
      { icon: "mail", label: "Email", value: "nguyen.van.an@email.com" },
      { icon: "badge", label: "Số CCCD", value: "*** *** 678" },
      { icon: "business", label: "Tòa nhà phụ trách", value: "Tòa A1, Tòa B2" }, // corporate_fare -> business
    ],
  };

  const data = role === "manager" ? managerData : studentData;

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
        <Text style={styles.headerTitle}>Hồ sơ của bạn</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: data.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialIcons name="photo-camera" size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.roleText}>{data.roleText}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {data.details.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color="#0ea5e9"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e2e8f0",
    borderWidth: 2,
    borderColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  roleText: {
    fontSize: 16,
    color: "#64748b",
  },
  detailsContainer: {
    backgroundColor: "#e2e8f0", // Separator color
    gap: 1,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#e0f2fe", // bg-primary/10
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
});

export default Profile;
