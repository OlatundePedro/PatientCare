import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

const LOGO = require("../assets/images/lasuth logo.png");
const MIN_DURATION = 3500;

export default function AnimatedSplash({ ready, onReveal, onFinish }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const [minTimePassed, setMinTimePassed] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => setMinTimePassed(true), MIN_DURATION);
    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    if (ready && minTimePassed) {
      onReveal?.();
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish?.());
    }
  }, [ready, minTimePassed, screenOpacity, onReveal, onFinish]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { width, height, opacity: screenOpacity }]}
    >
      <View style={styles.center}>
        <Animated.Image
          source={LOGO}
          resizeMode="contain"
          style={[
            styles.logo,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 999,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 140,
  },
});
