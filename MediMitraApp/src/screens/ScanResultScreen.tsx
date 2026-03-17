import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';

type Nav = StackNavigationProp<RootStackParamList, 'ScanResult'>;
type Route = RouteProp<RootStackParamList, 'ScanResult'>;

const CONFIG = {
  valid: {
    color: COLORS.success,
    bgColor: COLORS.successBg,
    icon: '✓',
    title: 'Safe Hai!',
    badge: 'VALID',
    badgeLabel: '85 din baaki',
    expiry: 'June 2026',
    warning: null,
    removeBtn: false,
  },
  warning: {
    color: COLORS.warning,
    bgColor: COLORS.warningBg,
    icon: '⚠',
    title: 'Jaldi Khatam Karo!',
    badge: 'EXPIRING SOON',
    badgeLabel: '2 din bache!',
    expiry: '18 March 2026',
    warning: 'Is dawa ko jald hi khatam karo. Patient ko batao.',
    removeBtn: false,
  },
  expired: {
    color: COLORS.danger,
    bgColor: COLORS.dangerBg,
    icon: '✕',
    title: 'Expire Ho Gayi!',
    badge: 'EXPIRED',
    badgeLabel: '15 din pehle',
    expiry: '1 Feb 2026',
    warning: 'Yeh dawa mat becho. Apne stock se hatao.',
    removeBtn: true,
  },
};

export default function ScanResultScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const status = params?.status ?? 'valid';
  const cfg = CONFIG[status];

  const slideAnim = useRef(new Animated.Value(300)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(iconScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Drag handle */}
      <View style={styles.handle} />

      <Animated.ScrollView
        style={{ transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Icon */}
        <Animated.View style={[styles.resultCircle, { backgroundColor: cfg.bgColor, transform: [{ scale: iconScale }] }]}>
          <Text style={[styles.resultIcon, { color: cfg.color }]}>{cfg.icon}</Text>
        </Animated.View>
        <Text style={[styles.resultTitle, { color: cfg.color }]}>{cfg.title}</Text>

        {/* Medicine Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.medName}>Metformin 500mg</Text>
          <Text style={styles.manufacturer}>Sun Pharma</Text>
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📅</Text>
            <Text style={styles.rowLabel}>Expiry:</Text>
            <Text style={styles.rowValue}>{cfg.expiry}</Text>
            <View style={[styles.pill, { backgroundColor: cfg.color + '20' }]}>
              <Text style={[styles.pillText, { color: cfg.color }]}>{cfg.badge} — {cfg.badgeLabel}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowIcon}>🏷️</Text>
            <Text style={styles.rowLabel}>Batch:</Text>
            <Text style={styles.rowValue}>BT-2024-MF-06</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📦</Text>
            <Text style={styles.rowLabel}>Barcode:</Text>
            <Text style={styles.rowValue}>8901234567890</Text>
          </View>
        </View>

        {/* Dose Instructions */}
        {status !== 'expired' && (
          <View style={styles.doseBox}>
            <Text style={styles.doseTitle}>💊 Dose Instructions</Text>
            <Text style={styles.doseText}>Subah 1 goli — khane ke baad{'\n'}Raat 1 goli — khane ke baad</Text>
          </View>
        )}

        {/* Warning box */}
        {cfg.warning && (
          <View style={[styles.warningBox, { backgroundColor: cfg.bgColor, borderLeftColor: cfg.color }]}>
            <Text style={[styles.warningText, { color: cfg.color }]}>⚡ {cfg.warning}</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.btnRow}>
          {status === 'expired' ? (
            <TouchableOpacity style={[styles.btn, styles.btnOutline, { borderColor: COLORS.danger }]}>
              <Text style={[styles.btnText, { color: COLORS.danger }]}>🗑️ Stock Se Hatao</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => navigation.navigate('PushToPatient')}
              >
                <Text style={styles.btnText}>📤 Patient ko Bhejo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.btnText, { color: COLORS.primary }]}>🔄 Dobara Scan Karo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: SIZES.padding },
  handle: { width: 48, height: 5, borderRadius: 3, backgroundColor: COLORS.lightGrey, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  resultCircle: {
    width: 90, height: 90, borderRadius: 45, alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 12,
  },
  resultIcon: { fontSize: 42, fontWeight: '700' },
  resultTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, textAlign: 'center', marginBottom: 24 },
  infoCard: {
    backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: 16, marginBottom: 16,
  },
  medName: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.dark },
  manufacturer: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  rowIcon: { fontSize: 16 },
  rowLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.grey },
  rowValue: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark, flex: 1 },
  pill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontFamily: FONTS.bold, fontSize: SIZES.xs },
  divider: { height: 1, backgroundColor: COLORS.lightGrey, marginVertical: 10 },
  doseBox: {
    backgroundColor: COLORS.tealLight, borderRadius: SIZES.radius, padding: 14, marginBottom: 14,
  },
  doseTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.primaryDark, marginBottom: 6 },
  doseText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.dark, lineHeight: 22 },
  warningBox: {
    borderRadius: SIZES.radius, padding: 14, marginBottom: 14, borderLeftWidth: 4,
  },
  warningText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, lineHeight: 22 },
  btnRow: { gap: 12 },
  btn: { borderRadius: SIZES.radiusLg, paddingVertical: 15, alignItems: 'center' },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  btnOutline: { borderWidth: 2, borderColor: COLORS.primary },
  btnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
});
