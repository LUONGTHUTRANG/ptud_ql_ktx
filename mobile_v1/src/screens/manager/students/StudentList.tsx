import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { RootStackParamList } from "../../../types";

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
  const [filterType, setFilterType] = useState<string>("building");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTypeData = [
    { label: "Tòa nhà", value: "building" },
    { label: "Phòng", value: "room" },
  ];

  const buildingData = [
    { label: "Tòa A1", value: "A1" },
    { label: "Tòa B1", value: "B1" },
    { label: "Tòa C1", value: "C1" },
    { label: "Tòa G6", value: "G6" },
    { label: "Tòa A2", value: "A2" },
  ];

  const roomData = [
    { label: "Phòng 101", value: "101" },
    { label: "Phòng 102", value: "102" },
    { label: "Phòng 201", value: "201" },
    { label: "Phòng 305", value: "305" },
  ];

  const students: StudentItem[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      studentId: "SV001",
      room: "101",
      building: "A1",
      status: "Đang ở",
    },
    {
      id: "2",
      name: "Trần Thị B",
      studentId: "SV002",
      room: "102",
      building: "A1",
      status: "Đang ở",
    },
    {
      id: "3",
      name: "Lê Văn C",
      studentId: "SV003",
      room: "201",
      building: "B1",
      status: "Đang ở",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      studentId: "SV004",
      room: "305",
      building: "G6",
      status: "Đang ở",
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      studentId: "SV005",
      room: "101",
      building: "A2",
      status: "Đang ở",
    },
  ];

  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    if (filterType === "building") {
      return s.building === searchQuery;
    } else {
      return s.room === searchQuery;
    }
  });

  const renderItem = ({ item }: { item: StudentItem }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={32} color="#0ea5e9" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo}>MSSV: {item.studentId}</Text>
        <Text style={styles.itemSubInfo}>
          {item.building} - P.{item.room}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{item.status}</Text>
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
        <Text style={styles.headerTitle}>Danh sách sinh viên</Text>
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
                filterType === "building" ? "Chọn tòa nhà" : "Chọn phòng"
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
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
