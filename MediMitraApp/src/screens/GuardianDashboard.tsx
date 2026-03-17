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
import { PATIENTS } from '../constants/mockData';

type Nav = StackNavigationProp<RootStackParamList, 'GuardianDashboard'>;

const alertColors = {
  expiry: COLORS.warning,
  missed: COLORS.danger,
  low_stock: COLORS.warning,
  info: COLORS.primary,
};
const alertBg = {
  expiry: COLORS.warningBg,
  missed: COLORS.dangerBg,
  low_stock: COLORS.warningBg,
  info: COLORS.tealLight,
};

export default function GuardianDashboard() {
  const navigation = useNavigation<Nav>();
  const patient = PATIENTS[0];
  const totalAlerts = patient.alerts.length;

  const overallStatus = patient.alerts.some((a) => a.type === 'missed')
    ? 'missed'
    : patient.alerts.some((a) => a.type === 'expiry')
    ? 'expiry'
    : 'good';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Mere Patients 👨‍👩‍👦</Text>
            <Text style={styles.subheading}>Rahul (Beta)</Text>
          </View>
          {totalAlerts > 0 && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{totalAlerts}</Text>
            </View>
          )}
        </View>

        {/* Patient Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientCardTop}>
            <View style={styles.patientAvatar}>
              <Text style={{ fontSize: 24 }}>👴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientRelation}>{patient.relation}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => navigation.navigate('PatientDashboard')}
            >
              <Text style={styles.viewBtnText}>Dekhein</Text>
            </TouchableOpacity>
          </View>

          {/* Dose Progress */}
          <View style={styles.doseRow}>
            <Text style={styles.doseTxt}>
              💊 {patient.dosesToday}/{patient.totalDoses} doses aaj
            </Text>
          </View>
          <View style={styles.doseBarOuter}>
            <View style={[styles.doseBarInner, { width: `${(patient.dosesToday / patient.totalDoses) * 100}%` }]} />
          </View>

          {/* Alert chips */}
          <View style={styles.chipsRow}>
            {overallStatus === 'missed' && (
              <View style={[styles.statusChip, { backgroundColor: COLORS.dangerBg }]}>
                <Text style={[styles.statusChipText, { color: COLORS.danger }]}>✕ Dose miss hua</Text>
              </View>
            )}
            {overallStatus === 'expiry' || patient.alerts.some((a) => a.type === 'expiry') ? (
              <View style={[styles.statusChip, { backgroundColor: COLORS.warningBg }]}>
                <Text style={[styles.statusChipText, { color: COLORS.warning }]}>⚠ Expiry Warning</Text>
              </View>
            ) : null}
            {overallStatus === 'good' && (
              <View style={[styles.statusChip, { backgroundColor: COLORS.successBg }]}>
                <Text style={[styles.statusChipText, { color: COLORS.success }]}>✓ Sab theek hai aaj</Text>
              </View>
            )}
          </View>
        </View>

        {/* Reminder Button */}
        <TouchableOpacity
          style={styles.reminderBtn}
          onPress={() => navigation.navigate('SetReminder', { patientName: patient.name })}
        >
          <Text style={styles.reminderBtnText}>⏰ Reminder Set Karo</Text>
        </TouchableOpacity>

        {/* Alert Feed */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {patient.alerts.map((alert) => (
          <View key={alert.id} style={[styles.alertRow, { borderLeftColor: alertColors[alert.type], backgroundColor: alertBg[alert.type] }]}>
            <Text style={styles.alertMsg}>{alert.message}</Text>
            <Text style={styles.alertTime}>{alert.timeAgo}</Text>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {['🏠 Home', '👥 Patients', '🔔 Alerts', '⚙️ Settings'].map((item, i) => (
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SIZES.padding, paddingTop: 16,
  },
  heading: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.dark },
  subheading: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 2 },
  alertBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.danger,
    alignItems: 'center', justifyContent: 'center',
  },
  alertBadgeText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.white },
  patientCard: {
    marginHorizontal: SIZES.padding, backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: 16, marginBottom: 16, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10,
  },
  patientCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  patientAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.tealLight,
    alignItems: 'center', justifyContent: 'center',
  },
  patientName: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.dark },
  patientRelation: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, marginTop: 2 },
  viewBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  viewBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.white },
  doseRow: { marginBottom: 6 },
  doseTxt: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.dark },
  doseBarOuter: { height: 8, backgroundColor: COLORS.lightGrey, borderRadius: 4, marginBottom: 12 },
  doseBarInner: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusChipText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
  reminderBtn: {
    marginHorizontal: SIZES.padding, backgroundColor: COLORS.tealLight, borderRadius: SIZES.radiusLg,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: COLORS.primary,
  },
  reminderBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.primary },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark, paddingHorizontal: SIZES.padding, marginBottom: 12 },
  alertRow: {
    marginHorizontal: SIZES.padding, borderRadius: SIZES.radius, padding: 14, marginBottom: 10,
    borderLeftWidth: 4,
  },
  alertMsg: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 4 },
  alertTime: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey },
  bottomNav: {
    backgroundColor: COLORS.white, flexDirection: 'row', paddingVertical: 10,
    paddingBottom: 16, borderTopWidth: 1, borderTopColor: COLORS.lightGrey,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.grey },
});
