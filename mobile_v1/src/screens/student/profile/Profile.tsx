import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import { getMe } from "../../../services/authApi";
import { getAvatarInitials } from "../../../utils/avatarHelper";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

interface UserData {
  id: number;
  mssv?: string;
  username?: string;
  full_name: string;
  email: string;
  gender?: string;
  class_name?: string;
  current_room_id?: number;
  phone_number?: string;
  building_id?: number;
  role: "student" | "manager" | "admin";
}

interface DetailItem {
  icon: string;
  label: string;
  value: string;
}

const Profile = ({ navigation }: Props) => {
  const [role, setRole] = useState<"student" | "manager" | "admin">("student");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        // Load role from storage
        const storedRole = await AsyncStorage.getItem("role");
        if (
          storedRole === "manager" ||
          storedRole === "student" ||
          storedRole === "admin"
        ) {
          setRole(storedRole);
        }

        // Fetch user data from API
        const user = await getMe();
        setUserData(user);
      } catch (error) {
        console.error("Failed to load user data", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu hồ sơ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Format data based on role and API response
  const getDetailsList = (): DetailItem[] => {
    if (!userData) return [];

    const details: (DetailItem | null | false)[] = [];

    if (role === "manager" || role === "admin") {
      // Manager details
      details.push(
        { icon: "person", label: "Họ và tên", value: userData.full_name },
        { icon: "mail", label: "Email", value: userData.email || "Chưa cập nhật" },
        {
          icon: "phone",
          label: "Số điện thoại",
          value: userData.phone_number || "Chưa cập nhật",
        },
        {
          icon: "badge",
          label: "Tên đăng nhập",
          value: userData.username || "",
        }
      );
      if (userData.building_id) {
        details.push({
          icon: "business",
          label: "Tòa nhà phụ trách",
          value: `Tòa ${userData.building_id}`,
        });
      }
    } else {
      // Student details
      details.push(
        { icon: "person", label: "Họ và tên", value: userData.full_name },
        { icon: "badge", label: "Mã sinh viên", value: userData.mssv || "" },
        {
          icon: "school",
          label: "Lớp",
          value: userData.class_name || "Chưa cập nhật",
        },
        { icon: "mail", label: "Email", value: userData.email }
      );
      if (userData.gender) {
        details.push({
          icon: "wc",
          label: "Giới tính",
          value: userData.gender === "MALE" ? "Nam" : "Nữ",
        });
      }
      details.push({
        icon: "phone",
        label: "Số điện thoại",
        value: userData.phone_number || "Chưa cập nhật",
      });
      if (userData.current_room_id) {
        details.push({
          icon: "bed",
          label: "Phòng",
          value: `Phòng ${userData.current_room_id}`,
        });
      }
    }

    return details.filter(
      (item): item is DetailItem => item !== null && item !== false
    );
  };

  const details = getDetailsList();
  const roleText =
    role === "student"
      ? "Sinh viên"
      : role === "admin"
      ? "Quản trị viên"
      : "Quản lý Ký túc xá";

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : userData ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              {userData ? (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: getAvatarInitials(userData.full_name)
                        .color,
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {getAvatarInitials(userData.full_name).initials}
                  </Text>
                </View>
              ) : (
                <View style={[styles.avatar, { backgroundColor: "#e2e8f0" }]}>
                  <Text style={styles.avatarText}>?</Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialIcons name="photo-camera" size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData.full_name}</Text>
              <Text style={styles.roleText}>{roleText}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            {details.map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={item?.icon as any}
                    size={24}
                    color="#0ea5e9"
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>{item?.label}</Text>
                  <Text style={styles.detailValue}>{item?.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Không thể tải dữ liệu hồ sơ</Text>
        </View>
      )}
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
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
  },
});

export default Profile;
