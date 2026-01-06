import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../../../types";
import { monthlyUsageApi } from "../../../services/monthlyUsageApi";

type EnterMeterIndexScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EnterMeterIndex"
>;

type EnterMeterIndexScreenRouteProp = RouteProp<
  RootStackParamList,
  "EnterMeterIndex"
>;

interface Props {
  navigation: EnterMeterIndexScreenNavigationProp;
  route: EnterMeterIndexScreenRouteProp;
}

const EnterMeterIndex = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { room, period } = route.params;

  // State for inputs
  const [newElectricity, setNewElectricity] = useState<string>("");
  const [newWater, setNewWater] = useState<string>("");
  const [prices, setPrices] = useState<{ electricity: number; water: number }>({
    electricity: 3500,
    water: 6000,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await monthlyUsageApi.getServicePrices();
        const elec = data.find((p: any) => p.service_name === "ELECTRICITY");
        const water = data.find((p: any) => p.service_name === "WATER");
        setPrices({
          electricity: elec ? parseFloat(elec.unit_price) : 3500,
          water: water ? parseFloat(water.unit_price) : 6000,
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    fetchPrices();
  }, []);

  // Calculations
  const electricityUsage = newElectricity
    ? parseInt(newElectricity) - room.oldElectricity
    : 0;
  const electricityAmount =
    electricityUsage > 0 ? electricityUsage * prices.electricity : 0;

  const waterUsage = newWater ? parseInt(newWater) - room.oldWater : 0;
  const waterAmount = waterUsage > 0 ? waterUsage * prices.water : 0;

  const totalAmount = electricityAmount + waterAmount;

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  const handleSave = async () => {
    if (!newElectricity || !newWater) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ chỉ số điện và nước");
      return;
    }

    if (parseInt(newElectricity) < room.oldElectricity) {
      Alert.alert(
        t("common.error"),
        "Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ"
      );
      return;
    }

    if (parseInt(newWater) < room.oldWater) {
      Alert.alert(
        t("common.error"),
        "Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ"
      );
      return;
    }

    try {
      const [monthStr, yearStr] = period.replace("Tháng ", "").split("/");
      const data = {
        roomId: parseInt(room.id),
        month: parseInt(monthStr),
        year: parseInt(yearStr),
        electricityIndex: parseInt(newElectricity),
        waterIndex: parseInt(newWater),
      };
      console.log("Recording usage with data:", data);
      await monthlyUsageApi.recordUsage(data);

      Alert.alert("Thành công", "Đã lưu chỉ số thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(t("common.error"), "Không thể lưu chỉ số. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("meterIndex.enterMeterIndex")} {period}</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Room Info */}
        <View style={styles.roomInfoContainer}>
          <Text style={styles.roomName}>
            {room.name} - {room.building}
          </Text>
          <Text style={styles.cycleText}>{t("meterIndex.semester")}: {period}</Text>
        </View>

        {/* Electricity Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.serviceInfo}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#fef9c3" }]}
              >
                <MaterialIcons name="bolt" size={24} color="#ca8a04" />
              </View>
              <View>
                <Text style={styles.serviceName}>{t("meterIndex.electricityIndex")}</Text>
                <Text style={styles.servicePrice}>
                  {formatCurrency(prices.electricity)} / kWh
                </Text>
              </View>
            </View>
            {/* <View style={styles.meterBadge}>
              <Text style={styles.meterText}>Công tơ số: 89312</Text>
            </View> */}
          </View>

          <View style={styles.inputGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("invoice.oldIndex")}</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{room.oldElectricity}</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: "#136dec" }]}>
                {t("invoice.newIndex")}
              </Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={newElectricity}
                onChangeText={setNewElectricity}
                placeholder="0"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.resultRow}>
            <View>
              <Text style={styles.resultLabel}>{t("meterIndex.usage")}</Text>
              <Text style={styles.resultValue}>
                {electricityUsage > 0 ? electricityUsage : 0} kWh
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.resultLabel}>{t("meterIndex.total")}</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(electricityAmount)}
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.cameraButton}>
            <MaterialIcons name="camera-alt" size={20} color="#64748b" />
            <Text style={styles.cameraText}>Chụp ảnh công tơ</Text>
          </TouchableOpacity> */}
        </View>

        {/* Water Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.serviceInfo}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#dbeafe" }]}
              >
                <MaterialIcons name="water-drop" size={24} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.serviceName}>{t("meterIndex.waterIndex")}</Text>
                <Text style={styles.servicePrice}>
                  {formatCurrency(prices.water)} / m³
                </Text>
              </View>
            </View>
            {/* <View style={styles.meterBadge}>
              <Text style={styles.meterText}>Công tơ số: 45123</Text>
            </View> */}
          </View>

          <View style={styles.inputGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("invoice.oldIndex")}</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{room.oldWater}</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: "#136dec" }]}>
                {t("invoice.newIndex")}
              </Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={newWater}
                onChangeText={setNewWater}
                placeholder="0"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.resultRow}>
            <View>
              <Text style={styles.resultLabel}>{t("meterIndex.usage")}</Text>
              <Text style={styles.resultValue}>
                {waterUsage > 0 ? waterUsage : 0} m³
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.resultLabel}>{t("meterIndex.total")}</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(waterAmount)}
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.cameraButton}>
            <MaterialIcons name="camera-alt" size={20} color="#64748b" />
            <Text style={styles.cameraText}>Chụp ảnh công tơ</Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("meterIndex.total")}:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t("meterIndex.saveIndex")}</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  iconButton: {
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
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  roomInfoContainer: {
    marginBottom: 20,
  },
  dormName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#136dec",
    marginBottom: 4,
  },
  roomName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  cycleText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  servicePrice: {
    fontSize: 12,
    color: "#64748b",
  },
  meterBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  meterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  inputGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  readOnlyInput: {
    height: 48,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
  },
  textInput: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#136dec",
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  cameraText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#136dec",
  },
  saveButton: {
    backgroundColor: "#136dec",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default EnterMeterIndex;
