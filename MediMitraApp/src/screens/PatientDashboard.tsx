import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';
import { MEDICINES } from '../constants/mockData';

type Nav = StackNavigationProp<RootStackParamList, 'PatientDashboard'>;

const statusColors = { valid: COLORS.success, warning: COLORS.warning, expired: COLORS.danger };
const statusBg = { valid: COLORS.successBg, warning: COLORS.warningBg, expired: COLORS.dangerBg };
const doseEmoji: Record<string, string> = { morning: 'Subah 8:00', afternoon: 'Dopahar 1:00', night: 'Raat 9:00' };
const today = new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' });

export default function PatientDashboard() {
  const navigation = useNavigation<Nav>();
  const dosesDone = 3;
  const dosesTotal = 5;
  const progress = dosesDone / dosesTotal;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Meri Dawaayen 💊</Text>
            <Text style={styles.date}>Aaj — {today}</Text>
          </View>
          <TouchableOpacity style={styles.voiceBtn}>
            <Text style={{ fontSize: 22 }}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* Dose Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Aaj ki Dawaayen</Text>
          <Text style={styles.progressCount}>{dosesDone} / {dosesTotal} li hain</Text>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressPct}>{Math.round(progress * 100)}% complete</Text>
        </View>

        {/* Medicines */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meri Medicines</Text>
          <View style={styles.countBadge}><Text style={styles.countBadgeText}>{MEDICINES.length}</Text></View>
        </View>

        {MEDICINES.map((med) => (
          <View key={med.id} style={styles.medCard}>
            <View style={styles.medTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medManuf}>{med.manufacturer}</Text>
              </View>
              <View style={[styles.expiryBadge, { backgroundColor: statusBg[med.status] }]}>
                <Text style={[styles.expiryText, { color: statusColors[med.status] }]}>
                  {med.status === 'valid' ? `✓ ${med.daysLeft} din` :
                   med.status === 'warning' ? `⚠ ${med.daysLeft} din!` : '✕ Expired'}
                </Text>
              </View>
            </View>
            <View style={styles.doseChips}>
              {med.doseSchedule.map((d) => (
                <View key={d} style={styles.doseChip}>
                  <Text style={styles.doseChipText}>{doseEmoji[d]}</Text>
                </View>
              ))}
            </View>
            <View style={styles.stockRow}>
              <Text style={styles.stockText}>💊 {med.stock} tablets bachi hain</Text>
              {med.stock <= 5 && <Text style={{ color: COLORS.warning, fontSize: SIZES.xs, fontFamily: FONTS.semiBold }}>⚠ Low!</Text>}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.doseTrackerBtn} onPress={() => navigation.navigate('DoseTracker')}>
          <Text style={styles.doseTrackerBtnText}>📋 Aaj ki Doses Track Karein</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Voice FAB */}
      <TouchableOpacity style={styles.voiceFAB}>
        <Text style={{ fontSize: 28 }}>🔊</Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {['🏠 Home', '💊 Dawa', '📷 Scan', '🔔 Alerts', '👤 Profile'].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Text style={[styles.navText, i === 0 && { color: COLORS.primary }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, paddingTop: 16 },
  heading: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.dark },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 3 },
  voiceBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.tealLight,
    alignItems: 'center', justifyContent: 'center',
  },
  progressCard: {
    marginHorizontal: SIZES.padding, borderRadius: SIZES.radiusLg, padding: 20, marginBottom: 20,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  progressTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.85)' },
  progressCount: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.white, marginTop: 4 },
  progressBarOuter: { height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5, marginTop: 12 },
  progressBarInner: { height: 10, backgroundColor: COLORS.white, borderRadius: 5 },
  progressPct: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: 'rgba(255,255,255,0.8)', marginTop: 6, textAlign: 'right' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: SIZES.padding, marginBottom: 12 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark },
  countBadge: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  countBadgeText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.white },
  medCard: {
    marginHorizontal: SIZES.padding, backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 16, marginBottom: 12, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  medTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  medName: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark },
  medManuf: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, marginTop: 2 },
  expiryBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  expiryText: { fontFamily: FONTS.bold, fontSize: SIZES.xs },
  doseChips: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  doseChip: { backgroundColor: COLORS.tealLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  doseChipText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.primary },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockText: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey },
  doseTrackerBtn: {
    marginHorizontal: SIZES.padding, backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  doseTrackerBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
  voiceFAB: {
    position: 'absolute', bottom: 80, right: 20, width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  bottomNav: {
    backgroundColor: COLORS.white, flexDirection: 'row', paddingVertical: 10,
    paddingBottom: 16, borderTopWidth: 1, borderTopColor: COLORS.lightGrey,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.grey },
});
