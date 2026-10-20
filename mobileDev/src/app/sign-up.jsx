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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField, PasswordStrength } from "../../components/AuthFields";
import { BackButton, StepProgress } from "../../components/AuthParts";
import IdentifierToggle from "../../components/IdentifierToggle";
import { COLORS } from "../../components/authColors";
import {
  getPasswordStrength,
  isValidNigerianPhone,
  toE164,
} from "../../components/signupHelpers";
import { signUpStore } from "../../components/signupStore";

const LASUTH_LOGO = require("../../assets/images/logo.png");
const HOSPITAL_IMAGE = require("../../assets/images/ayinke.png");

// Step 1 of 2: create the account (email or phone + password)
export default function SignUpScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!fontsLoaded) return null;

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDiffer =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleContinue = () => {
    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        return;
      }
    } else if (!isValidNigerianPhone(phone)) {
      Alert.alert(
        "Invalid phone number",
        "Please enter a valid Nigerian phone number, for example 0803 123 4567.",
      );
      return;
    }

    const { level, checks } = getPasswordStrength(password);

    if (!checks.length) {
      Alert.alert(
        "Password too short",
        "Your password must contain at least 8 characters.",
      );
      return;
    }

    if (level < 3) {
      Alert.alert(
        "Password too weak",
        "Please choose a stronger password. Mix upper and lowercase letters, numbers and symbols.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both password fields match.",
      );
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        "Terms and Privacy",
        "Please accept the Terms of Service and Privacy Policy to continue.",
      );
      return;
    }

    signUpStore.set({
      method,
      email: email.trim(),
      phone: method === "phone" ? toE164(phone) : "",
      password,
    });

    // TODO: call the LASUTH API here to create the account and send the
    // 6-digit verification code to the email address or phone number.
    router.push("/verify-otp");
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
          <View style={styles.topBar}>
            <BackButton />

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
          </View>

          <StepProgress step={1} />

          <View style={styles.imageContainer}>
            <Image
              source={HOSPITAL_IMAGE}
              style={styles.hospitalImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Feather name="heart" size={18} color={COLORS.white} />
              <Text style={styles.imageCaption}>
                Excellent Health For The People
              </Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.heading}>Create your account</Text>

            <Text style={styles.description}>
              Register to manage your appointments, consult doctors, and access
              your prescriptions in one place.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Sign up with</Text>
          <IdentifierToggle value={method} onChange={setMethod} />

          {method === "email" ? (
            <InputField
              icon="mail"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
            />
          ) : (
            <InputField
              icon="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={16}
              autoComplete="tel"
            />
          )}

          <Text style={styles.fieldLabel}>Password</Text>
          <InputField
            icon="lock"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            rightAction={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            }
          />

          <PasswordStrength password={password} />

          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <InputField
            icon="shield"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            rightAction={
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={10}
                accessibilityLabel={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                <Feather
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            }
          />

          {passwordsMatch && (
            <Text style={[styles.matchText, { color: "#16A34A" }]}>
              Passwords match
            </Text>
          )}
          {passwordsDiffer && (
            <Text style={[styles.matchText, { color: COLORS.error }]}>
              Passwords do not match
            </Text>
          )}

          <Pressable
            style={styles.termsRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedTerms }}
          >
            <View
              style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
            >
              {acceptedTerms && (
                <Feather name="check" size={15} color={COLORS.white} />
              )}
            </View>

            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text
                style={styles.termsLink}
                onPress={() => router.push("/terms")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.termsLink}
                onPress={() => router.push("/privacy-policy")}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.createButtonText}>Continue</Text>
            <Feather name="arrow-right" size={21} color={COLORS.white} />
          </Pressable>

          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account?</Text>

            <Pressable onPress={() => router.replace("/sign-in")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </Pressable>
          </View>

          <View style={styles.secureNote}>
            <Feather name="shield" size={15} color={COLORS.primary} />
            <Text style={styles.secureText}>
              Your personal and medical information is protected and kept
              strictly confidential.
            </Text>
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
    paddingTop: 8,
    paddingBottom: 35,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 78,
    marginBottom: 18,
  },

  logo: {
    width: 66,
    height: 72,
  },

  brandDivider: {
    width: 3,
    height: 59,
    backgroundColor: COLORS.primary,
    marginHorizontal: 11,
    borderRadius: 3,
  },

  brandText: {
    flex: 1,
  },

  brandName: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 26,
    letterSpacing: 0.4,
  },

  brandSubtitle: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.primaryDark,
    fontSize: 11,
    lineHeight: 15,
  },

  imageContainer: {
    height: 125,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: COLORS.primarySoft,
  },

  hospitalImage: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 39,
    backgroundColor: "rgba(7, 85, 54, 0.84)",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 15,
  },

  imageCaption: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.white,
    fontSize: 12,
  },

  intro: {
    marginBottom: 20,
  },

  heading: {
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.navy,
    fontSize: 30,
    lineHeight: 39,
  },

  description: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  fieldLabel: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 7,
  },

  matchText: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 11.5,
    marginTop: -7,
    marginBottom: 15,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 23,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  termsText: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 20,
  },

  termsLink: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
  },

  createButton: {
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

  createButtonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 23,
  },

  signInText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12,
  },

  signInLink: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 12,
  },

  secureNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 23,
    paddingHorizontal: 8,
  },

  secureText: {
    flex: 1,
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
  },
});
