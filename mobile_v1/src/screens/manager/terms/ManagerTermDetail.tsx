import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

type ManagerTermDetailRouteProp = RouteProp<
  RootStackParamList,
  "ManagerTermDetail"
>;

const parseDateSafe = (value: any): Date | null => {
  if (!value) return null;
  // if already a Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  // try to parse string/number
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateTime = (d: Date | null) => {
  if (!d) return "Chưa chọn";
  if (isNaN(d.getTime())) return "Chưa chọn";
  // Locale formatted string without seconds (DD/MM/YYYY, HH:MM)
  try {
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    // fallback
    const dd = d.getDate().toString().padStart(2, "0");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = d.getHours().toString().padStart(2, "0");
    const min = d.getMinutes().toString().padStart(2, "0");
    return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
  }
};

const ManagerTermDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<ManagerTermDetailRouteProp>();
  const { mode, term } = route.params || { mode: "create" };

  const [termName, setTermName] = useState("");

  // Date states (null means not selected)
  const [normalOpen, setNormalOpen] = useState<Date | null>(null);
  const [normalClose, setNormalClose] = useState<Date | null>(null);
  const [specialOpen, setSpecialOpen] = useState<Date | null>(null);
  const [specialClose, setSpecialClose] = useState<Date | null>(null);
  const [extensionOpen, setExtensionOpen] = useState<Date | null>(null);
  const [extensionClose, setExtensionClose] = useState<Date | null>(null);

  // Picker control
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [activeField, setActiveField] = useState<
    | null
    | "normalOpen"
    | "normalClose"
    | "specialOpen"
    | "specialClose"
    | "extensionOpen"
    | "extensionClose"
  >(null);

  // Temp date between date->time on Android
  const [tempDate, setTempDate] = useState<Date | null>(null);

  useEffect(() => {
    if (mode === "edit" && term) {
      setTermName(term.title || "");
      // parse safely; if parse fails -> null
      setNormalOpen(parseDateSafe(term.regular?.start));
      setNormalClose(parseDateSafe(term.regular?.end));
      setSpecialOpen(parseDateSafe(term.special?.start));
      setSpecialClose(parseDateSafe(term.special?.end));
      setExtensionOpen(parseDateSafe(term.extension?.start));
      setExtensionClose(parseDateSafe(term.extension?.end));
    }
  }, [mode, term]);

  const handleSave = () => {
    console.log("Saving term:", {
      termName,
      normal: { open: normalOpen, close: normalClose },
      special: { open: specialOpen, close: specialClose },
      extension: { open: extensionOpen, close: extensionClose },
    });
    navigation.goBack();
  };

  const openDateTime = (field: typeof activeField) => {
    setActiveField(field);
    setTempDate(null);
    if (Platform.OS === "ios") {
      // iOS: show inline datetime (single control)
      setPickerMode("date"); // initial, but we'll render mode="datetime" on iOS
      setShowPicker(true);
    } else {
      // Android: first date then time
      setPickerMode("date");
      setShowPicker(true);
    }
  };

  const commitValueToField = (field: typeof activeField, date: Date) => {
    if (!field) return;
    if (field === "normalOpen") setNormalOpen(date);
    if (field === "normalClose") setNormalClose(date);
    if (field === "specialOpen") setSpecialOpen(date);
    if (field === "specialClose") setSpecialClose(date);
    if (field === "extensionOpen") setExtensionOpen(date);
    if (field === "extensionClose") setExtensionClose(date);
  };

  const onPickerChange = (event: any, selected?: Date) => {
    const isDismissed =
      event?.type === "dismissed" ||
      // fallback: Android may pass undefined selected when cancelled
      (selected === undefined && Platform.OS === "android");

    if (isDismissed) {
      setShowPicker(false);
      setTempDate(null);
      setActiveField(null);
      setPickerMode("date");
      return;
    }

    if (!selected) {
      return;
    }

    if (Platform.OS === "ios") {
      // iOS inline: selected contains both date + time when mode="datetime"
      commitValueToField(activeField, selected);
      // keep picker open on iOS (user can keep adjusting). If wanted, uncomment to auto-close:
      // setShowPicker(false); setActiveField(null);
      return;
    }

    // Android flow: first date -> then time
    if (Platform.OS === "android") {
      if (pickerMode === "date") {
        // store date part then ask time
        setTempDate(selected);
        setPickerMode("time");
        setShowPicker(true);
        return;
      }

      if (pickerMode === "time") {
        const base = tempDate ?? new Date();
        const final = new Date(base);
        final.setHours(selected.getHours());
        final.setMinutes(selected.getMinutes());
        final.setSeconds(0);
        final.setMilliseconds(0);

        commitValueToField(activeField, final);

        // cleanup
        setShowPicker(false);
        setTempDate(null);
        setActiveField(null);
        setPickerMode("date");
        return;
      }
    }
  };

  const getDisplayFor = (d: Date | null) => {
    return formatDateTime(d);
  };

  const DateButton = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: Date | null;
    field: typeof activeField;
  }) => (
    <TouchableOpacity
      style={styles.dateInputContainer}
      onPress={() => openDateTime(field)}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dateButton}>
        <Text style={styles.dateText}>{getDisplayFor(value)}</Text>
        {/* <Ionicons name="calendar-outline" size={20} color="#64748b" /> */}
      </View>
    </TouchableOpacity>
  );

  const currentPickerValue = () => {
    if (Platform.OS === "android") {
      if (pickerMode === "date") {
        const existing =
          (activeField === "normalOpen" && normalOpen) ||
          (activeField === "normalClose" && normalClose) ||
          (activeField === "specialOpen" && specialOpen) ||
          (activeField === "specialClose" && specialClose) ||
          (activeField === "extensionOpen" && extensionOpen) ||
          (activeField === "extensionClose" && extensionClose) ||
          new Date();
        return tempDate ?? existing ?? new Date();
      } else {
        // time mode
        const existing =
          (activeField === "normalOpen" && normalOpen) ||
          (activeField === "normalClose" && normalClose) ||
          (activeField === "specialOpen" && specialOpen) ||
          (activeField === "specialClose" && specialClose) ||
          (activeField === "extensionOpen" && extensionOpen) ||
          (activeField === "extensionClose" && extensionClose) ||
          new Date();
        return existing ?? new Date();
      }
    } else {
      // iOS
      return (
        (activeField === "normalOpen" && normalOpen) ||
        (activeField === "normalClose" && normalClose) ||
        (activeField === "specialOpen" && specialOpen) ||
        (activeField === "specialClose" && specialClose) ||
        (activeField === "extensionOpen" && extensionOpen) ||
        (activeField === "extensionClose" && extensionClose) ||
        new Date()
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={22} color="#0f172a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {mode === "create" ? "Tạo Kỳ Đăng ký" : "Chỉnh sửa Kỳ Đăng ký"}
        </Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButtonHeaderText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Term Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Tên kỳ đăng ký</Text>
          <TouchableOpacity style={styles.input}>
            <Text>{termName || "Nhập tên kỳ..."}</Text>
          </TouchableOpacity>
        </View>

        {/* Normal Registration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thời gian đăng ký thông thường
          </Text>
          <View style={styles.row}>
            <DateButton label="Mở" value={normalOpen} field="normalOpen" />
            <DateButton label="Đóng" value={normalClose} field="normalClose" />
          </View>
        </View>

        {/* Special Registration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thời gian đăng ký hoàn cảnh đặc biệt
          </Text>
          <View style={styles.row}>
            <DateButton label="Mở" value={specialOpen} field="specialOpen" />
            <DateButton
              label="Đóng"
              value={specialClose}
              field="specialClose"
            />
          </View>
        </View>

        {/* Extension */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian đăng ký gia hạn</Text>
          <View style={styles.row}>
            <DateButton
              label="Mở"
              value={extensionOpen}
              field="extensionOpen"
            />
            <DateButton
              label="Đóng"
              value={extensionClose}
              field="extensionClose"
            />
          </View>
        </View>
      </ScrollView>

      {/* Picker rendering */}
      {showPicker && activeField && (
        <DateTimePicker
          value={currentPickerValue()}
          mode={Platform.OS === "ios" ? "datetime" : pickerMode}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onPickerChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  saveButtonHeaderText: { color: "#136dec", fontSize: 16, fontWeight: "600" },

  scrollContent: { padding: 16, paddingBottom: 60 },
  section: { marginBottom: 26 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 14 },

  row: { flexDirection: "row", gap: 16 },

  label: { fontSize: 15, fontWeight: "500", marginBottom: 6 },

  dateInputContainer: { flex: 1 },

  dateButton: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  dateText: { fontSize: 16, color: "#334155" },
});

export default ManagerTermDetail;
