import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
  useFonts,
} from "@expo-google-fonts/work-sans";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import AnimatedSplash from "../../components/AnimatedSplash";
import { AuthProvider } from "../../context/authContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [revealApp, setRevealApp] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const handleReveal = useCallback(() => setRevealApp(true), []);
  const handleFinish = useCallback(() => setSplashDone(true), []);

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {fontsLoaded && revealApp && (
          <Stack screenOptions={{ headerShown: false }} />
        )}

        {!splashDone && (
          <AnimatedSplash
            ready={fontsLoaded}
            onReveal={handleReveal}
            onFinish={handleFinish}
          />
        )}
      </View>
    </AuthProvider>
  );
}
