import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import ConfirmModal from "../../../components/ConfirmModal";

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const Settings = ({ navigation }: Props) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [role, setRole] = useState<"student" | "manager">("student");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("role");
      setShowLogoutModal(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Tài khoản</Text>
          <View style={styles.card}>
            {/* List Item: Personal Info */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconPrimary]}>
                  <MaterialIcons name="person" size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.listItemText}>Thông tin cá nhân</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* List Item: Change Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ChangePassword")}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconPrimary]}>
                  <MaterialIcons name="lock" size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.listItemText}>Đổi mật khẩu</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Chung</Text>
          <View style={styles.card}>
            {/* List Item: Notification Settings */}
            <View style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconPrimary]}>
                  <MaterialIcons
                    name="notifications"
                    size={24}
                    color="#0ea5e9"
                  />
                </View>
                <Text style={styles.listItemText}>Cài đặt thông báo</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#cbd5e1", true: "#0ea5e9" }}
                thumbColor={"#ffffff"}
              />
            </View>

            <View style={styles.divider} />

            {/* List Item: Language */}
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconPrimary]}>
                  <MaterialIcons name="language" size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.listItemText}>Ngôn ngữ</Text>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.valueText}>Tiếng Việt</Text>
                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Hỗ trợ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconGreen]}>
                  <MaterialIcons name="help" size={24} color="#16a34a" />
                </View>
                <Text style={styles.listItemText}>
                  Trợ giúp & Câu hỏi thường gặp
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconOrange]}>
                  <MaterialIcons name="info" size={24} color="#ea580c" />
                </View>
                <Text style={styles.listItemText}>Về ứng dụng</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>

      <BottomNav role={role} />

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?"
        confirmLabel="Đăng xuất"
        variant="danger"
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
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    minHeight: 56,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPrimary: {
    backgroundColor: "#e0f2fe", // bg-primary/10
  },
  iconGreen: {
    backgroundColor: "#dcfce7",
  },
  iconOrange: {
    backgroundColor: "#ffedd5",
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    color: "#64748b",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 72, // Align with text start
  },
  logoutButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dc2626",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
  },
});

export default Settings;
