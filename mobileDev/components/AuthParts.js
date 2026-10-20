import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "./authColors";

// TODO: replace with the real LASUTH support address.
const SUPPORT_EMAIL = "support@lasuth.example";

export function BackButton({ onPress }) {
  return (
    <Pressable
      style={styles.backButton}
      onPress={onPress || (() => router.back())}
      accessibilityLabel="Go back"
    >
      <Feather name="arrow-left" size={18} color={COLORS.navy} />
    </Pressable>
  );
}

export function StepProgress({ step, total = 2 }) {
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < step && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.stepLabel}>
        Step {step} of {total}
      </Text>
    </View>
  );
}

export function ContactSupport() {
  return (
    <View style={styles.supportRow}>
      <Text style={styles.supportText}>Having trouble?</Text>

      <Pressable
        onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
        hitSlop={8}
      >
        <Text style={styles.supportLink}>Contact Support</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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

  progressWrap: {
    marginBottom: 20,
  },

  progressTrack: {
    flexDirection: "row",
    gap: 6,
  },

  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },

  progressSegmentActive: {
    backgroundColor: COLORS.primary,
  },

  stepLabel: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 9,
  },

  supportRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  supportText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12,
  },

  supportLink: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 12,
  },
});
