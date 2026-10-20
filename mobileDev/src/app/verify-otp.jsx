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
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, ContactSupport } from "../../components/AuthParts";
import { COLORS } from "../../components/authColors";
import { formatPhoneDisplay } from "../../components/signupHelpers";
import { signUpStore } from "../../components/signupStore";

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 180; // code lifetime (3 minutes)
const RESEND_AFTER_SECONDS = 30; // wait before "Resend Code" is active

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Verifies the email address or phone number chosen on the sign-up screen.
export default function VerifyOtpScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const { method, email, phone } = signUpStore.get();
  const isEmail = method === "email";
  const destination = isEmail ? email : formatPhoneDisplay(phone);

  const inputRef = useRef(null);
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  if (!fontsLoaded) return null;

  const expired = secondsLeft === 0;
  const canResend = secondsLeft <= EXPIRY_SECONDS - RESEND_AFTER_SECONDS;

  const handleChange = (text) => {
    setCode(text.replace(/\D/g, "").slice(0, OTP_LENGTH));
  };

  const handleResend = () => {
    if (!canResend) return;

    // TODO: call the LASUTH API here to send a new code.
    setCode("");
    setSecondsLeft(EXPIRY_SECONDS);
    Alert.alert(
      "Code sent",
      `A new code has been sent to your ${
        isEmail ? "email address" : "phone number"
      }.`,
    );
  };

  const handleVerify = () => {
    if (code.length < OTP_LENGTH) {
      Alert.alert(
        "Enter the full code",
        `Please enter the ${OTP_LENGTH}-digit code we sent you.`,
      );
      return;
    }

    if (expired) {
      Alert.alert(
        "Code expired",
        "This code has expired. Please request a new one.",
      );
      return;
    }

    // TODO: send `code` to the LASUTH API to verify the account here.
    router.replace("/verification-success");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <BackButton />
          </View>

          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Feather
                name={isEmail ? "mail" : "phone"}
                size={34}
                color={COLORS.navy}
              />
            </View>

            <Text style={styles.heading}>Verify Your Account</Text>

            <Text style={styles.description}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={styles.destination}>{destination}</Text>

            <Pressable
              style={styles.otpRow}
              onPress={() => inputRef.current?.focus()}
              accessibilityLabel="Enter verification code"
            >
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const digit = code[index] ?? "";
                const active =
                  focused && index === Math.min(code.length, OTP_LENGTH - 1);

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      digit !== "" && styles.otpBoxFilled,
                      active && styles.otpBoxActive,
                    ]}
                  >
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                );
              })}

              {/* One hidden input handles typing, paste and SMS autofill. */}
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                autoFocus
                caretHidden
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </Pressable>

            <Text style={[styles.timerText, expired && styles.timerExpired]}>
              {expired
                ? "Code expired. Request a new one."
                : `Code expires in ${formatTime(secondsLeft)}`}
            </Text>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>

              <Pressable onPress={handleResend} disabled={!canResend}>
                <Text
                  style={[
                    styles.resendLink,
                    !canResend && styles.resendLinkDisabled,
                  ]}
                >
                  Resend Code
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.verifyButton,
                code.length < OTP_LENGTH && styles.verifyButtonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleVerify}
            >
              <Text style={styles.verifyButtonText}>
                {isEmail ? "Verify Email" : "Verify Phone Number"}
              </Text>
            </Pressable>

            <ContactSupport />
          </View>
        </View>
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

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
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
    textAlign: "center",
  },

  destination: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },

  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
    marginBottom: 22,
  },

  otpBox: {
    flex: 1,
    height: 60,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  otpBoxFilled: {
    borderColor: COLORS.primary,
  },

  otpBoxActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  otpDigit: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 22,
  },

  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },

  timerText: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 12,
  },

  timerExpired: {
    color: COLORS.error,
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  },

  resendText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12,
  },

  resendLink: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 12,
  },

  resendLinkDisabled: {
    color: COLORS.muted,
    opacity: 0.6,
  },

  footer: {
    gap: 18,
  },

  verifyButton: {
    minHeight: 59,
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },

  verifyButtonDisabled: {
    opacity: 0.55,
  },

  verifyButtonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.82,
  },
});
