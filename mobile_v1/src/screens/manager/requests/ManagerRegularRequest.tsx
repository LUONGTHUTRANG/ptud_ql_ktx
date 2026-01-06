import React, { useState, useCallback } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { getSupportRequests } from "@/src/services/requestApi";
import { RootStackParamList } from "../../../types";
import { useTranslation } from "react-i18next";
import SupportRequestList, {
  RequestItem,
} from "../../../components/SupportRequestList";

type ManagerRegularRequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagerRegularRequest"
>;

interface Props {
  navigation: ManagerRegularRequestScreenNavigationProp;
}

const ManagerRegularRequest = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getSupportRequests();
      // response is the body: { data: [...], meta: ... }
      // So response.data is the array of requests
      const requestsData = response.data || [];

      const mappedData: RequestItem[] = requestsData.map((item: any) => {
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
          date: new Date(item.created_at).toLocaleDateString("locale"),
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
      role="manager"
      title={t("supportRequest.manageSupportRequest")}
      data={requests}
      onBackPress={() => navigation.navigate("ManagerServices")}
      onItemPress={(id) => navigation.navigate("RequestDetail", { id })}
    />
  );
};

export default ManagerRegularRequest;
