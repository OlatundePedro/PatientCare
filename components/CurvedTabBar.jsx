import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  green: "#08783E",
  greenDark: "#065C30",
  white: "#FFFFFF",
  muted: "#A7B5AD",
};

const BAR_HEIGHT = 72;
const BAR_TOP_PADDING = 8;

const TAB_ICONS = {
  index: "home",
  appointments: "calendar",
  consultations: "video",
  prescriptions: "file-text",
  profile: "user",
};

const TAB_LABELS = {
  index: "Home",
  appointments: "Appointments",
  consultations: "Consult",
  prescriptions: "Prescriptions",
  profile: "Profile",
};

// Use this as the bottom padding of every scrollable tab screen so the
// last item can scroll fully clear of the floating bar.
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return BAR_HEIGHT + BAR_TOP_PADDING + Math.max(insets.bottom, 10) + 16;
}

export default function CurvedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;

          const label =
            options?.tabBarLabel ?? TAB_LABELS[route.name] ?? route.name;

          const icon =
            options?.tabBarIconName ?? TAB_ICONS[route.name] ?? "circle";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tab,
                isFocused && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <Feather
                name={icon}
                size={21}
                color={isFocused ? COLORS.white : COLORS.muted}
              />

              <Text
                numberOfLines={1}
                style={[styles.label, isFocused && styles.activeLabel]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Floats over the screen so content scrolls underneath it
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingTop: BAR_TOP_PADDING,
  },

  bar: {
    height: BAR_HEIGHT,
    backgroundColor: COLORS.green, // try "rgba(8, 120, 62, 0.92)" for a slight see-through
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,
    paddingVertical: 5,
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },

  tab: {
    flex: 1,
    minWidth: 0,
    height: 62,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 2,
  },

  activeTab: {
    backgroundColor: COLORS.greenDark,
  },

  label: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "500",
  },

  activeLabel: {
    color: COLORS.white,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});
