import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type RoomListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RoomList"
>;
type RoomListScreenRouteProp = RouteProp<RootStackParamList, "RoomList">;

interface Props {
  navigation: RoomListScreenNavigationProp;
  route: RoomListScreenRouteProp;
}

interface RoomItem {
  id: string;
  name: string;
  price: string;
  status: "available" | "full" | "maintenance";
  capacity: number;
  hasAC: boolean;
  hasHeater: boolean;
  hasBalcony: boolean;
}

const RoomList = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Data
  const rooms: RoomItem[] = [
    {
      id: "101",
      name: "Phòng 101",
      price: "1.500.000 VNĐ/tháng",
      status: "available",
      capacity: 8,
      hasAC: true,
      hasHeater: true,
      hasBalcony: true,
    },
    {
      id: "102",
      name: "Phòng 102",
      price: "1.500.000 VNĐ/tháng",
      status: "full",
      capacity: 8,
      hasAC: true,
      hasHeater: true,
      hasBalcony: false,
    },
    {
      id: "103",
      name: "Phòng 103",
      price: "1.200.000 VNĐ/tháng",
      status: "maintenance",
      capacity: 6,
      hasAC: false,
      hasHeater: true,
      hasBalcony: false,
    },
    {
      id: "201",
      name: "Phòng 201",
      price: "1.700.000 VNĐ/tháng",
      status: "available",
      capacity: 6,
      hasAC: true,
      hasHeater: true,
      hasBalcony: true,
    },
  ];

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: RoomItem["status"]) => {
    switch (status) {
      case "available":
        return { bg: "#dcfce7", text: "#15803d", label: "Còn trống" };
      case "full":
        return { bg: "#ffedd5", text: "#c2410c", label: "Đã đầy" };
      case "maintenance":
        return { bg: "#fee2e2", text: "#b91c1c", label: "Bảo trì" };
    }
  };

  const renderItem = ({ item }: { item: RoomItem }) => {
    const statusStyle = getStatusBadge(item.status);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Giá: {item.price}</Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View style={styles.amenitiesGrid}>
          <View style={styles.amenityItem}>
            <MaterialIcons name="group" size={18} color="#64748b" />
            <Text style={styles.amenityText}>
              Sức chứa: {item.capacity} người
            </Text>
          </View>
          <View style={styles.amenityItem}>
            <MaterialIcons
              name="ac-unit"
              size={18}
              color={item.hasAC ? "#334155" : "#94a3b8"}
            />
            <Text
              style={[
                styles.amenityText,
                !item.hasAC && styles.amenityDisabled,
              ]}
            >
              Điều hòa: {item.hasAC ? "Có" : "Không"}
            </Text>
          </View>
          <View style={styles.amenityItem}>
            <MaterialIcons
              name="water-drop"
              size={18}
              color={item.hasHeater ? "#334155" : "#94a3b8"}
            />
            <Text
              style={[
                styles.amenityText,
                !item.hasHeater && styles.amenityDisabled,
              ]}
            >
              Nóng lạnh: {item.hasHeater ? "Có" : "Không"}
            </Text>
          </View>
          <View style={styles.amenityItem}>
            <MaterialIcons
              name="balcony"
              size={18}
              color={item.hasBalcony ? "#334155" : "#94a3b8"}
            />
            <Text
              style={[
                styles.amenityText,
                !item.hasBalcony && styles.amenityDisabled,
              ]}
            >
              Ban công: {item.hasBalcony ? "Có" : "Không"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Quản lý phòng - Nhà {id || "A1"}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={24}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm số phòng..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Giá</Text>
            <MaterialIcons name="expand-more" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Sức chứa</Text>
            <MaterialIcons name="expand-more" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Điều hòa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Nóng lạnh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Ban công</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredRooms}
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
  filterSection: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#f8fafc",
    zIndex: 1,
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
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  itemContainer: {
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
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // 2 columns
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: "#334155",
  },
  amenityDisabled: {
    color: "#94a3b8",
  },
});

export default RoomList;
