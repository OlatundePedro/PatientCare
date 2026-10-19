import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarSpace } from "../../../components/CurvedTabBar";

const COLORS = {
  primary: "#0B6B43",
  primarySoft: "#E9F6EF",
  iconSoft: "#CFEBDD",
  navy: "#0F1F33",
  text: "#0F1F33",
  muted: "#64748B",
  white: "#FFFFFF",
  background: "#ffffff",
  border: "#E8EDF2",
  buttonGray: "#F1F4F7",
  dot: "#F5A623",
};

const LASUTH_LOGO = require("../../../assets/images/logo.png");

const USER_AVATAR = null;
const DOCTOR_AVATAR = null;

const USER_NAME = "Adaeze";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Avatar({ source, size }) {
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (source) {
    return <Image source={source} style={style} />;
  }

  return (
    <View style={[styles.avatarFallback, style]}>
      <Feather name="user" size={size * 0.5} color={COLORS.primary} />
    </View>
  );
}

function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

function ActionCard({ title, description, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
    >
      <View style={styles.actionIcon}>
        <Feather name={icon} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.actionBottom}>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <Feather name="arrow-right" size={20} color={COLORS.navy} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const tabBarSpace = useTabBarSpace();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarSpace },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image
              source={LASUTH_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.brandText}>
              <Text style={styles.brandName}>LASUTH</Text>
              <Text style={styles.brandSubtitle}>Lagos State University</Text>
              <Text style={styles.brandSubtitle}>Teaching Hospital</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              accessibilityLabel="Notifications"
              style={styles.notificationButton}
              onPress={() => router.push("/notifications")}
            >
              <Feather name="bell" size={22} color={COLORS.navy} />
              <View style={styles.notificationDot} />
            </Pressable>

            <Pressable
              accessibilityLabel="Profile"
              onPress={() => router.push("/profile")}
            >
              <Avatar source={USER_AVATAR} size={46} />
            </Pressable>
          </View>
        </View>

        <View style={styles.welcome}>
          <Text style={styles.greeting}>
            {getGreeting()}, {USER_NAME}
          </Text>
          <Text style={styles.welcomeSubtitle}>How can we help you today?</Text>
        </View>

        <View style={styles.actionsRow}>
          <ActionCard
            title="Book a visit"
            description="Schedule a physical consultation at LASUTH"
            icon="calendar"
            onPress={() => router.push("/appointments/book")}
          />

          <ActionCard
            title="Start consultation"
            description="Consult a doctor online"
            icon="video"
            onPress={() => router.push("/consultations")}
          />
        </View>

        <SectionTitle
          right={
            <View style={styles.statusBadge}>
              <Feather name="check-circle" size={15} color={COLORS.primary} />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          }
        >
          Upcoming Appointment
        </SectionTitle>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.roundIcon}>
              <MaterialCommunityIcons
                name="medical-bag"
                size={26}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.cardDetails}>
              <Text style={styles.itemTitle}>Medical Outpatient Clinic</Text>

              <View style={styles.detailRow}>
                <Feather name="calendar" size={16} color={COLORS.muted} />
                <Text style={styles.detailText}>Tomorrow · 10:30 AM</Text>
              </View>

              <View style={styles.detailRow}>
                <Feather name="map-pin" size={16} color={COLORS.muted} />
                <Text style={styles.detailText}>LASUTH, Ikeja</Text>
              </View>
            </View>

            <Feather name="arrow-right" size={20} color={COLORS.muted} />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/appointments")}
          >
            <Text style={styles.primaryButtonText}>View Appointment</Text>
            <Feather name="arrow-right" size={17} color={COLORS.white} />
          </Pressable>
        </View>

        <SectionTitle>Your Prescriptions</SectionTitle>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.roundIcon}>
              <MaterialCommunityIcons
                name="pill"
                size={26}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.cardDetails}>
              <Text style={styles.itemTitle}>Amoxicillin</Text>
              <Text style={styles.detailText}>500mg · 3 times daily</Text>
            </View>

            <Feather name="arrow-right" size={20} color={COLORS.muted} />
          </View>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/prescriptions")}
          >
            <Text style={styles.secondaryButtonText}>View Prescription</Text>
            <Feather name="arrow-right" size={17} color={COLORS.primary} />
          </Pressable>
        </View>

        <SectionTitle>Recent Consultations</SectionTitle>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/consultations")}
        >
          <View style={styles.cardTop}>
            <Avatar source={DOCTOR_AVATAR} size={50} />

            <View style={styles.cardDetails}>
              <Text style={styles.itemTitle}>Dr. Amina Balogun</Text>
              <Text style={styles.detailText}>General Medicine</Text>

              <View style={styles.detailRow}>
                <Feather name="calendar" size={15} color={COLORS.muted} />
                <Text style={styles.detailText}>25 September 2026</Text>
              </View>
            </View>

            <Feather name="arrow-right" size={20} color={COLORS.muted} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 66,
    height: 66,
    marginRight: 0,
  },
  brandText: {
    flex: 1,
  },
  brandName: {
    fontFamily: "WorkSans_700Bold",
    color: COLORS.navy,
    fontSize: 25,
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    fontFamily: "WorkSans_400Regular",
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 13,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.dot,
  },
  avatarFallback: {
    backgroundColor: COLORS.iconSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    marginBottom: 18,
  },
  greeting: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 22,
    color: COLORS.navy,
  },
  welcomeSubtitle: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 19,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    gap: 15,
  },
  actionIcon: {
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: COLORS.iconSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 60,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 5,
  },
  actionDescription: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.muted,
  },
  pressed: {
    opacity: 0.75,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "WorkSans_700Bold",
    fontSize: 15,
    color: COLORS.navy,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0F1F33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roundIcon: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: COLORS.iconSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDetails: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 14,
    color: COLORS.navy,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  detailText: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 12,
    color: COLORS.muted,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    minHeight: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  primaryButtonText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.white,
    fontSize: 12,
  },
  secondaryButton: {
    marginTop: 14,
    minHeight: 44,
    backgroundColor: COLORS.buttonGray,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  secondaryButtonText: {
    fontFamily: "WorkSans_600SemiBold",
    color: COLORS.primary,
    fontSize: 12,
  },
});
