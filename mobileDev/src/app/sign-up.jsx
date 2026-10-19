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
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
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
import IdentifierToggle from "../../components/IdentifierToggle";

const COLORS = {
  primary: "#0B6B43",
  primaryDark: "#075536",
  primarySoft: "#E9F6EF",
  navy: "#0F1F33",
  text: "#1F2937",
  muted: "#64748B",
  white: "#FFFFFF",
  background: "#F8FAF8",
  border: "#DCE7E1",
  error: "#DC2626",
};

const LASUTH_LOGO = require("../../assets/images/logo.png");
const HOSPITAL_IMAGE = require("../../assets/images/ayinke.png");

// ---------- Password strength ----------

const STRENGTH_LEVELS = [
  { label: "Very weak", color: "#DC2626" },
  { label: "Weak", color: "#F97316" },
  { label: "Fair", color: "#EAB308" },
  { label: "Good", color: "#84CC16" },
  { label: "Strong", color: "#16A34A" },
];

function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    long: password.length >= 12,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  let score = Object.values(checks).filter(Boolean).length;

  // A password shorter than 8 characters can never rate above "Weak"
  if (!checks.length) score = Math.min(score, 2);

  const level = password ? Math.max(score, 1) : 0;

  return { level, checks };
}

const REQUIREMENTS = [
  { key: "length", label: "At least 8 characters" },
  { key: "case", label: "Upper and lowercase letters" },
  { key: "number", label: "At least one number" },
  { key: "symbol", label: "At least one symbol (e.g. ! @ # $)" },
  { key: "long", label: "12 or more characters (extra strong)" },
];

