import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { fetchRooms } from "../../../services/roomApi";

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
  price: number;
  status: "AVAILABLE" | "FULL" | "MAINTENANCE";
  capacity: number;
  hasAC: boolean;
  hasHeater: boolean;
  hasWasher: boolean;
}

const RoomList = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { id, name, selectMode, onSelectRoom } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Filter states
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [filterAC, setFilterAC] = useState(false);
  const [filterHeater, setFilterHeater] = useState(false);
  const [filterWasher, setFilterWasher] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<
    "price" | "capacity" | null
  >(null);

  const priceOptions = [
    { label: t("room.all"), value: null },
    { label: `${t("room.lessThan")} 2,000,000`, value: 2000000 },
    { label: `${t("room.lessThan")} 3,000,000`, value: 3000000 },
    { label: `${t("room.lessThan")} 4,000,000`, value: 4000000 },
    { label: `${t("room.moreThan")} 4,000,000`, value: 4000001 },
  ];

  const capacityOptions = [
    { label: t("room.all"), value: null },
    { label: `4 ${t("room.people")}`, value: 4 },
    { label: `6 ${t("room.people")}`, value: 6 },
    { label: `8 ${t("room.people")}`, value: 8 },
    { label: `10 ${t("room.people")}`, value: 10 },
  ];

  const handleOpenFilter = (type: "price" | "capacity") => {
    setActiveFilterType(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: {
    label: string;
    value: number | null;
  }) => {
    if (activeFilterType === "price") {
      setSelectedPrice(option.value);
    } else if (activeFilterType === "capacity") {
      setSelectedCapacity(option.value);
    }
    setModalVisible(false);
  };

  const getActiveOptions = () => {
    switch (activeFilterType) {
      case "price":
        return priceOptions;
      case "capacity":
        return capacityOptions;
      default:
        return [];
    }
  };

  useEffect(() => {
    loadRooms();
  }, [id]);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      // Filter rooms by building_id (id from params)
      const buildingRooms = data.filter(
        (room: any) => String(room.building_id) === String(id)
      );

      const mappedRooms = buildingRooms.map((item: any) => ({
        id: String(item.id),
        name: `${t("room.roomName")} ${item.room_number}`,
        price: Number(item.price_per_semester),
        status: item.status || "available",
        capacity: item.max_capacity,
        hasAC: Boolean(item.has_ac),
        hasHeater: Boolean(item.has_heater),
        hasWasher: Boolean(item.has_washer),
      }));
      setRooms(mappedRooms);
    } catch (error) {
      console.error("Failed to load rooms", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice = selectedPrice
      ? selectedPrice > 4000000
        ? r.price >= 4000000
        : r.price <= selectedPrice
      : true;
    const matchesCapacity = selectedCapacity
      ? r.capacity === selectedCapacity
      : true;
    const matchesAC = filterAC ? r.hasAC : true;
    const matchesHeater = filterHeater ? r.hasHeater : true;
    const matchesWasher = filterWasher ? r.hasWasher : true;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesCapacity &&
      matchesAC &&
      matchesHeater &&
      matchesWasher
    );
  });

  const getStatusBadge = (status: RoomItem["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return { bg: "#dcfce7", text: "#15803d", label: t("room.available") };
      case "FULL":
        return { bg: "#ffedd5", text: "#c2410c", label: t("room.full") };
      case "MAINTENANCE":
        return { bg: "#fee2e2", text: "#b91c1c", label: t("room.underMaintenance") };
      default:
        return { bg: "#f1f5f9", text: "#475569", label: status };
    }
  };

  const renderItem = ({ item }: { item: RoomItem }) => {
  const statusStyle = getStatusBadge(item.status);
  const isSelectable = item.status === "AVAILABLE" && selectMode;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!isSelectable}
      onPress={() => {
        if (!selectMode || !onSelectRoom) return;

        onSelectRoom({
          id: item.id,
          name: item.name,
          price: item.price,
        });

        navigation.goBack();
      }}
      style={[
        styles.itemContainer,
        !isSelectable && selectMode && styles.disabledItem,
      ]}
    >
      {/* HEADER */}
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            {t("room.price")}: {item.price.toLocaleString()} VNĐ/{t("semester.semester")}
          </Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* AMENITIES GRID (GIỮ NGUYÊN, KHÔNG COMPONENT RIÊNG) */}
      <View style={styles.amenitiesGrid}>
        <View style={styles.amenityItem}>
          <MaterialIcons name="group" size={18} color="#64748b" />
          <Text style={styles.amenityText}>
            {t("room.capacity")}: {item.capacity} {t("room.people")}
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
            {t("room.ac")}: {item.hasAC ? t("room.yes") : t("room.no")}
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
            {t("room.heater")}: {item.hasHeater ? t("room.yes") : t("room.no")}
          </Text>
        </View>

        <View style={styles.amenityItem}>
          <MaterialIcons
            name="local-laundry-service"
            size={18}
            color={item.hasWasher ? "#334155" : "#94a3b8"}
          />
          <Text
            style={[
              styles.amenityText,
              !item.hasWasher && styles.amenityDisabled,
            ]}
          >
            {t("room.washer")}: {item.hasWasher ? t("room.yes") : t("room.no")}
          </Text>
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
        <Text style={styles.headerTitle}>{t("room.roomList")} - {t("building.building")} {name}</Text>
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
            placeholder={t("room.findByRoomNumber")}
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
          {/* Price Filter */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPrice !== null && styles.filterButtonActive,
            ]}
            onPress={() => handleOpenFilter("price")}
          >
            <Text
              style={[
                styles.filterText,
                selectedPrice !== null && styles.filterTextActive,
              ]}
            >
              {selectedPrice
                ? selectedPrice > 4000000
                  ? "> 4,000,000"
                  : `< ${selectedPrice.toLocaleString()}`
                : t("room.price")}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={selectedPrice !== null ? "#0ea5e9" : "#64748b"}
            />
          </TouchableOpacity>

          {/* Capacity Filter */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCapacity !== null && styles.filterButtonActive,
            ]}
            onPress={() => handleOpenFilter("capacity")}
          >
            <Text
              style={[
                styles.filterText,
                selectedCapacity !== null && styles.filterTextActive,
              ]}
            >
              {selectedCapacity ? `${selectedCapacity} người` : t("room.capacity")}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={selectedCapacity !== null ? "#0ea5e9" : "#64748b"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterAC && styles.filterButtonActive]}
            onPress={() => setFilterAC(!filterAC)}
          >
            <Text
              style={[styles.filterText, filterAC && styles.filterTextActive]}
            >
              {t("room.hasAC")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterHeater && styles.filterButtonActive,
            ]}
            onPress={() => setFilterHeater(!filterHeater)}
          >
            <Text
              style={[
                styles.filterText,
                filterHeater && styles.filterTextActive,
              ]}
            >
              {t("room.hasHeater")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterWasher && styles.filterButtonActive,
            ]}
            onPress={() => setFilterWasher(!filterWasher)}
          >
            <Text
              style={[
                styles.filterText,
                filterWasher && styles.filterTextActive,
              ]}
            >
              {t("room.hasWasher")}
            </Text>
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

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {activeFilterType === "price"
                    ? t("room.selectPrice")
                    : t("room.selectCapacity")}
                </Text>
                {getActiveOptions().map((option, index) => {
                  const isSelected =
                    activeFilterType === "price"
                      ? selectedPrice === option.value
                      : selectedCapacity === option.value;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalOption}
                      onPress={() => handleSelectOption(option)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.selectedModalOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check" size={20} color="#0ea5e9" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  filterButtonActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#0ea5e9",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  filterTextActive: {
    color: "#0284c7",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedModalOptionText: {
    color: "#0ea5e9",
    fontWeight: "600",
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
  disabledItem: {
  opacity: 0.5,
},

tapHint: {
  marginTop: 12,
  textAlign: "center",
  fontSize: 13,
  fontWeight: "600",
  color: "#0ea5e9",
},
});

export default RoomList;
