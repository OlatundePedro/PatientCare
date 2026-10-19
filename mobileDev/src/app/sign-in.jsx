import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFonts } from "expo-font";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  primary: "#0B6B43",
  primaryDark: "#000000",
  primarySoft: "#E9F6EF",
  iconSoft: "#CFEBDD",
  navy: "#0F1F33",
  text: "#1F2937",
  muted: "#64748B",
  white: "#FFFFFF",
  background: "#F8FAF8",
  border: "#DCE7E1",
  inputBackground: "#FFFFFF",
};

const LASUTH_LOGO = require("../../assets/images/logo.png");
const HOSPITAL_IMAGE = require("../../assets/images/ayinke.png");

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!fontsLoaded) return null;

  const handleSignIn = () => {
    // TODO: when the LASUTH API is ready, validate the email and password
    // here and only call signIn() when the credentials are valid.
    signIn();
    router.replace("/(tabs)");
  };

  const handleBiometricLogin = async () => {
    try {
      const hardwareAvailable = await LocalAuthentication.hasHardwareAsync();

      if (!hardwareAvailable) {
        Alert.alert(
          "Not available",
          "This device does not support biometric authentication.",
        );
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!enrolled) {
        Alert.alert(
          "Set up biometrics",
          "Please enable fingerprint or face authentication in your device settings.",
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in to LASUTH",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        signIn();
        router.replace("/(tabs)");
      }
    } catch {
      Alert.alert(
        "Authentication error",
        "Biometric authentication could not be started.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LASUTH branding */}
          <View style={styles.brandRow}>
            <Image
              source={LASUTH_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.brandDivider} />

            <View style={styles.brandText}>
              <Text style={styles.brandName}>LASUTH</Text>
              <Text style={styles.brandSubtitle}>Lagos State University</Text>
              <Text style={styles.brandSubtitle}>Teaching Hospital</Text>
            </View>
          </View>

          {/* Hospital image */}
          <View style={styles.heroImageWrapper}>
            <View style={styles.imageAccent} />
            <Image
              source={HOSPITAL_IMAGE}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Welcome heading */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back,</Text>
            <Text style={styles.welcomeHighlight}>Good to see you!</Text>
            <Text style={styles.welcomeDescription}>
              Sign in to access your appointments, {"\n"}consultations,
              prescriptions and more.
            </Text>
          </View>

          {/* Email field */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={17} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#8A9BAF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          {/* Password field */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={17} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8A9BAF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              hitSlop={10}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={17}
                color={COLORS.muted}
              />
            </Pressable>
          </View>

          {/* Remember me and forgot password */}
          <View style={styles.optionsRow}>
            <Pressable
              style={styles.rememberOption}
              onPress={() => setRememberMe(!rememberMe)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <Feather name="check" size={13} color={COLORS.white} />
                )}
              </View>

              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Sign in button */}
          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Biometric sign in */}
          <Pressable
            style={({ pressed }) => [
              styles.biometricButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleBiometricLogin}
          >
            <MaterialCommunityIcons
              name="fingerprint"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.biometricText}>Use Biometric Login</Text>
          </Pressable>

          {/* Create account */}
          <View style={styles.createAccountRow}>
            <Text style={styles.createAccountText}>Don’t have an account?</Text>

            <Pressable onPress={() => router.push("/sign-up")}>
              <Text style={styles.createAccountLink}>Create Account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 95,
    marginBottom: 24,
  },

  logo: {
    width: 76,
    height: 82,
  },

  brandDivider: {
    width: 2,
    height: 70,
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 12,
    borderRadius: 3,
    marginLeft: 2,
  },

  brandText: {
    flex: 1,
  },

  brandName: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primaryDark,
    fontSize: 30,
    letterSpacing: 0.3,
    marginLeft: -5,
  },

  brandSubtitle: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.primaryDark,
    fontSize: 12,
    lineHeight: 15,
    marginLeft: -5,
  },

  heroImageWrapper: {
    position: "absolute",
    top: 0,
    right: -24,
    width: 185,
    height: 280,
    borderTopLeftRadius: 150,
    borderBottomLeftRadius: 150,
    overflow: "hidden",
    opacity: 0.96,
    zIndex: -1,
  },

  imageAccent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primarySoft,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 150,
    borderBottomLeftRadius: 150,
  },

  welcomeSection: {
    marginTop: 12,
    marginBottom: 25,
    paddingRight: 4,
  },

  welcomeTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.navy,
    fontSize: 30,
    lineHeight: 45,
  },

  welcomeHighlight: {
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.primary,
    fontSize: 32,
    lineHeight: 43,
    marginTop: -8,
  },

  welcomeDescription: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    maxWidth: 340,
  },

  inputContainer: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 17,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontFamily: "WorkSans_400Regular",
    fontSize: 13,
    paddingVertical: 13,
  },

  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 23,
    gap: 8,
  },

  rememberOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  rememberText: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 11.5,
  },

  forgotText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 11.5,
  },

  signInButton: {
    minHeight: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 7,
  },

  signInButtonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 13,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  orText: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 12,
  },

  biometricButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  biometricText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 13,
  },

  createAccountRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 25,
  },

  createAccountText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 11.5,
  },

  createAccountLink: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 11.5,
  },
});
