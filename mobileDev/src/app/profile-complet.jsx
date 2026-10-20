import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import Feather from "@expo/vector-icons/Feather";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContactSupport } from "../../components/AuthParts";
import { COLORS } from "../../components/authColors";
import { signUpStore } from "../../components/signupStore";

export default function ProfileCompleteScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleContinue = () => {
    signUpStore.reset(); // clear the sign-up data (including the password)
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="check" size={44} color="#16A34A" />
          </View>

          <Text style={styles.heading}>You're All Set!</Text>

          <Text style={styles.description}>
            Your profile is complete. Continue to Home to book appointments,
            consult doctors and access your prescriptions at LASUTH.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue to Home</Text>
            <Feather name="arrow-right" size={21} color={COLORS.white} />
          </Pressable>
        </View>

        <ContactSupport />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 90,
  },

  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  heading: {
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.navy,
    fontSize: 30,
    lineHeight: 39,
    textAlign: "center",
  },

  description: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 28,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  button: {
    alignSelf: "stretch",
    minHeight: 59,
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },

  buttonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.82,
  },
});
