import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { RootStackParamList } from "../../../types";
import { studentApi } from "../../../services/studentApi";
import { fetchBuildings } from "../../../services/buildingApi";
import { fetchRooms } from "../../../services/roomApi";
import { useTranslation } from "react-i18next";
type StudentListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "StudentList"
>;

interface Props {
  navigation: StudentListScreenNavigationProp;
}

interface StudentItem {
  id: string;
  name: string;
  studentId: string;
  room: string;
  building: string;
  status: string;
}

const StudentList = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState<string>("building");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [buildingData, setBuildingData] = useState<
    { label: string; value: string }[]
  >([]);
  const [roomData, setRoomData] = useState<{ label: string; value: string }[]>(
    []
  );

  const filterTypeData = [
    { label: t("building.building"), value: "building" },
    { label: t("room.roomName"), value: "room" },
  ];

  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        try {
          const [buildings, rooms] = await Promise.all([
            fetchBuildings(),
            fetchRooms(),
          ]);

          setBuildingData(
            buildings.map((b: any) => ({
              label: b.name,
              value: b.id.toString(),
            }))
          );
          setRoomData(
            rooms.map((r: any) => ({
              label: r.room_number,
              value: r.id.toString(),
            }))
          );

          fetchStudents();
        } catch (error) {
          console.error("Failed to load initial data", error);
        }
      };
      loadInitialData();
    }, [])
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        if (filterType === "building") {
          data = await studentApi.getStudentsByBuilding(searchQuery);
        } else {
          data = await studentApi.getStudentsByRoom(searchQuery);
        }
      } else {
        const response = await studentApi.getAllStudents();
        data = response.data;
      }

      console.log("Fetched Students:", data);

      // Map backend data to frontend model
      // Note: Backend might need to return room and building info with student
      // Assuming backend returns joined data or we need to handle it
      const mappedStudents = data.map((s: any) => ({
        id: s.id.toString(),
        name: s.full_name,
        studentId: s.mssv,
        room: s.room_number || "N/A", // Needs backend to join rooms
        building: s.building_name || "N/A", // Needs backend to join buildings
        status: s.stay_status === "STAYING" ? t("student.staying") : t("student.notStaying"),
      }));
      setStudents(mappedStudents);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filter changes
  React.useEffect(() => {
    fetchStudents();
  }, [searchQuery, filterType]);

  const renderItem = ({ item }: { item: StudentItem }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={32} color="#0ea5e9" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo}>{t("student.studentId")}: {item.studentId}</Text>
        {item.status === "Đang ở" && (
          <Text style={styles.itemSubInfo}>
            {item.building} - {item.room}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.statusContainer,
          item.status === t("student.notStaying") && styles.statusContainerInactive,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            item.status === t("student.notStaying") && styles.statusTextInactive,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>{t("student.studentList")}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          {/* Filter Type Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              containerStyle={styles.dropdownContainer}
              data={filterTypeData}
              labelField="label"
              valueField="value"
              placeholder="Loại"
              value={filterType}
              onChange={(item) => {
                setFilterType(item.value);
                setSearchQuery("");
              }}
            />
          </View>

          {/* Value Dropdown */}
          <View style={[styles.dropdownWrapper, { flex: 1 }]}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              containerStyle={styles.dropdownContainer}
              data={filterType === "building" ? buildingData : roomData}
              labelField="label"
              valueField="value"
              placeholder={
                filterType === "building" ? t("registration.selectBuilding") : t("registration.selectRoom")
              }
              value={searchQuery}
              onChange={(item) => {
                setSearchQuery(item.value);
              }}
            />
          </View>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Không tìm thấy sinh viên nào</Text>
            </View>
          }
        />
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
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  dropdownWrapper: {
    width: 120,
  },
  dropdown: {
    height: 40,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#0f172a",
  },
  itemTextStyle: {
    fontSize: 14,
    color: "#0f172a",
  },
  dropdownContainer: {
    borderRadius: 8,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  itemInfo: {
    fontSize: 14,
    color: "#64748b",
  },
  itemSubInfo: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
  statusContainerInactive: {
    backgroundColor: "#f1f5f9",
  },
  statusTextInactive: {
    color: "#64748b",
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#dcfce7",
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#16a34a",
  },
});

export default StudentList;
