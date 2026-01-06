import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import { getManagerRegistrations } from "../../../services/registrationApi";
import { t } from "i18next";

type ManagerRegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManageRegistration"
>;

interface Props {
  navigation: ManagerRegistrationScreenNavigationProp;
}

interface RegistrationItem {
  id: string;
  name: string;
  studentId: string;
  type: "NORMAL" | "PRIORITY";
  room?: string; // chỉ có NORMAL
  circumstance?: string; // chỉ có PRIORITY
  date: string;
  status: "pending" | "approved" | "rejected" | "return" | "completed";
}

const getCircumstanceText = (category: string) => {
  switch (category) {
    case "POOR_HOUSEHOLD":
      return t("registration.poorHousehold");
    case "DISABILITY":
      return t("registration.disability");
    case "OTHER":
      return t("registration.other");
    default:
      return category;
  }
};

const ManageRegistration = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "return" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [registrationType, setRegistrationType] = useState<
    "NORMAL" | "PRIORITY"
  >("PRIORITY");

  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getManagerRegistrations(registrationType);

      const mapped = res.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.student_name,
        studentId: item.mssv,
        type: item.registration_type,
        room: item.room_number
          ? `${t("room.roomName")} ${item.room_number}`
          : undefined,
        circumstance: item.priority_category
          ? getCircumstanceText(item.priority_category)
          : undefined,
        date: new Date(item.created_at).toLocaleDateString("locale"),
        status: item.status.toLowerCase(),
      }));

      setRegistrations(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [registrationType]);

  useFocusEffect(
    useCallback(() => {
      fetchRegistrations();
    }, [fetchRegistrations])
  );

  const filteredRequests = useMemo(() => {
    return registrations.filter((req) => {
      const matchesFilter = filter === "all" || req.status === filter;
      const matchesSearch =
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.studentId.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  }, [registrations, filter, searchQuery]);

  const getStatusColor = (status: RegistrationItem["status"]) => {
    switch (status) {
      case "pending":
        return "#FFC107"; // Yellow
      case "approved":
        return "#4CAF50"; // Green
      case "rejected":
        return "#F44336"; // Red
      case "return":
        return "#FF9800"; // Orange
      case "completed":
        return "#2196F3"; // Blue
      default:
        return "#94a3b8";
    }
  };

  const getStatusText = (status: RegistrationItem["status"]) => {
    switch (status) {
      case "pending":
        return t("manageRegistration.pending");
      case "approved":
        return t("manageRegistration.approved");
      case "rejected":
        return t("manageRegistration.rejected");
      case "return":
        return t("manageRegistration.return");
      case "completed":
        return t("manageRegistration.completed");
      default:
        return "Không xác định";
    }
  };

  const renderItem = ({ item }: { item: RegistrationItem }) => {
    const isPriority = item.type === "PRIORITY";
    const isNormal = item.type === "NORMAL";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("ManageRegistrationDetail", {
            id: item.id,
          })
        }
      >
        {/* Status strip */}
        <View
          style={[
            styles.statusStrip,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />

        <View style={styles.cardContent}>
          {/* ===== Header ===== */}
          <View style={styles.rowHeader}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.studentId}>
                {t("student.studentId")}: {item.studentId}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ===== Details ===== */}
          <View style={styles.rowDetails}>
            {/* Left info */}
            <View style={styles.detailItem}>
              {isPriority && item.circumstance && (
                <>
                  <Text style={styles.detailLabel}>
                    {t("manageRegistration.circumstance")}:
                  </Text>
                  <Text style={styles.detailValue}>{item.circumstance}</Text>
                </>
              )}

              {isNormal && item.room && (
                <>
                  <Text style={styles.detailLabel}>
                    {t("registration.expectedRoom")}:
                  </Text>
                  <Text style={styles.detailValue}>{item.room}</Text>
                </>
              )}
            </View>

            {/* Right info */}
            <View style={[styles.detailItem, { alignItems: "flex-end" }]}>
              <Text style={styles.detailLabel}>
                {t("manageRegistration.submissionDate")}:
              </Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

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
          {t("manager.approveRegistration")}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.typeTabs}>
        <TouchableOpacity
          style={[
            styles.typeTab,
            registrationType === "PRIORITY" && styles.activeTypeTab,
          ]}
          onPress={() => setRegistrationType("PRIORITY")}
        >
          <Text
            style={[
              styles.typeTabText,
              registrationType === "PRIORITY" && styles.activeTypeTabText,
            ]}
          >
            {t("manageRegistration.priority")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTab,
            registrationType === "NORMAL" && styles.activeTypeTab,
          ]}
          onPress={() => setRegistrationType("NORMAL")}
        >
          <Text
            style={[
              styles.typeTabText,
              registrationType === "NORMAL" && styles.activeTypeTabText,
            ]}
          >
            {t("manageRegistration.normal")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={24}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("student.searchPlaceholder")}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "all" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.activeFilterText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "pending" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("pending")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "pending" && styles.activeFilterText,
              ]}
            >
              {t("manageRegistration.pending")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "approved" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("approved")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "approved" && styles.activeFilterText,
              ]}
            >
              {t("manageRegistration.approved")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "rejected" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("rejected")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "rejected" && styles.activeFilterText,
              ]}
            >
              {t("manageRegistration.rejected")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "return" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("return")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "return" && styles.activeFilterText,
              ]}
            >
              {t("manageRegistration.return")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === "completed" && styles.activeFilterChip,
            ]}
            onPress={() => setFilter("completed")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "completed" && styles.activeFilterText,
              ]}
            >
              {t("manageRegistration.completed")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchRegistrations}
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
  typeTabs: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },

  typeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  activeTypeTab: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  typeTabText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },

  activeTypeTabText: {
    color: "#0f172a",
    fontWeight: "700",
  },

  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterChip: {
    backgroundColor: "#136dec", // Primary color from HTML
    borderColor: "#136dec",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusStrip: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  studentId: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  rowDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
});

export default ManageRegistration;
