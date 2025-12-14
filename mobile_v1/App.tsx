import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";

import Login from "./src/screens/auth/Login";
import Home from "./src/screens/student/home/Home";
import Services from "./src/screens/student/services/Services";
import Bills from "./src/screens/student/bills/Bills";
import BillDetail from "./src/screens/student/bills/BillDetail";
import Notifications from "./src/screens/student/notifications/Notifications";
import Settings from "./src/screens/student/profile/Settings";
import ManagerHome from "./src/screens/manager/home/ManagerHome";
import Profile from "./src/screens/student/profile/Profile";
import ChangePassword from "./src/screens/student/profile/ChangePassword";
import NotificationDetail from "./src/screens/student/notifications/NotificationDetail";
import PaymentDetail from "./src/screens/student/bills/PaymentDetail";
import RequestHistory from "./src/screens/student/requests/RequestHistory";
import RequestDetail from "./src/screens/student/requests/RequestDetail";
import CreateRequest from "./src/screens/student/requests/CreateRequest";
import TransactionHistory from "./src/screens/student/bills/TransactionHistory";
import BuildingList from "./src/screens/manager/buildings/BuildingList";
import RoomList from "./src/screens/manager/buildings/RoomList";
import RegisterAccommodation from "./src/screens/student/services/RegisterAccommodation";
import ExtendAccommodation from "./src/screens/student/services/ExtendAccommodation";
import RegularRequest from "./src/screens/student/requests/RegularRequest";
import SpecialRequest from "./src/screens/student/requests/SpecialRequest";
import RoomMembers from "./src/screens/student/room/RoomMembers";
import StudentList from "./src/screens/manager/students/StudentList";
import ManagerBills from "./src/screens/manager/bills/ManagerBills";
import ManagerSpecialRequest from "./src/screens/manager/requests/ManagerSpecialRequest";
import ManagerSpecialRequestDetail from "./src/screens/manager/requests/ManagerSpecialRequestDetail";
import ManagerNotifications from "./src/screens/manager/notifications/ManagerNotifications";
import ManagerNotificationDetail from "./src/screens/manager/notifications/ManagerNotificationDetail";
import ManagerRegularRequest from "./src/screens/manager/requests/ManagerRegularRequest";
import ManagerServices from "./src/screens/manager/services/ManagerServices";
import ManagerTerm from "./src/screens/manager/terms/ManagerTerm";
import ManagerTermDetail from "./src/screens/manager/terms/ManagerTermDetail";
import RecordMeterReading from "./src/screens/manager/bills/RecordMeterReading";
import { RootStackParamList } from "./src/types";

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: "#f8fafc" },
            }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />

            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="Bills" component={Bills} />
            <Stack.Screen name="BillDetail" component={BillDetail} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Settings" component={Settings} />

            <Stack.Screen name="PaymentDetail" component={PaymentDetail} />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistory}
            />
            <Stack.Screen name="BuildingList" component={BuildingList} />
            <Stack.Screen name="RoomList" component={RoomList} />
            <Stack.Screen name="RequestHistory" component={RequestHistory} />
            <Stack.Screen name="RequestDetail" component={RequestDetail} />
            <Stack.Screen name="CreateRequest" component={CreateRequest} />
            <Stack.Screen
              name="NotificationDetail"
              component={NotificationDetail}
            />
            <Stack.Screen name="ManagerHome" component={ManagerHome} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen
              name="RegisterAccommodation"
              component={RegisterAccommodation}
            />
            <Stack.Screen
              name="ExtendAccommodation"
              component={ExtendAccommodation}
            />
            <Stack.Screen name="RegularRequest" component={RegularRequest} />
            <Stack.Screen name="SpecialRequest" component={SpecialRequest} />
            <Stack.Screen name="RoomMembers" component={RoomMembers} />
            <Stack.Screen name="StudentList" component={StudentList} />
            <Stack.Screen name="ManagerBills" component={ManagerBills} />
            <Stack.Screen
              name="ManagerSpecialRequest"
              component={ManagerSpecialRequest}
            />
            <Stack.Screen
              name="ManagerSpecialRequestDetail"
              component={ManagerSpecialRequestDetail}
            />
            <Stack.Screen
              name="ManagerNotifications"
              component={ManagerNotifications}
            />
            <Stack.Screen
              name="ManagerNotificationDetail"
              component={ManagerNotificationDetail}
            />
            <Stack.Screen
              name="ManagerRegularRequest"
              component={ManagerRegularRequest}
            />
            <Stack.Screen name="ManagerServices" component={ManagerServices} />
            <Stack.Screen name="ManagerTerm" component={ManagerTerm} />
            <Stack.Screen
              name="ManagerTermDetail"
              component={ManagerTermDetail}
            />
            <Stack.Screen
              name="RecordMeterReading"
              component={RecordMeterReading}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
