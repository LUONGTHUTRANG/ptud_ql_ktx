import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning" | "success";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = "primary",
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  // Use translation keys as defaults if labels not provided
  const finalConfirmLabel = confirmLabel || t("common.confirm");
  const finalCancelLabel = cancelLabel || t("common.cancel");
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          btnBg: "#dc2626",
          iconBg: "#fee2e2",
          iconColor: "#dc2626",
          iconName: "warning",
        };
      case "warning":
        return {
          btnBg: "#eab308",
          iconBg: "#fef9c3",
          iconColor: "#ca8a04",
          iconName: "error",
        };
      case "success":
        return {
          btnBg: "#16a34a",
          iconBg: "#dcfce7",
          iconColor: "#16a34a",
          iconName: "check-circle",
        };
      case "primary":
      default:
        return {
          btnBg: "#0ea5e9",
          iconBg: "#e0f2fe",
          iconColor: "#0ea5e9",
          iconName: "info",
        };
    }
  };

  const stylesConfig = getVariantStyles();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: stylesConfig.iconBg },
                ]}
              >
                <MaterialIcons
                  name={stylesConfig.iconName as any}
                  size={24}
                  color={stylesConfig.iconColor}
                />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonContainer}>
                {finalCancelLabel ? (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>
                      {finalCancelLabel}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[
                    styles.confirmButton,
                    { backgroundColor: stylesConfig.btnBg },
                  ]}
                >
                  <Text style={styles.confirmButtonText}>
                    {finalConfirmLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ConfirmModal;