function PasswordStrength({ password }) {
  if (!password) return null;

  const { level, checks } = getPasswordStrength(password);
  const current = STRENGTH_LEVELS[level - 1];

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthHeader}>
        <Text style={styles.strengthTitle}>Password strength</Text>
        <Text style={[styles.strengthLabel, { color: current.color }]}>
          {current.label}
        </Text>
      </View>

      <View style={styles.strengthBar}>
        {STRENGTH_LEVELS.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.strengthSegment,
              {
                backgroundColor: index < level ? current.color : COLORS.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.requirements}>
        {REQUIREMENTS.map((item) => {
          const met = checks[item.key];

          return (
            <View key={item.key} style={styles.requirementRow}>
              <Feather
                name={met ? "check-circle" : "circle"}
                size={14}
                color={met ? "#16A34A" : COLORS.muted}
              />
              <Text
                style={[
                  styles.requirementText,
                  met && styles.requirementTextMet,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ---------- Input field ----------
// Defined outside the screen so the keyboard stays open while typing.

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
  secureTextEntry = false,
  rightAction,
  maxLength,
  autoComplete,
}) {
  return (
    <View style={styles.inputContainer}>
      <Feather name={icon} size={20} color={COLORS.primary} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A9BAF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        autoComplete={autoComplete}
      />

      {rightAction}
    </View>
  );
}

// ---------- Date of birth helpers ----------

// Turns whatever is typed into DD/MM/YYYY as the user types.
function formatDob(text) {
  const digits = text.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
}

// Returns a Date for a real calendar date in DD/MM/YYYY, otherwise null.
function parseDob(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// ---------- State of origin ----------

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// Defined outside the screen so it keeps its state while the form re-renders.
function StateSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.inputContainer}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Select state of origin"
      >
        <Feather name="map-pin" size={20} color={COLORS.primary} />

        <Text
          style={[styles.selectText, !value && styles.selectPlaceholder]}
          numberOfLines={1}
        >
          {value || "Select your state of origin"}
        </Text>

        <Feather name="chevron-down" size={20} color={COLORS.muted} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setOpen(false)}
          />

          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>State of origin</Text>

              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={10}
                accessibilityLabel="Close"
              >
                <Feather name="x" size={22} color={COLORS.navy} />
              </Pressable>
            </View>

            <FlatList
              data={NIGERIAN_STATES}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item === value;

                return (
                  <Pressable
                    style={styles.stateRow}
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.stateText,
                        selected && styles.stateTextSelected,
                      ]}
                    >
                      {item}
                    </Text>

                    {selected && (
                      <Feather name="check" size={18} color={COLORS.primary} />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function SignUpScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [patientId, setPatientId] = useState("");
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

  const handleRegistration = () => {
    if (fullName.trim().split(/\s+/).filter(Boolean).length < 2) {
      Alert.alert(
        "Full name required",
        "Please enter your full name with your surname first, for example Adeyemi Folake.",
      );
      return;
    }

    const birthDate = parseDob(dob);

    if (!birthDate) {
      Alert.alert(
        "Invalid date of birth",
        "Please enter a valid date in the format DD/MM/YYYY.",
      );
      return;
    }

    if (birthDate > new Date() || birthDate.getFullYear() < 1900) {
      Alert.alert(
        "Invalid date of birth",
        "Please check your date of birth and try again.",
      );
      return;
    }

    if (!stateOfOrigin) {
      Alert.alert(
        "State of origin required",
        "Please select your state of origin.",
      );
      return;
    }

    // Patient ID is optional: only validate it when something was entered.
    if (
      patientId.trim().length > 0 &&
      !/^[A-Za-z0-9/-]{4,20}$/.test(patientId.trim())
    ) {
      Alert.alert(
        "Invalid Patient ID",
        "Enter your Patient ID exactly as it appears on your LASUTH hospital card (4 to 20 letters, numbers, / or -), or leave it blank.",
      );
      return;
    }

    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        return;
      }
    } else {
      const cleanedPhone = phone.replace(/[\s()-]/g, "");

      if (!/^(?:\+234|234|0)[789][01]\d{8}$/.test(cleanedPhone)) {
        Alert.alert(
          "Invalid phone number",
          "Please enter a valid Nigerian phone number, for example 0803 123 4567.",
        );
        return;
      }
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

    // TODO: send fullName (surname first), dob (DD/MM/YYYY), stateOfOrigin,
    // patientId (may be empty), the email or phone number, and the password
    // to the LASUTH registration API here.
    Alert.alert(
      "Account created",
      `You can now sign in with your ${
        method === "email" ? "email address" : "phone number"
      }.`,
      [{ text: "Sign In", onPress: () => router.replace("/sign-in") }],
    );
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
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={18} color={COLORS.navy} />
            </Pressable>

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

          <Text style={styles.fieldLabel}>Full Name (surname first)</Text>
          <InputField
            icon="user"
            placeholder="Surname first, e.g. Adeyemi Folake"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoComplete="name"
          />

          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <InputField
            icon="calendar"
            placeholder="DD/MM/YYYY"
            value={dob}
            onChangeText={(text) => setDob(formatDob(text))}
            keyboardType="number-pad"
            maxLength={10}
          />

          <Text style={styles.fieldLabel}>State of Origin</Text>
          <StateSelect value={stateOfOrigin} onChange={setStateOfOrigin} />

          <Text style={styles.fieldLabel}>Patient ID (optional)</Text>
          <InputField
            icon="credit-card"
            placeholder="Hospital number (optional)"
            value={patientId}
            onChangeText={setPatientId}
            autoCapitalize="characters"
            maxLength={20}
          />
          <Text style={styles.fieldHint}>
            If you already have a LASUTH hospital card, you can enter your
            Patient ID (hospital number) from it or from your appointment slip.
          </Text>

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
            onPress={handleRegistration}
          >
            <Text style={styles.createButtonText}>Create Account</Text>
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

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
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

  fieldHint: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: -7,
    marginBottom: 16,
  },

  inputContainer: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 15,
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

  selectText: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "WorkSans_400Regular",
    fontSize: 13,
  },

  selectPlaceholder: {
    color: "#8A9BAF",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 31, 51, 0.45)",
  },

  modalSheet: {
    maxHeight: "70%",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  modalTitle: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 17,
  },

  stateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  stateText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.text,
    fontSize: 14,
  },

  stateTextSelected: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
  },

  strengthContainer: {
    marginTop: -5,
    marginBottom: 17,
  },

  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },

  strengthTitle: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 11.5,
  },

  strengthLabel: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 12,
  },

  strengthBar: {
    flexDirection: "row",
    gap: 5,
  },

  strengthSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },

  requirements: {
    marginTop: 11,
    gap: 6,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  requirementText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 11.5,
  },

  requirementTextMet: {
    color: COLORS.text,
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
