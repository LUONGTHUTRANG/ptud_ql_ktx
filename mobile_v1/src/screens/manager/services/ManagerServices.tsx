import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";

type ManagerServicesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerServices"
>;

interface Props {
  navigation: ManagerServicesScreenNavigationProp;
}

const ManagerServices = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<"admin" | "manager" | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUserRole = async () => {
        try {
          const role = await AsyncStorage.getItem("role");
          console.log("Loaded user role:", role);
          setUserRole(role as "admin" | "manager");
        } catch (error) {
          console.error("Failed to load user role", error);
        }
      };

      loadUserRole();
    }, [])
  );

  const baseServices = [
    {
      title: t("manager.manageStudents"),
      description: t("manager.manageStudentsDesc"),
      icon: "people",
      iconColor: "#2563eb",
      iconBg: "#dbeafe",
      path: "StudentList",
      requiredRole: undefined,
    },
    {
      title: t("manager.manageRooms"),
      description: t("manager.manageRoomsDesc"),
      icon: "apartment",
      iconColor: "#0d9488",
      iconBg: "#ccfbf1",
      path: "BuildingList",
      requiredRole: undefined,
    },
    {
      title: t("manager.supportRequest"),
      description: t("manager.supportRequestDesc"),
      icon: "support-agent",
      iconColor: "#ea580c",
      iconBg: "#ffedd5",
      path: "ManagerRegularRequest",
      requiredRole: undefined,
    },
    {
      title: t("manager.approveSpecialRequest"),
      description: t("manager.approveSpecialRequestDesc"),
      icon: "assignment-late",
      iconColor: "#db2777",
      iconBg: "#fce7f3",
      path: "ManageRegistration", // giữ path cũ
      requiredRole: undefined,
    },
    {
      title: t("manager.manageBills"),
      description: t("manager.manageBillsDesc"),
      icon: "receipt-long",
      iconColor: "#9333ea",
      iconBg: "#f3e8ff",
      path: "ManagerBills",
      requiredRole: undefined,
    },
    {
      title: t("manager.manageNotifications"),
      description: t("manager.manageNotificationsDesc"),
      icon: "notifications",
      iconColor: "#ca8a04",
      iconBg: "#fef9c3",
      path: "ManagerNotifications",
      requiredRole: undefined,
    },
    {
      title: t("manager.manageTerm"),
      description: t("manager.manageTermDesc"),
      icon: "date-range",
      iconColor: "#4f46e5",
      iconBg: "#e0e7ff",
      path: "ManagerTerm",
      requiredRole: "admin",
    },
    {
      title: t("manager.manageStaff"),
      description: t("manager.manageStaffDesc"),
      icon: "badge",
      iconColor: "#6b21a8",
      iconBg: "#fce7f3",
      path: "ManagerStaff",
      requiredRole: "admin",
    },
  ];

  const filteredServices = baseServices.filter((service) => {
    if (service.requiredRole === "admin" && userRole !== "admin") {
      return false;
    }
    return true;
  });

  const handleNavigate = (service: (typeof baseServices)[0]) => {
    if (service.requiredRole === "admin" && userRole !== "admin") {
      Alert.alert(t("manager.permission"), t("manager.permissionDesc"));
      return;
    }
    navigation.navigate(service.path as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>{t("manager.managerServices")}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {filteredServices.map((service, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavigate(service)}
              style={styles.card}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: service.iconBg },
                ]}
              >
                <MaterialIcons
                  name={service.icon as any}
                  size={32}
                  color={service.iconColor}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDescription}>
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNav role="manager" />
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
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
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
    paddingBottom: 100, // Space for BottomNav
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    width: "47%", // Approximate for 2 columns with gap
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  textContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
});

export default ManagerServices;
