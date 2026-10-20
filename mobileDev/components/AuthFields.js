import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "./authColors";
import { LGAS_BY_STATE } from "./nigeriaLgas";
import {
  formatDate,
  formatDob,
  getPasswordStrength,
  parseDob,
} from "./signupHelpers";

// ---------- Input field ----------
// Defined outside the screens so the keyboard stays open while typing.

export function InputField({
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

// ---------- Password strength ----------

const STRENGTH_LEVELS = [
  { label: "Very weak", color: "#DC2626" },
  { label: "Weak", color: "#F97316" },
  { label: "Fair", color: "#EAB308" },
  { label: "Good", color: "#84CC16" },
  { label: "Strong", color: "#16A34A" },
];

const REQUIREMENTS = [
  { key: "length", label: "At least 8 characters" },
  { key: "case", label: "Upper and lowercase letters" },
  { key: "number", label: "At least one number" },
  { key: "symbol", label: "At least one symbol (e.g. ! @ # $)" },
  { key: "long", label: "12 or more characters (extra strong)" },
];

export function PasswordStrength({ password }) {
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

// Generic drop-down that opens a bottom sheet list.
// Defined outside the screens so it keeps its state while the form re-renders.
export function SelectField({
  icon,
  placeholder,
  title,
  options,
  value,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.inputContainer, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Feather name={icon} size={20} color={COLORS.primary} />

        <Text
          style={[styles.selectText, !value && styles.selectPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder}
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
              <Text style={styles.modalTitle}>{title}</Text>

              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={10}
                accessibilityLabel="Close"
              >
                <Feather name="x" size={22} color={COLORS.navy} />
              </Pressable>
            </View>

            <FlatList
              data={options}
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

export function StateSelect({ value, onChange }) {
  return (
    <SelectField
      icon="map-pin"
      title="State of origin"
      placeholder="Select your state of origin"
      options={NIGERIAN_STATES}
      value={value}
      onChange={onChange}
    />
  );
}

// LGA list for the chosen state. Disabled until a state is selected.
export function LgaSelect({ state, value, onChange }) {
  return (
    <SelectField
      icon="navigation"
      title="Local Government Area"
      placeholder={state ? "Select your LGA" : "Select your state first"}
      options={LGAS_BY_STATE[state] || []}
      value={value}
      onChange={onChange}
      disabled={!state}
    />
  );
}

// ---------- Date of birth with calendar ----------
// Tap the calendar icon to pick a date, or type it as DD/MM/YYYY.

export function DateField({ value, onChangeText }) {
  const [open, setOpen] = useState(false);

  const pickerDate = parseDob(value) || new Date(1990, 0, 1);

  const handleChange = (event, date) => {
    if (Platform.OS === "android") setOpen(false);

    if (event.type !== "dismissed" && date) {
      onChangeText(formatDate(date));
    }
  };

  const picker = (
    <DateTimePicker
      value={pickerDate}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "calendar"}
      maximumDate={new Date()}
      minimumDate={new Date(1900, 0, 1)}
      onChange={handleChange}
    />
  );

  return (
    <>
      <View style={styles.inputContainer}>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setOpen(true);
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Open calendar"
        >
          <Feather name="calendar" size={20} color={COLORS.primary} />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#8A9BAF"
          value={value}
          onChangeText={(text) => onChangeText(formatDob(text))}
          keyboardType="number-pad"
          maxLength={10}
        />
      </View>

      {/* Android shows its own calendar dialog */}
      {open && Platform.OS === "android" && picker}

      {/* iOS shows the picker in a bottom sheet */}
      {Platform.OS === "ios" && (
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
                <Text style={styles.modalTitle}>Date of birth</Text>

                <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                  <Text style={styles.doneText}>Done</Text>
                </Pressable>
              </View>

              {picker}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

// ---------- Sex ----------

const SEX_OPTIONS = ["Male", "Female"];

export function SexSelect({ value, onChange }) {
  return (
    <View style={styles.sexRow}>
      {SEX_OPTIONS.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            style={[styles.sexOption, selected && styles.sexOptionSelected]}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Feather
              name={selected ? "check-circle" : "circle"}
              size={18}
              color={selected ? COLORS.primary : COLORS.muted}
            />
            <Text style={[styles.sexText, selected && styles.sexTextSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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

  inputDisabled: {
    opacity: 0.55,
  },

  doneText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.primary,
    fontSize: 15,
  },

  sexRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },

  sexOption: {
    flex: 1,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
  },

  sexOptionSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },

  sexText: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.text,
    fontSize: 13,
  },

  sexTextSelected: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
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
});
