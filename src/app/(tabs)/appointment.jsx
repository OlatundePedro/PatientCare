import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  green: "#08783E",
  greenDark: "#065C30",
  greenSoft: "#E7F4EC",
  white: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  background: "#F3F4F6",
  border: "#E5E7EB",
  gold: "#D4A017",
  goldSoft: "#FBF4DF",
};

const SAMPLE_APPOINTMENTS = [
  {
    id: "APT-001",
    clinic: "Medical Outpatient Clinic",
    doctor: "Doctor to be assigned",
    date: "Tomorrow",
    time: "10:30 AM",
    location: "LASUTH, Ikeja",
    status: "Confirmed",
    type: "Physical consultation",
  },
];

function SectionHeading({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function AppointmentCard({ appointment, onView, onReschedule, onCancel }) {
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardTop}>
        <View style={styles.clinicIcon}>
          <Feather name="plus-square" size={23} color={COLORS.green} />
        </View>

        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>{appointment.clinic}</Text>
          <Text style={styles.doctorName}>{appointment.doctor}</Text>
        </View>

        <Feather name="chevron-right" size={21} color={COLORS.muted} />
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Feather name="check-circle" size={13} color={COLORS.green} />
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>

        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{appointment.type}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
          <Feather name="calendar" size={17} color={COLORS.green} />
        </View>
        <View style={styles.detailInfo}>
          <Text style={styles.detailLabel}>Appointment date</Text>
          <Text style={styles.detailValue}>
            {appointment.date} · {appointment.time}
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
          <Feather name="map-pin" size={17} color={COLORS.green} />
        </View>
        <View style={styles.detailInfo}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{appointment.location}</Text>
        </View>
      </View>

      <Pressable style={styles.viewButton} onPress={onView}>
        <Text style={styles.viewButtonText}>View Appointment</Text>
        <Feather name="arrow-right" size={17} color={COLORS.white} />
      </Pressable>

      <View style={styles.secondaryActions}>
        <Pressable style={styles.secondaryAction} onPress={onReschedule}>
          <Feather name="calendar" size={15} color={COLORS.green} />
          <Text style={styles.secondaryActionText}>Reschedule</Text>
        </Pressable>

        <View style={styles.actionDivider} />

        <Pressable style={styles.secondaryAction} onPress={onCancel}>
          <Feather name="x-circle" size={15} color="#B42318" />
          <Text style={styles.cancelText}>Cancel booking</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AppointmentsScreen() {
  const [activeFilter, setActiveFilter] = useState("Upcoming");

  // Demonstration data only. Replace with appointments from your API.
  const appointments = SAMPLE_APPOINTMENTS;

  const filteredAppointments = activeFilter === "Upcoming" ? appointments : [];

  const handleReschedule = () => {
    Alert.alert(
      "Reschedule appointment",
      "Connect this action to your appointment rescheduling flow.",
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel appointment",
      "Connect this action to your cancellation flow.",
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageEyebrow}>LASUTH PATIENT SERVICES</Text>
            <Text style={styles.pageTitle}>Appointments</Text>
            <Text style={styles.pageSubtitle}>Manage your hospital visits</Text>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
          >
            <Feather name="bell" size={21} color={COLORS.greenDark} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* Booking banner */}
        <View style={styles.bookingBanner}>
          <View style={styles.bannerIcon}>
            <Feather name="calendar" size={25} color={COLORS.green} />
          </View>

          <Text style={styles.bannerTitle}>Need to see a doctor?</Text>

          <Text style={styles.bannerDescription}>
            Book a physical visit at a LASUTH clinic that suits you.
          </Text>

          <Pressable
            style={styles.bookButton}
            onPress={() => router.push("/appointments/book")}
          >
            <Feather name="plus" size={19} color={COLORS.white} />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </Pressable>
        </View>

        {/* Appointment filters */}
        <View style={styles.filterContainer}>
          {["Upcoming", "Past"].map((filter) => {
            const selected = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterButton, selected && styles.selectedFilter]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeading
          title={
            activeFilter === "Upcoming" ? "Upcoming visits" : "Past visits"
          }
        />

        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onView={() => router.push(`/appointments/${appointment.id}`)}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Feather name="calendar" size={29} color={COLORS.green} />
            </View>

            <Text style={styles.emptyTitle}>
              {activeFilter === "Upcoming"
                ? "No upcoming appointments"
                : "No past appointments"}
            </Text>

            <Text style={styles.emptyDescription}>
              {activeFilter === "Upcoming"
                ? "When you book a hospital visit, your appointment details will appear here."
                : "Your completed and previous visits will appear here."}
            </Text>

            {activeFilter === "Upcoming" && (
              <Pressable
                style={styles.emptyButton}
                onPress={() => router.push("/appointments/book")}
              >
                <Text style={styles.emptyButtonText}>Book a visit</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Helpful reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Feather name="info" size={19} color={COLORS.gold} />
          </View>

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Before your visit</Text>
            <Text style={styles.reminderDescription}>
              Arrive early and bring your LASUTH hospital number and any
              relevant medical documents.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>LASUTH · Your health, our priority</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 23,
  },
  pageEyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.green,
    marginBottom: 6,
  },
  pageTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 27,
    color: COLORS.text,
  },
  pageSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 5,
  },
  notificationButton: {
    height: 46,
    width: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  bookingBanner: {
    backgroundColor: COLORS.greenSoft,
    borderRadius: 22,
    padding: 20,
    marginBottom: 25,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  bannerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 19,
    color: COLORS.text,
    marginBottom: 7,
  },
  bannerDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    marginBottom: 18,
  },
  bookButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  bookButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E8EBE8",
    padding: 4,
    borderRadius: 16,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  selectedFilter: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  filterText: {
    fontFamily: "Inter_500Medium",
    color: COLORS.muted,
    fontSize: 13,
  },
  selectedFilterText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.green,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  sectionAction: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.green,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 17,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000000",
    shadowOpacity: 0.025,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  clinicIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.text,
  },
  doctorName: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 17,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.greenSoft,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.green,
  },
  typeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  typeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: COLORS.muted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 17,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 15,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F6F8F6",
    alignItems: "center",
    justifyContent: "center",
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: COLORS.text,
  },
  viewButton: {
    minHeight: 47,
    backgroundColor: COLORS.green,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 3,
  },
  viewButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 13,
  },
  secondaryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 17,
  },
  secondaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
    paddingVertical: 5,
  },
  secondaryActionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: COLORS.green,
  },
  cancelText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#B42318",
  },
  actionDivider: {
    height: 22,
    width: 1,
    backgroundColor: COLORS.border,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 18,
    backgroundColor: COLORS.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 13,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: COLORS.goldSoft,
    borderRadius: 16,
    padding: 15,
    marginTop: 6,
    marginBottom: 20,
  },
  reminderIcon: {
    marginTop: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 6,
  },
  reminderDescription: {
    fontFamily: "Inter_400Regular",
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  footer: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 8,
  },
});
