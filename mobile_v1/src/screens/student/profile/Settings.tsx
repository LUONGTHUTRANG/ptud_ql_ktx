//translated
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import ConfirmModal from "../../../components/ConfirmModal";
import { LanguageService } from "../../../services/languageService";

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const Settings = ({ navigation }: Props) => {
  const { t, i18n } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [role, setRole] = useState<"student" | "manager" | "admin">("student");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("vi");

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        if (
          storedRole === "manager" ||
          storedRole === "admin" ||
          storedRole === "student"
        ) {
          setRole(storedRole);
        }
        const lang = LanguageService.getCurrentLanguage();
        setCurrentLanguage(lang);
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

  const handleLanguageChange = async (language: string) => {
    try {
      await LanguageService.setLanguage(language);
      setCurrentLanguage(language);
      setShowLanguageModal(false);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>{t("common.settings")}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("common.profile")}</Text>
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
                <Text style={styles.listItemText}>{t("common.profile")}</Text>
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
                <Text style={styles.listItemText}>{t("auth.password")}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("common.language")}</Text>
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
                <Text style={styles.listItemText}>
                  {t("notification.notifications")}
                </Text>
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
            <TouchableOpacity
              onPress={() => setShowLanguageModal(true)}
              style={styles.listItem}
            >
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconPrimary]}>
                  <MaterialIcons name="language" size={24} color="#0ea5e9" />
                </View>
                <View style={styles.languageInfo}>
                  <Text style={styles.listItemText}>
                    {t("common.language")}
                  </Text>
                  <Text style={styles.languageValue}>
                    {currentLanguage === "vi" ? "Tiếng Việt" : "English"}
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("common.warning")}</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.iconContainer, styles.iconGreen]}>
                  <MaterialIcons name="help" size={24} color="#16a34a" />
                </View>
                <Text style={styles.listItemText}>
                  {t("common.help")}
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
                <Text style={styles.listItemText}>{t("common.info")}</Text>
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
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v 1.0.0</Text>
      </ScrollView>

      <BottomNav role={role} />

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t("auth.logout")}
        message={t("common.confirm")}
        confirmLabel={t("auth.logout")}
        variant="danger"
      />

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("common.selectLanguage")}
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLanguage === "vi" && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange("vi")}
              >
                <View
                  style={[
                    styles.radioButton,
                    currentLanguage === "vi" && styles.radioButtonActive,
                  ]}
                />
                <Text
                  style={[
                    styles.languageOptionText,
                    currentLanguage === "vi" && styles.languageOptionTextActive,
                  ]}
                >
                  Tiếng Việt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLanguage === "en" && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange("en")}
              >
                <View
                  style={[
                    styles.radioButton,
                    currentLanguage === "en" && styles.radioButtonActive,
                  ]}
                />
                <Text
                  style={[
                    styles.languageOptionText,
                    currentLanguage === "en" && styles.languageOptionTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: 250,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  languageOptions: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
  },
  languageOptionActive: {
    backgroundColor: "#e3f2fd",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 15,
  },
  radioButtonActive: {
    borderColor: "#0ea5e9",
    backgroundColor: "#0ea5e9",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#666",
  },
  languageOptionTextActive: {
    color: "#0ea5e9",
    fontWeight: "600",
  },
  languageInfo: {
    flex: 1,
  },
  languageValue: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
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
