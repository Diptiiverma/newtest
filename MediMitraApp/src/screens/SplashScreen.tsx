import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';

const { width } = Dimensions.get('window');

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

const Dot = ({ delay }: { delay: number }) => {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.dot, { opacity: anim, transform: [{ scale: anim }] }]} />
  );
};

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const logoScale = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(textFade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('RoleSelect'), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <Text style={styles.emoji}>🌉💊</Text>
      </Animated.View>
      <Animated.View style={{ opacity: textFade, alignItems: 'center' }}>
        <Text style={styles.appName}>MediSetu</Text>
        <Text style={styles.tagline}>Har Dawa Ka Khayal, Har Waqt</Text>
      </Animated.View>
      <View style={styles.dotsContainer}>
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: { fontSize: 48 },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 40,
    color: COLORS.white,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
});
