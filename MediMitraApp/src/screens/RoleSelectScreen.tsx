import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';
import { Role } from '../constants/mockData';

type Nav = StackNavigationProp<RootStackParamList, 'RoleSelect'>;

const roles: { role: Role; emoji: string; title: string; subtitle: string }[] = [
  { role: 'shopkeeper', emoji: '🏪', title: 'Dukaan Wale', subtitle: 'Medicine scan karein' },
  { role: 'patient', emoji: '💊', title: 'Mareed', subtitle: 'Apni dawaayen track karein' },
  { role: 'guardian', emoji: '👨‍👩‍👦', title: 'Guardian', subtitle: 'Apne patient ki dekhbhaal karein' },
];

function RoleCard({ role, emoji, title, subtitle, onPress }: typeof roles[0] & { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>{emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function RoleSelectScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.miniLogo}><Text style={{ fontSize: 24 }}>🌉💊</Text></View>
          <View>
            <Text style={styles.logoName}>MediSetu</Text>
            <Text style={styles.logoTag}>Har Dawa Ka Khayal, Har Waqt</Text>
          </View>
        </View>

        <Text style={styles.heading}>Aap kaun hain?</Text>
        <Text style={styles.sub}>Apna role chunein aage badhne ke liye</Text>

        {roles.map((r) => (
          <RoleCard
            key={r.role}
            {...r}
            onPress={() => navigation.navigate('Login', { role: r.role })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.padding, paddingTop: 60, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  miniLogo: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.tealLight,
    justifyContent: 'center', alignItems: 'center',
  },
  logoName: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.dark },
  logoTag: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, fontStyle: 'italic' },
  heading: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.dark, marginBottom: 6 },
  sub: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.grey, marginBottom: 28 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIcon: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.tealLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  cardEmoji: { fontSize: 26 },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.dark },
  cardSubtitle: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 2 },
  arrow: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.primaryLight },
});
