import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";
import { notificationApi } from "../../../services/notificationApi";

type NotificationDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NotificationDetail"
>;
type NotificationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "NotificationDetail"
>;

interface Props {
  navigation: NotificationDetailScreenNavigationProp;
  route: NotificationDetailScreenRouteProp;
}

const NotificationDetail = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  useEffect(() => {
    if (notification?.attachment_url && isImage(notification.attachment_path)) {
      Image.getSize(
        notification.attachment_url,
        (width, height) => {
          setImageAspectRatio(width / height);
        },
        (error) => {
          console.log("Error getting image size:", error);
        }
      );
    }
  }, [notification]);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotificationById(id);
      setNotification(data);
    } catch (error) {
      console.error("Failed to fetch notification details", error);
      Alert.alert(t("common.error"), "Không thể tải chi tiết thông báo");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!notification) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Không tìm thấy thông báo</Text>
      </View>
    );
  }

  const formattedDate = new Date(notification.created_at).toLocaleDateString(
    "vi-VN"
  );
  const formattedTime = new Date(notification.created_at).toLocaleTimeString(
    "vi-VN",
    { hour: "2-digit", minute: "2-digit" }
  );

  const senderName =
    notification.sender_role === "MANAGER" ||
    notification.sender_role === "ADMIN"
      ? "Ban Quản lý"
      : "Hệ thống";

  const handleOpenAttachment = async () => {
    if (notification.attachment_url) {
      try {
        const supported = await Linking.canOpenURL(notification.attachment_url);
        if (supported) {
          await Linking.openURL(notification.attachment_url);
        } else {
          Alert.alert(t("common.error"), "Không thể mở tệp đính kèm này");
        }
      } catch (error) {
        Alert.alert(t("common.error"), "Đã xảy ra lỗi khi mở tệp");
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return "image";
    if (ext === "pdf") return "picture-as-pdf";
    return "description";
  };

  const isImage = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
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
        <Text style={styles.headerTitle}>Chi tiết Thông báo</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          {/* Main Info Area */}
          <View style={styles.infoArea}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.metaInfo}>
              Người gửi: {senderName} | {formattedDate} {formattedTime}
            </Text>
          </View>

          {/* Content Area */}
          <View style={styles.article}>
            <Text style={styles.paragraph}>{notification.content}</Text>
          </View>

          {/* Attachments */}
          {notification.attachment_url && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.sectionTitle}>Tệp đính kèm</Text>
              {isImage(notification.attachment_path) ? (
                <View
                  style={[
                    styles.imageContainer,
                    { aspectRatio: imageAspectRatio },
                  ]}
                >
                  <Image
                    source={{ uri: notification.attachment_url }}
                    style={styles.attachmentImage}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.attachmentItem}
                  onPress={handleOpenAttachment}
                >
                  <View style={styles.attachmentIcon}>
                    <MaterialIcons
                      name={getFileIcon(notification.attachment_path)}
                      size={24}
                      color="#0ea5e9"
                    />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {notification.attachment_path.split("/").pop()}
                    </Text>
                    <Text style={styles.attachmentType}>
                      Nhấn để xem chi tiết
                    </Text>
                  </View>
                  <MaterialIcons
                    name="file-download"
                    size={24}
                    color="#64748b"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: "#f8fafc",
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
  scrollContent: {
    paddingBottom: 24,
  },
  contentContainer: {
    padding: 16,
  },
  infoArea: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 28,
  },
  metaInfo: {
    fontSize: 14,
    color: "#64748b",
  },
  article: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 12,
  },
  attachmentsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    marginBottom: 2,
  },
  attachmentType: {
    fontSize: 12,
    color: "#64748b",
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  attachmentImage: {
    width: "100%",
    height: "100%",
  },
});

export default NotificationDetail;
