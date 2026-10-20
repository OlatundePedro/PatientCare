import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import Feather from "@expo/vector-icons/Feather";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
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
import {
  DateField,
  InputField,
  LgaSelect,
  SexSelect,
  StateSelect,
} from "../../components/AuthFields";
import { StepProgress } from "../../components/AuthParts";
import { COLORS } from "../../components/authColors";
import { parseDob } from "../../components/signupHelpers";
import { signUpStore } from "../../components/signupStore";

// Step 2 of 2: personal details of the patient
export default function CompleteProfileScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [photoUri, setPhotoUri] = useState(null);
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [lga, setLga] = useState("");
  const [patientId, setPatientId] = useState("");
  const [address, setAddress] = useState("");

  if (!fontsLoaded) return null;

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch {
      Alert.alert(
        "Photo not added",
        "We could not open your photos. Please check the app's photo permission in your phone settings.",
      );
    }
  };

  const handleContinue = () => {
    if (fullName.trim().split(/\s+/).filter(Boolean).length < 2) {
      Alert.alert(
        "Full name required",
        "Please enter your full name with your surname first, for example Adeyemi Folake.",
      );
      return;
    }

    if (!sex) {
      Alert.alert("Sex required", "Please select your sex.");
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

    if (!lga) {
      Alert.alert("LGA required", "Please select your Local Government Area.");
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

    signUpStore.set({
      fullName: fullName.trim(),
      sex,
      dob,
      stateOfOrigin,
      lga,
      patientId: patientId.trim(),
      address: address.trim(),
      photoUri,
    });

    // TODO: send everything in signUpStore.get() (fullName with surname
    // first, sex, dob as DD/MM/YYYY, stateOfOrigin, lga, patientId (may be empty),
    // address (may be empty), photo, and the verified email or phone) to the
    // LASUTH registration API here.
    router.replace("/profile-complete");
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
          <StepProgress step={2} />

          <View style={styles.intro}>
            <Text style={styles.heading}>Complete your profile</Text>

            <Text style={styles.description}>
              Just a few more details so the hospital can set up your patient
              record.
            </Text>
          </View>

          <Pressable
            style={styles.avatarWrap}
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Add profile photo"
          >
            <View style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={44} color={COLORS.primary} />
              )}
            </View>

            <View style={styles.cameraBadge}>
              <Feather name="camera" size={15} color={COLORS.white} />
            </View>
          </Pressable>

          <Text style={styles.avatarHint}>Profile photo (optional)</Text>

          <Text style={styles.fieldLabel}>Full Name (surname first)</Text>
          <InputField
            icon="user"
            placeholder="Surname first, e.g. Adeyemi Folake"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoComplete="name"
          />

          <Text style={styles.fieldLabel}>Sex</Text>
          <SexSelect value={sex} onChange={setSex} />

          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <DateField value={dob} onChangeText={setDob} />

          <Text style={styles.fieldLabel}>State of Origin</Text>
          <StateSelect
            value={stateOfOrigin}
            onChange={(state) => {
              setStateOfOrigin(state);
              setLga(""); // the LGA list depends on the state
            }}
          />

          <Text style={styles.fieldLabel}>LGA</Text>
          <LgaSelect state={stateOfOrigin} value={lga} onChange={setLga} />

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

          <Text style={styles.fieldLabel}>Home Address (optional)</Text>
          <InputField
            icon="home"
            placeholder="Enter your home address"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="sentences"
            autoComplete="street-address"
          />

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Feather name="arrow-right" size={21} color={COLORS.white} />
          </Pressable>

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
    paddingTop: 20,
    paddingBottom: 35,
  },

  intro: {
    marginBottom: 22,
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

  avatarWrap: {
    alignSelf: "center",
    width: 112,
    height: 112,
  },

  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarHint: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 11.5,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 22,
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

  continueButton: {
    minHeight: 59,
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },

  continueButtonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 16,
  },

  buttonPressed: {
    opacity: 0.82,
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
