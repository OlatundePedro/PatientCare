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
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  gold: "#F59E0B",
};

const HOSPITAL_IMAGE = require("../../../assets/images/ayinke.png");

const INITIAL_APPOINTMENTS = [
  {
    id: "1",
    clinic: "Medical Outpatient Clinic",
    when: "Tomorrow · 10:30 AM",
    location: "LASUTH, Ikeja",
    type: "Physical consultation",
    status: "Confirmed",
    isPast: false,
  },
];

// ---------- Small pieces ----------

function StatusBadge({ status }) {
  return (
    <View style={styles.statusBadge}>
      <Feather name="check-circle" size={13} color={COLORS.primary} />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function CountBadge({ count }) {
  return (
    <View style={styles.countBadge}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={26} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

function AppointmentCard({ item, onView, onReschedule, onCancel }) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.cardTop} onPress={onView}>
        <View style={styles.cardIcon}>
          <Feather name="briefcase" size={22} color={COLORS.primary} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.clinic}
            </Text>
            <StatusBadge status={item.status} />
          </View>

          <View style={styles.metaRow}>
            <Feather name="calendar" size={14} color={COLORS.muted} />
            <Text style={styles.metaText}>{item.when}</Text>
          </View>

          <View style={styles.metaRow}>
            <Feather name="map-pin" size={14} color={COLORS.muted} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>

          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{item.type}</Text>
          </View>
        </View>

        <Feather name="chevron-right" size={18} color={COLORS.muted} />
      </Pressable>

      {!item.isPast && (
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onView}>
            <Feather name="eye" size={18} color={COLORS.primary} />
            <Text style={styles.actionText}>View</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable style={styles.actionButton} onPress={onReschedule}>
            <Feather name="calendar" size={18} color={COLORS.primary} />
            <Text style={styles.actionText}>Reschedule</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable style={styles.actionButton} onPress={onCancel}>
            <Feather name="x-circle" size={18} color={COLORS.error} />
            <Text style={[styles.actionText, { color: COLORS.error }]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ---------- Screen ----------

export default function AppointmentsScreen() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    PlayfairDisplay_700Bold,
  });

  const [tab, setTab] = useState("upcoming"); // "upcoming" | "past"
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  if (!fontsLoaded) return null;

  const upcoming = appointments.filter((a) => !a.isPast);
  const past = appointments.filter((a) => a.isPast);

  const handleCancel = (item) => {
    Alert.alert(
      "Cancel appointment",
      `Are you sure you want to cancel your visit to ${item.clinic}?`,
      [
        { text: "Keep it", style: "cancel" },
        {
          text: "Cancel visit",
          style: "destructive",
          onPress: () =>
            // TODO: call the LASUTH API to cancel this appointment.
            setAppointments((list) => list.filter((a) => a.id !== item.id)),
        },
      ],
    );
  };

  const openDetails = (item) =>
    router.push({ pathname: "/appointment-details", params: { id: item.id } });

  const reschedule = (item) =>
    router.push({ pathname: "/book-appointment", params: { id: item.id } });

  const bookAppointment = () => router.push("/book-appointment");

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={24} color={COLORS.navy} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Appointments</Text>
            <Text style={styles.subtitle}>Manage your hospital visits</Text>
          </View>

          <Pressable
            style={styles.bell}
            onPress={() => router.push("/notifications")}
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={20} color={COLORS.navy} />
            <View style={styles.bellDot} />
          </Pressable>

          <Pressable
            style={styles.avatar}
            onPress={() => router.push("/profile")}
            accessibilityLabel="Profile"
          >
            <Feather name="user" size={22} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* Booking banner */}
        <View style={styles.banner}>
          <Image
            source={HOSPITAL_IMAGE}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerTint} />

          <View style={styles.bannerTop}>
            <View style={styles.bannerIcon}>
              <Feather name="calendar" size={26} color={COLORS.white} />
            </View>

            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Need to see a doctor?</Text>
              <Text style={styles.bannerDescription}>
                Book a physical visit at a LASUTH clinic that suits you.
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.bookButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={bookAppointment}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {[
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Past" },
          ].map((item) => {
            const active = tab === item.key;

            return (
              <Pressable
                key={item.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(item.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {tab === "upcoming" ? "Upcoming Visits" : "Past Visits"}
          </Text>
          <CountBadge count={list.length} />
        </View>

        {list.length > 0 ? (
          list.map((item) => (
            <AppointmentCard
              key={item.id}
              item={item}
              onView={() => openDetails(item)}
              onReschedule={() => reschedule(item)}
              onCancel={() => handleCancel(item)}
            />
          ))
        ) : tab === "upcoming" ? (
          <EmptyState
            icon="calendar"
            title="No upcoming appointments"
            message="Book a visit and it will show up here."
          />
        ) : (
          <EmptyState
            icon="calendar"
            title="No past appointments"
            message="Your completed and previous visits will appear here."
          />
        )}
      </ScrollView>
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
    paddingTop: 12,
    // Leaves room for the bottom tab bar.
    paddingBottom: 110,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    color: COLORS.navy,
    fontSize: 24,
    lineHeight: 30,
  },

  subtitle: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12.5,
    marginTop: 2,
  },

  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  bellDot: {
    position: "absolute",
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Banner
  banner: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },

  bannerImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "45%",
    opacity: 0.35,
  },

  bannerTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(233, 246, 239, 0.7)",
  },

  bannerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },

  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  bannerText: {
    flex: 1,
    paddingRight: 40,
  },

  bannerTitle: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 16,
  },

  bannerDescription: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.text,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3,
  },

  bookButton: {
    minHeight: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginRight: "26%",
  },

  bookButtonText: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.white,
    fontSize: 14,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: "#EDF1EE",
    borderRadius: 999,
    padding: 3,
    marginBottom: 22,
  },

  tab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.text,
    fontSize: 13.5,
  },

  tabTextActive: {
    color: COLORS.white,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 17,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EDF1EE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.text,
    fontSize: 12.5,
  },

  // Appointment card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBody: {
    flex: 1,
    gap: 5,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  cardTitle: {
    flex: 1,
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 14.5,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 11,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  metaText: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12.5,
  },

  typeTag: {
    alignSelf: "flex-start",
    backgroundColor: "#EDF1EE",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
    marginTop: 2,
  },

  typeTagText: {
    fontFamily: "WorkSans_500Medium",
    color: COLORS.muted,
    fontSize: 11,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 14,
    paddingTop: 12,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 4,
  },

  actionText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 12.5,
  },

  actionDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.border,
  },

  // Empty state
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 15,
  },

  emptyMessage: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.muted,
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 5,
  },
});
