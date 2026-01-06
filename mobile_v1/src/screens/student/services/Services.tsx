//translated
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";

type ServicesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Services"
>;

interface Props {
  navigation: ServicesScreenNavigationProp;
}

const Services = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const services = [
    {
      title: t("semester.registerAccommodation"),
      description: t("semester.registerAccommodationDesc"),
      icon: "sensor-door",
      iconColor: "#2563eb",
      iconBg: "#dbeafe",
      path: "RegisterAccommodation",
    },
    {
      title: t("semester.extendAccommodation"),
      description: t("semester.extendAccommodationDesc"),
      icon: "autorenew",
      iconColor: "#16a34a",
      iconBg: "#dcfce7",
      path: "ExtendAccommodation",
    },
    {
      title: t("supportRequest.supportRequest"),
      description: t("supportRequest.supportRequestDesc"),
      icon: "support-agent",
      iconColor: "#ea580c",
      iconBg: "#ffedd5",
      path: "RequestHistory",
    },
    {
      title: t("invoice.payment"),
      description: t("invoice.paymentDesc"),
      icon: "receipt-long",
      iconColor: "#9333ea",
      iconBg: "#f3e8ff",
      path: "Bills",
    },
    {
      title: t("invoice.transactionHistory"),
      description: t("invoice.transactionHistoryDesc"),
      icon: "history",
      iconColor: "#dc2626",
      iconBg: "#fee2e2",
      path: "TransactionHistory",
    },
    {
      title: t("building.buildingAndRoom"),
      description: t("building.buildingAndRoomDesc"),
      icon: "apartment",
      iconColor: "#0d9488",
      iconBg: "#ccfbf1",
      path: "BuildingList",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>{t("common.services")}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (service.path !== "#") {
                  navigation.navigate(service.path as any);
                }
              }}
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

      <BottomNav role="student" />
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

export default Services;
