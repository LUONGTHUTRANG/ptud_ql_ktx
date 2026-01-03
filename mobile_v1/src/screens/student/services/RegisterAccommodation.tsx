import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";

type RegisterAccommodationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegisterAccommodation"
>;

interface Props {
  navigation: RegisterAccommodationScreenNavigationProp;
}

const RegisterAccommodation = ({ navigation }: Props) => {
  const { t } = useTranslation();
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
        <Text style={styles.headerTitle}>
          {t("semester.registerAccommodation")}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t("semester.selectRequestType")}</Text>
        <Text style={styles.subtitle}>
          {t("semester.selectRequestTypeDesc")}
        </Text>

        <View style={styles.optionsContainer}>
          {/* Option 1 */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate("RegularRequest")}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="home" size={32} color="#0ea5e9" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                {t("semester.regularAccommodation")}
              </Text>
              <Text style={styles.optionDescription}>
                {t("semester.regularAccommodationDesc")}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </TouchableOpacity>

          {/* Option 2 */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate("SpecialRequest")}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name="volunteer-activism"
                size={32}
                color="#0ea5e9"
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                {t("semester.specialAccommodation")}
              </Text>
              <Text style={styles.optionDescription}>
                {t("semester.specialAccommodationDesc")}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

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
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});

export default RegisterAccommodation;
