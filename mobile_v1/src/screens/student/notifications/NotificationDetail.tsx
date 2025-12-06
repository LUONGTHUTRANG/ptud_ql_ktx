import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../types";

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

  // Mock data matching the design
  const notification = {
    title: "Thông báo về lịch cắt điện toàn khu KTX",
    sender: "Ban Quản lý",
    date: "24/12/2023",
    time: "08:30",
    attachments: [
      {
        name: "lich-cat-dien-chi-tiet.pdf",
        size: "128 KB",
        type: "description",
      },
      { name: "so-do-khu-vuc.jpg", size: "1.2 MB", type: "image" },
    ],
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
              Người gửi: {notification.sender} | {notification.date}{" "}
              {notification.time}
            </Text>
          </View>

          {/* Content Area */}
          <View style={styles.article}>
            <Text style={styles.paragraph}>Thân gửi các bạn sinh viên,</Text>
            <Text style={styles.paragraph}>
              Nhằm mục đích bảo trì và nâng cấp hệ thống lưới điện, Ban Quản lý
              ký túc xá xin thông báo về việc tạm ngừng cung cấp điện tại toàn
              bộ các khu nhà.
            </Text>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listItemText}>
                  <Text style={styles.boldText}>Thời gian dự kiến:</Text> Từ
                  08:00 đến 17:00 ngày 25/12/2023.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listItemText}>
                  <Text style={styles.boldText}>Khu vực ảnh hưởng:</Text> Toàn
                  bộ các tòa nhà A, B, và C.
                </Text>
              </View>
            </View>
            <Text style={styles.paragraph}>
              Rất mong các bạn sinh viên chú ý sắp xếp công việc và học tập. Vui
              lòng rút phích cắm các thiết bị điện không cần thiết trước thời
              gian cắt điện để đảm bảo an toàn.
            </Text>
            <Text style={styles.paragraph}>Xin cảm ơn.</Text>
          </View>

          {/* Images Section */}
          <View style={styles.imageSection}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
              }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* Attachments Area */}
          <View style={styles.attachmentsArea}>
            <Text style={styles.attachmentsTitle}>Tệp đính kèm</Text>
            <View style={styles.attachmentsList}>
              {notification.attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <View style={styles.attachmentIconContainer}>
                    <MaterialIcons
                      name={file.type as any}
                      size={24}
                      color="#0ea5e9"
                    />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{file.name}</Text>
                    <Text style={styles.attachmentSize}>{file.size}</Text>
                  </View>
                  <TouchableOpacity style={styles.downloadButton}>
                    <MaterialIcons name="download" size={24} color="#475569" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  contentContainer: {
    padding: 16,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  infoArea: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    lineHeight: 32,
    marginBottom: 8,
  },
  metaInfo: {
    fontSize: 14,
    color: "#64748b",
  },
  article: {
    gap: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
  },
  list: {
    paddingLeft: 8,
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#334155",
    marginTop: 9,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  imageSection: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  attachmentsArea: {
    marginTop: 32,
  },
  attachmentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  attachmentsList: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 16,
  },
  attachmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
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
  attachmentSize: {
    fontSize: 12,
    color: "#64748b",
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
});

export default NotificationDetail;
