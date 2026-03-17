import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/colors';
import { DOSE_SCHEDULE } from '../constants/mockData';

type DoseStatus = 'pending' | 'taken' | 'missed';

interface DoseEntry { label: string; time: string; taken: boolean; status: DoseStatus; }

const SECTIONS: { key: 'morning' | 'afternoon' | 'night'; label: string; icon: string; time: string }[] = [
  { key: 'morning', label: 'Subah', icon: '🌅', time: '8:00 AM' },
  { key: 'afternoon', label: 'Dopahar', icon: '☀️', time: '1:00 PM' },
  { key: 'night', label: 'Raat', icon: '🌙', time: '9:00 PM' },
];

export default function DoseTrackerScreen() {
  const navigation = useNavigation();

  const [doseState, setDoseState] = useState<Record<string, DoseStatus>>(() => {
    const init: Record<string, DoseStatus> = {};
    Object.entries(DOSE_SCHEDULE).forEach(([section, doses]) => {
      doses.forEach((d, i) => {
        init[`${section}_${i}`] = d.taken ? 'taken' : 'pending';
      });
    });
    return init;
  });

  const toggleDose = (key: string) => {
    setDoseState((prev) => ({
      ...prev,
      [key]: prev[key] === 'pending' ? 'taken' : prev[key] === 'taken' ? 'missed' : 'pending',
    }));
  };

  const allKeys = Object.values(doseState);
  const taken = allKeys.filter((s) => s === 'taken').length;
  const total = allKeys.length;
  const progress = total > 0 ? taken / total : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aaj ki Dawaayen 📋</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Circular Progress */}
      <View style={styles.circleContainer}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.circleCount}>{taken}/{total}</Text>
            <Text style={styles.circleLabel}>Complete</Text>
          </View>
        </View>
        <Text style={styles.circleSubLabel}>Aaj ki doses track ho rahi hain</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {SECTIONS.map(({ key, label, icon, time }) => {
          const doses = DOSE_SCHEDULE[key];
          return (
            <View key={key} style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{icon}</Text>
                <Text style={styles.sectionLabel}>{label}</Text>
                <Text style={styles.sectionTime}>{time}</Text>
              </View>
              {doses.map((dose, i) => {
                const stateKey = `${key}_${i}`;
                const status = doseState[stateKey];
                return (
                  <View key={i} style={[styles.doseRow, status === 'missed' && styles.doseRowMissed]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doseName}>{dose.label}</Text>
                      <View style={styles.foodChip}>
                        <Text style={styles.foodChipText}>Khane ke Baad</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        status === 'taken' && styles.takenBtn,
                        status === 'missed' && styles.missedBtn,
                      ]}
                      onPress={() => toggleDose(stateKey)}
                    >
                      <Text style={styles.actionBtnText}>
                        {status === 'taken' ? '✓ Ho Gayi' : status === 'missed' ? '✕ Miss' : 'Li'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SIZES.padding, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.lightGrey,
  },
  back: { fontSize: 24, color: COLORS.dark, width: 32 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark },
  circleContainer: { alignItems: 'center', paddingVertical: 24, backgroundColor: COLORS.white, marginBottom: 8 },
  circleOuter: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 8, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  circleInner: { alignItems: 'center' },
  circleCount: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.primary },
  circleLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey },
  circleSubLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionIcon: { fontSize: 20 },
  sectionLabel: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark, flex: 1 },
  sectionTime: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey },
  doseRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, padding: 14, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  doseRowMissed: { backgroundColor: COLORS.dangerBg, borderLeftWidth: 4, borderLeftColor: COLORS.danger },
  doseName: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 6 },
  foodChip: { backgroundColor: COLORS.tealLight, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  foodChipText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.primary },
  actionBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingHorizontal: 16, paddingVertical: 10, minWidth: 90, alignItems: 'center',
  },
  takenBtn: { backgroundColor: COLORS.success },
  missedBtn: { backgroundColor: COLORS.danger },
  actionBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.white },
});
