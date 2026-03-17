import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';
import { RECENT_SCANS } from '../constants/mockData';

type Nav = StackNavigationProp<RootStackParamList, 'ShopkeeperDashboard'>;

const statusColors = { valid: COLORS.success, warning: COLORS.warning, expired: COLORS.danger };
const statusLabels = { valid: 'Safe', warning: 'Warning', expired: 'Expired' };
const today = new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' });

export default function ShopkeeperDashboard() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Namaste, Sharma Ji 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: COLORS.primary }]}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>12</Text>
            <Text style={styles.statLabel}>Aaj ke Scans</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: COLORS.danger }]}>
            <Text style={[styles.statNum, { color: COLORS.danger }]}>3</Text>
            <Text style={styles.statLabel}>Expire Hua</Text>
          </View>
        </View>

        {/* Big Scan Button */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => navigation.navigate('ScanScreen')}
          activeOpacity={0.88}
        >
          <Text style={styles.scanBtnIcon}>📷</Text>
          <Text style={styles.scanBtnText}>Medicine Scan Karein</Text>
        </TouchableOpacity>

        {/* Recent Scans */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Sab Dekho →</Text></TouchableOpacity>
        </View>

        {RECENT_SCANS.map((scan) => (
          <View key={scan.id} style={styles.scanItem}>
            <View>
              <Text style={styles.scanName}>{scan.name}</Text>
              <Text style={styles.scanTime}>{scan.time}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColors[scan.status] + '20' }]}>
              <Text style={[styles.badgeText, { color: statusColors[scan.status] }]}>
                {statusLabels[scan.status]}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '📷', label: 'Scan', screen: 'ScanScreen' },
          { icon: '📋', label: 'History', screen: undefined },
          { icon: '👤', label: 'Profile', screen: undefined },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => item.screen && navigation.navigate(item.screen as any)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && { color: COLORS.primary }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, paddingTop: 20 },
  greeting: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.dark },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 2 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.white },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: SIZES.padding, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16,
    borderTopWidth: 3, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8,
  },
  statNum: { fontFamily: FONTS.bold, fontSize: 32 },
  statLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 4 },
  scanBtn: {
    marginHorizontal: SIZES.padding, height: 66, borderRadius: SIZES.radiusLg,
    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, marginBottom: 28,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  scanBtnIcon: { fontSize: 26 },
  scanBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.white, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.padding, marginBottom: 12 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark },
  seeAll: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.primary },
  scanItem: {
    marginHorizontal: SIZES.padding, backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  scanName: { fontFamily: FONTS.semiBold, fontSize: SIZES.md, color: COLORS.dark },
  scanTime: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
  bottomNav: {
    backgroundColor: COLORS.white, flexDirection: 'row', paddingVertical: 10,
    paddingBottom: 16, borderTopWidth: 1, borderTopColor: COLORS.lightGrey,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22 },
  navLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, marginTop: 3 },
});
