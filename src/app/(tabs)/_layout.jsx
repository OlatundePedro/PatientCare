import { Redirect, Tabs } from "expo-router";
import CurvedTabBar from "../../../components/CurvedTabBar";
import { useAuth } from "../../../context/AuthContext";

export default function TabsLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#F3F4F6" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: "Home", tabBarIconName: "home" }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
          tabBarLabel: "Appointments",
          tabBarIconName: "calendar",
        }}
      />
      <Tabs.Screen
        name="consultations"
        options={{
          title: "Consultations",
          tabBarLabel: "Consult",
          tabBarIconName: "video",
        }}
      />
      <Tabs.Screen
        name="prescriptions"
        options={{
          title: "Prescriptions",
          tabBarLabel: "Prescriptions",
          tabBarIconName: "file-text",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIconName: "user",
        }}
      />
    </Tabs>
  );
}
