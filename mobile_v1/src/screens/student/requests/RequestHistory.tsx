import React, { useState, useCallback } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { getSupportRequests } from "../../../services/requestApi";
import { RootStackParamList } from "../../../types";
import SupportRequestList, {
  RequestItem,
} from "../../../components/SupportRequestList";

type RequestHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RequestHistory"
>;

interface Props {
  navigation: RequestHistoryScreenNavigationProp;
}

const RequestHistory = ({ navigation }: Props) => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getSupportRequests();

      const mappedData: RequestItem[] = data.data.map((item: any) => {
        let type: RequestItem["type"] = "repair";
        if (item.type === "COMPLAINT") type = "complaint";
        if (item.type === "PROPOSAL") type = "proposal";

        let status: RequestItem["status"] = "new";
        if (item.status === "PROCESSING") status = "pending";
        if (item.status === "COMPLETED") status = "completed";
        if (item.status === "CANCELLED") status = "rejected";

        return {
          id: item.id.toString(),
          code: `REQ${item.id}`,
          type,
          title: item.title, // Add title
          room: item.room_number
            ? `${item.room_number} ${item.building_name || ""}`
            : "N/A",
          date: new Date(item.created_at).toLocaleDateString("vi-VN"),
          status,
          studentName: item.student_name,
        };
      });

      setRequests(mappedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  return (
    <SupportRequestList
      role="student"
      title="Lịch sử yêu cầu"
      data={requests}
      onBackPress={() => navigation.goBack()}
      onAddPress={() => navigation.navigate("CreateRequest")}
      onItemPress={(id) => navigation.navigate("RequestDetail", { id })}
    />
  );
};

export default RequestHistory;
