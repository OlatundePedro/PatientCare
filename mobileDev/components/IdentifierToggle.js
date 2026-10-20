import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = {
  primary: "#0B6B43",
  primarySoft: "#E9F6EF",
  muted: "#64748B",
  white: "#FFFFFF",
  border: "#DCE7E1",
};

const OPTIONS = [
  { key: "email", label: "Email", icon: "mail" },
  { key: "phone", label: "Phone number", icon: "phone" },
];

// Segmented switch used on the sign-in and sign-up screens
// to choose between email and phone number.
export default function IdentifierToggle({ value, onChange }) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const active = value === option.key;

        return (
          <Pressable
            key={option.key}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Feather
              name={option.icon}
              size={15}
              color={active ? COLORS.primary : COLORS.muted}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
    padding: 4,
    marginBottom: 15,
  },
  option: {
    flex: 1,
    minHeight: 38,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  optionActive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 12,
    color: COLORS.muted,
  },
  labelActive: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
  },
});
