import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

interface NavItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  screenName: keyof RootStackParamList;
  active: boolean;
  onPress: (screenName: keyof RootStackParamList) => void;
}

interface BottomNavProps {
  role?: "student" | "manager" | "admin";
}

const NavItem = ({
  icon,
  label,
  screenName,
  active,
  onPress,
}: NavItemProps) => (
  <TouchableOpacity onPress={() => onPress(screenName)} style={styles.navItem}>
    <MaterialIcons
      name={icon}
      size={24}
      color={active ? "#0ea5e9" : "#64748b"}
    />
    <Text style={[styles.navLabel, active && styles.activeNavLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomNav = ({ role = "student" }: BottomNavProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const studentNavItems: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    screenName: keyof RootStackParamList;
  }[] = [
    { icon: "home", label: "Trang chủ", screenName: "Home" },
    { icon: "grid-view", label: "Dịch vụ", screenName: "Services" },
    { icon: "notifications", label: "Thông báo", screenName: "Notifications" },
    { icon: "settings", label: "Cài đặt", screenName: "Settings" },
  ];

  const managerNavItems: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    screenName: keyof RootStackParamList;
  }[] = [
    { icon: "home", label: "Trang chủ", screenName: "ManagerHome" },
    { icon: "dashboard", label: "Quản lý", screenName: "ManagerServices" },
    { icon: "notifications", label: "Thông báo", screenName: "Notifications" },
    { icon: "settings", label: "Cài đặt", screenName: "Settings" },
  ];

  const navItems = (role === "manager" || role === "admin") ? managerNavItems : studentNavItems;

  const handleNavClick = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName as any);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          icon={item.icon}
          label={item.label}
          screenName={item.screenName}
          active={route.name === item.screenName}
          onPress={handleNavClick}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingBottom: 20, // For safe area on iPhone X+
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  activeNavLabel: {
    color: "#0ea5e9",
  },
});

export default BottomNav;
