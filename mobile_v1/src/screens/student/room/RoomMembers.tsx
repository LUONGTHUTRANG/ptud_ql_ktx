import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import { studentApi } from "../../../services/studentApi";
import { getRoomById } from "../../../services/roomApi";
import { getMe } from "../../../services/authApi";

type RoomMembersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RoomMembers"
>;

interface Props {
  navigation: RoomMembersScreenNavigationProp;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  className: string;
  avatarUrl: string;
}

const RoomMembers = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await getMe();

      if (user && user.current_room_id) {
        const [studentsData, roomData] = await Promise.all([
          studentApi.getStudentsByRoom(user.current_room_id),
          getRoomById(user.current_room_id),
        ]);

        const mappedStudents = studentsData.map((s: any) => ({
          id: s.id.toString(),
          name: s.full_name,
          studentId: s.mssv,
          className: s.class_name,
          avatarUrl:
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(s.full_name) +
            "&background=random",
        }));

        setStudents(mappedStudents);

        if (studentsData.length > 0) {
          setRoomName(
            `${t("room.roomName")} ${studentsData[0].room_number} - ${t(
              "building.building"
            )} ${studentsData[0].building_name}`
          );
        } else {
          setRoomName(`Phòng ${roomData.room_number}`);
        }
      } else {
        Alert.alert("Thông báo", "Bạn chưa được xếp vào phòng nào.");
      }
    } catch (error) {
      console.error("Error fetching room members:", error);
      Alert.alert(t("common.error"), "Không thể tải danh sách thành viên.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentId}>
            {item.studentId} - {item.className}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
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
          {roomName || "Danh sách thành viên"}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons
            name="search"
            size={24}
            color="#64748b"
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

      {/* Student List */}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
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
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: "#e2e8f0",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: "#64748b",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default RoomMembers;
