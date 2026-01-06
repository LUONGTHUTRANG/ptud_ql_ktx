import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import BottomNav from "../../../components/BottomNav";
import { getAvatarInitials } from "../../../utils/avatarHelper";
import { managerApi } from "../../../services/managerApi";

type ManagerStaffScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerStaff"
>;

interface Props {
  navigation: ManagerStaffScreenNavigationProp;
}

interface Staff {
  id: number;
  full_name: string;
  position: string;
  building_id?: number;
  is_active: boolean;
  phone_number?: string;
  email?: string;
}

const ManagerStaff = ({ navigation }: Props) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [searchText, setSearchText] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<
    "building" | "status" | null
  >(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Staff | null>(null);
  const [updatingStaff, setUpdatingStaff] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState(false);

  const buildingOptions = ["Tất cả", "Toàn khu", "Tòa A", "Tòa B", "Tòa C"];
  const statusOptions = ["Tất cả", "Hoạt động", "Ngừng hoạt động"];

  useFocusEffect(
    useCallback(() => {
      // Load staff data from API
      const loadStaff = async () => {
        try {
          setLoading(true);
          const response = await managerApi.getStaff();
          setStaffList(response);
          setLoading(false);
        } catch (error) {
          console.error("Failed to load staff", error);
          Alert.alert(t("common.error"), "Không thể tải danh sách cán bộ");
          setLoading(false);
        }
      };

      loadStaff();
    }, [])
  );

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchText.toLowerCase());

    const matchesBuilding =
      filterBuilding === "Tất cả" ||
      (filterBuilding === "Toàn khu" && staff.building_id === 0) ||
      (filterBuilding === "Tòa A" && staff.building_id === 1) ||
      (filterBuilding === "Tòa B" && staff.building_id === 2) ||
      (filterBuilding === "Tòa C" && staff.building_id === 3);

    const matchesStatus =
      filterStatus === "Tất cả" ||
      (filterStatus === "Hoạt động" && Boolean(staff.is_active)) ||
      (filterStatus === "Ngừng hoạt động" && !Boolean(staff.is_active));

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const buildingName = (buildingId?: number) => {
    if (buildingId === 0) return "Toàn khu";
    if (buildingId === 1) return "Tòa A";
    if (buildingId === 2) return "Tòa B";
    if (buildingId === 3) return "Tòa C";
    return "Chưa xác định";
  };

  const buildingIcon = (buildingId?: number) => {
    if (buildingId === 0) return "domain";
    return "apartment";
  };

  const buildingColor = (buildingId?: number) => {
    switch (buildingId) {
      case 0:
        return { icon: "#2563eb", bg: "#dbeafe" }; // Blue
      case 1:
        return { icon: "#ea580c", bg: "#ffedd5" }; // Orange
      case 2:
        return { icon: "#9333ea", bg: "#f3e8ff" }; // Purple
      case 3:
        return { icon: "#0d9488", bg: "#ccfbf1" }; // Teal
      default:
        return { icon: "#64748b", bg: "#e2e8f0" }; // Gray
    }
  };

  const handleAddStaff = () => {
    navigation.navigate("AddManager");
  };

  const handleStaffPress = (staff: Staff) => {
    setSelectedStaff(staff);
    setEditFormData(staff);
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  const handleOpenFilter = (type: "building" | "status") => {
    setActiveFilterType(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    if (activeFilterType === "building") {
      setFilterBuilding(option);
    } else if (activeFilterType === "status") {
      setFilterStatus(option);
    }
    setModalVisible(false);
  };

  const getActiveOptions = () => {
    switch (activeFilterType) {
      case "building":
        return buildingOptions;
      case "status":
        return statusOptions;
      default:
        return [];
    }
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    try {
      setUpdatingStaff(true);
      await managerApi.updateStaff(editFormData.id, {
        full_name: editFormData.full_name,
        email: editFormData.email,
        phone_number: editFormData.phone_number,
        building_id: editFormData.building_id,
        is_active: editFormData.is_active,
      });

      // Update local staff list
      setStaffList(
        staffList.map((s) => (s.id === editFormData.id ? editFormData : s))
      );
      setSelectedStaff(editFormData);
      setIsEditMode(false);
      Alert.alert("Thành công", "Cập nhật thông tin cán bộ thành công");
    } catch (error) {
      console.error("Failed to update staff", error);
      Alert.alert(t("common.error"), "Không thể cập nhật thông tin cán bộ");
    } finally {
      setUpdatingStaff(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData(selectedStaff);
    setIsEditMode(false);
  };

  const handleDeletePress = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;

    try {
      setDeletingStaff(true);
      await managerApi.deleteStaff(selectedStaff.id);

      // Remove from local list
      setStaffList(staffList.filter((s) => s.id !== selectedStaff.id));
      setShowDeleteConfirm(false);
      setShowDetailModal(false);
      Alert.alert("Thành công", "Xóa cán bộ thành công");
    } catch (error) {
      console.error("Failed to delete staff", error);
      Alert.alert(t("common.error"), "Không thể xóa cán bộ");
    } finally {
      setDeletingStaff(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeft}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý Cán bộ</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddManager")}
          style={styles.headerRight}
        >
          <MaterialIcons name="add" size={24} color="#136dec" />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên, tòa nhà..."
            placeholderTextColor="#cbd5e1"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterBuilding !== "Tất cả" && styles.activeFilterChip,
            ]}
            onPress={() => handleOpenFilter("building")}
          >
            <Text
              style={[
                styles.filterText,
                filterBuilding !== "Tất cả" && styles.activeFilterText,
              ]}
            >
              {filterBuilding === "Tất cả" ? "Tòa nhà" : filterBuilding}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={filterBuilding !== "Tất cả" ? "#136dec" : "#64748b"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus !== "Tất cả" && styles.activeFilterChip,
            ]}
            onPress={() => handleOpenFilter("status")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus !== "Tất cả" && styles.activeFilterText,
              ]}
            >
              {filterStatus === "Tất cả" ? "Trạng thái" : filterStatus}
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={filterStatus !== "Tất cả" ? "#136dec" : "#64748b"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Staff List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.staffListContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => {
              const colors = buildingColor(staff.building_id);
              return (
                <TouchableOpacity
                  key={staff.id}
                  onPress={() => handleStaffPress(staff)}
                  style={styles.staffCard}
                >
                  {/* Header Section */}
                  <View style={styles.staffCardHeader}>
                    <View style={styles.staffInfo}>
                      <View
                        style={[
                          styles.staffAvatar,
                          {
                            backgroundColor: getAvatarInitials(staff.full_name)
                              .color,
                          },
                        ]}
                      >
                        <Text style={styles.staffAvatarText}>
                          {getAvatarInitials(staff.full_name).initials}
                        </Text>
                      </View>
                      <View style={styles.staffNameSection}>
                        <Text style={styles.staffName}>{staff.full_name}</Text>
                        <Text style={styles.staffPosition}>
                          {staff.position}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: staff.is_active
                            ? "#dcfce7"
                            : "#f1f5f9",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color: Boolean(staff.is_active)
                              ? "#16a34a"
                              : "#64748b",
                          },
                        ]}
                      >
                        {Boolean(staff.is_active) ? "Hoạt động" : "Ngừng HĐ"}
                      </Text>
                    </View>
                  </View>

                  {/* Building Info */}
                  <View style={styles.staffCardFooter}>
                    <View style={styles.buildingInfo}>
                      <View
                        style={[
                          styles.buildingIcon,
                          { backgroundColor: colors.bg },
                        ]}
                      >
                        <MaterialIcons
                          name={buildingIcon(staff.building_id) as any}
                          size={18}
                          color={colors.icon}
                        />
                      </View>
                      <View>
                        <Text style={styles.buildingLabel}>Phụ trách</Text>
                        <Text style={styles.buildingValue}>
                          {buildingName(staff.building_id)}
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#cbd5e1"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Không tìm thấy cán bộ</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddStaff}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.filterModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.filterModalContent}>
                <Text style={styles.filterModalTitle}>
                  Chọn{" "}
                  {activeFilterType === "building" ? "Tòa nhà" : "Trạng thái"}
                </Text>
                {getActiveOptions().map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterModalOption}
                    onPress={() => handleSelectOption(option)}
                  >
                    <Text
                      style={[
                        styles.filterModalOptionText,
                        (activeFilterType === "building"
                          ? filterBuilding
                          : filterStatus) === option &&
                          styles.selectedFilterModalOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {(activeFilterType === "building"
                      ? filterBuilding
                      : filterStatus) === option && (
                      <MaterialIcons name="check" size={20} color="#136dec" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowDetailModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#1e293b" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Thông tin cán bộ</Text>
              <View style={{ width: 40 }} />
            </View>

            {selectedStaff && editFormData && (
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {!isEditMode ? (
                  <>
                    {/* View Mode */}
                    {/* Avatar */}
                    <View style={styles.modalAvatarSection}>
                      <View
                        style={[
                          styles.modalAvatar,
                          {
                            backgroundColor: getAvatarInitials(
                              selectedStaff.full_name
                            ).color,
                          },
                        ]}
                      >
                        <Text style={styles.modalAvatarText}>
                          {getAvatarInitials(selectedStaff.full_name).initials}
                        </Text>
                      </View>
                      <Text style={styles.modalName}>
                        {selectedStaff.full_name}
                      </Text>
                      <Text style={styles.modalPosition}>
                        {selectedStaff.position}
                      </Text>
                    </View>

                    {/* Info Items */}
                    <View style={styles.modalInfoSection}>
                      <View style={styles.infoItem}>
                        <MaterialIcons
                          name="apartment"
                          size={20}
                          color="#0ea5e9"
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Phụ trách</Text>
                          <Text style={styles.infoValue}>
                            {buildingName(selectedStaff.building_id)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoItem}>
                        <MaterialIcons name="phone" size={20} color="#0ea5e9" />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Số điện thoại</Text>
                          <Text style={styles.infoValue}>
                            {selectedStaff.phone_number || "Chưa cập nhật"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoItem}>
                        <MaterialIcons name="email" size={20} color="#0ea5e9" />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Email</Text>
                          <Text style={styles.infoValue}>
                            {selectedStaff.email || "Chưa cập nhật"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoItem}>
                        <MaterialIcons
                          name={
                            Boolean(selectedStaff.is_active)
                              ? "check-circle"
                              : "cancel"
                          }
                          size={20}
                          color={
                            Boolean(selectedStaff.is_active)
                              ? "#16a34a"
                              : "#ef4444"
                          }
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Trạng thái</Text>
                          <Text
                            style={[
                              styles.infoValue,
                              {
                                color: Boolean(selectedStaff.is_active)
                                  ? "#16a34a"
                                  : "#ef4444",
                              },
                            ]}
                          >
                            {Boolean(selectedStaff.is_active)
                              ? "Hoạt động"
                              : "Ngừng hoạt động"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditPress}
                      >
                        <MaterialIcons name="edit" size={20} color="#0ea5e9" />
                        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePress}
                      >
                        <MaterialIcons
                          name="delete"
                          size={20}
                          color="#ef4444"
                        />
                        <Text style={styles.deleteButtonText}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <View style={styles.editFormSection}>
                      <Text style={styles.editFormLabel}>Họ và tên</Text>
                      <TextInput
                        style={styles.editFormInput}
                        value={editFormData.full_name}
                        onChangeText={(text) =>
                          setEditFormData({
                            ...editFormData,
                            full_name: text,
                          })
                        }
                        placeholder="Nhập họ và tên"
                      />

                      <Text style={styles.editFormLabel}>Email</Text>
                      <TextInput
                        style={styles.editFormInput}
                        value={editFormData.email || ""}
                        onChangeText={(text) =>
                          setEditFormData({
                            ...editFormData,
                            email: text,
                          })
                        }
                        placeholder="Nhập email"
                        keyboardType="email-address"
                      />

                      <Text style={styles.editFormLabel}>Số điện thoại</Text>
                      <TextInput
                        style={styles.editFormInput}
                        value={editFormData.phone_number || ""}
                        onChangeText={(text) =>
                          setEditFormData({
                            ...editFormData,
                            phone_number: text,
                          })
                        }
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                      />

                      <View style={styles.statusToggleSection}>
                        <Text style={styles.editFormLabel}>Trạng thái</Text>
                        <View style={styles.statusToggle}>
                          <Text
                            style={[
                              styles.toggleLabel,
                              {
                                color: Boolean(editFormData.is_active)
                                  ? "#16a34a"
                                  : "#94a3b8",
                              },
                            ]}
                          >
                            {Boolean(editFormData.is_active)
                              ? "Hoạt động"
                              : "Ngừng hoạt động"}
                          </Text>
                          <Switch
                            value={Boolean(editFormData.is_active)}
                            onValueChange={(value) =>
                              setEditFormData({
                                ...editFormData,
                                is_active: value,
                              })
                            }
                            trackColor={{
                              false: "#cbd5e1",
                              true: "#4ade80",
                            }}
                            thumbColor={
                              editFormData.is_active ? "#16a34a" : "#94a3b8"
                            }
                          />
                        </View>
                      </View>
                    </View>

                    {/* Save/Cancel Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[
                          styles.editButton,
                          updatingStaff && { opacity: 0.6 },
                        ]}
                        onPress={handleSaveEdit}
                        disabled={updatingStaff}
                      >
                        {updatingStaff ? (
                          <ActivityIndicator size="small" color="#0ea5e9" />
                        ) : (
                          <>
                            <MaterialIcons
                              name="check"
                              size={20}
                              color="#0ea5e9"
                            />
                            <Text style={styles.editButtonText}>Lưu</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleCancelEdit}
                      >
                        <MaterialIcons name="close" size={20} color="#ef4444" />
                        <Text style={styles.deleteButtonText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDeleteConfirm(false)}>
          <View style={styles.confirmOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.confirmModalContent}>
                <View style={styles.confirmIconSection}>
                  <MaterialIcons name="warning" size={48} color="#ef4444" />
                </View>
                <Text style={styles.confirmTitle}>Xác nhận xóa</Text>
                <Text style={styles.confirmMessage}>
                  Bạn có chắc muốn xóa cán bộ{" "}
                  <Text style={{ fontWeight: "600" }}>
                    {selectedStaff?.full_name}
                  </Text>
                  ? Hành động này không thể hoàn tác.
                </Text>

                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={styles.confirmCancelButton}
                    onPress={() => setShowDeleteConfirm(false)}
                    disabled={deletingStaff}
                  >
                    <Text style={styles.confirmCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmDeleteButton,
                      deletingStaff && { opacity: 0.6 },
                    ]}
                    onPress={handleConfirmDelete}
                    disabled={deletingStaff}
                  >
                    {deletingStaff ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.confirmDeleteText}>Xóa</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 12,
  },
  headerLeft: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  filterSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  activeFilterChip: {
    backgroundColor: "rgba(19, 109, 236, 0.2)",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  activeFilterText: {
    color: "#136dec",
  },
  staffListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 100,
    gap: 12,
  },
  staffCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  staffCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  staffInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  staffAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  staffAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  staffNameSection: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  staffPosition: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  staffCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  buildingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buildingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buildingLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  buildingValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#136dec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#136dec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    marginTop: "auto",
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 24,
  },
  modalAvatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalAvatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  modalPosition: {
    fontSize: 14,
    color: "#64748b",
  },
  modalInfoSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0ea5e9",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  filterModalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  filterModalOptionText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedFilterModalOptionText: {
    color: "#136dec",
    fontWeight: "600",
  },
  editFormSection: {
    gap: 16,
  },
  editFormLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
  },
  editFormInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  statusToggleSection: {
    marginBottom: 12,
  },
  statusToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  confirmIconSection: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ManagerStaff;
