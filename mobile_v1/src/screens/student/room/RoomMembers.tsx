import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

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
  avatarUrl: string;
}

const RoomMembers = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const students: Student[] = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      studentId: "B20DCCN001",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmF6yoO_jA0dwmwkHM8e7OF8YIMV2x3E6gMNy9aWFzvRquOw_vLuA1_tNTSGVmRq-TQUAiUp4WI83ZDkvh3REL8OfLU7B3LigDheZQ6VHWA1gyAhOFZrCN9v6fVYL0tAXOB9HskR0t3Lwefogy3qmmcV8R6pvaYRmCV5y9Wuy2Qea-wrhDpjtjELRwZrcz1a3BOvCDhu4N1qGjOP-2rdpfXTDEM24P9To6hlK79v5SUI4yM73LVYPQiKZchq6GVUzyf8ngS4MSpMo",
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      studentId: "B20DCCN002",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuARjhHw_xEuY8e6b3JSG1HvwfFIOQzCHgCFd0Iv5ntrieyHYWeIg-7FervAaAUvXs3vVsrM2BKosecBTQAX6Q5LTa-nK2doGAee8U2Pu8-sjuu9rgtFBrkGSD-dypNweuthIsTgsEWX7b2ZmleWhVoLcRKlEexqt2nW1CntFhCVTlbG9oCKg1b8J5d5siIScGztdL65iH5fa6YtMOt3WVjd2t_bzrD6MMw5ybdt4jXXvJ4_FqrO41nQiWx3a9f7T5BgyEbo_58Qq8Y",
    },
    {
      id: "3",
      name: "Lê Văn Cường",
      studentId: "B20DCCN003",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAE1aGL6D4-3n2RaWRESi2ld-74vmGTUXXP4RQJGd39U59kq79ObBdRBVeU97qpDtMfqdPyK_8MCNEO2p-21-tG9O6xO7rmhFTuf2BM758a_Vxpkv6IozpTGVXWOpC3itier2jYOlQAOFLy8fXK5ALoHJh7r87XBPyvxnG35G9prVW7u7j7sFu9hJiYxD1byHaLbQqZI5ykdcqIcC3N_n9W4_efYrr3shq_v5X5Rhq91VTMRFt4ETm2JCsqxVHJzvw6NAm0EzPPNFw",
    },
  ];

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
          <Text style={styles.studentId}>{item.studentId}</Text>
        </View>
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
        <Text style={styles.headerTitle}>Phòng 101 - Tòa A</Text>
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
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
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
