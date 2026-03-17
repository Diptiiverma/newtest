import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';
import { MEDICINES } from '../constants/mockData';

type Route = RouteProp<RootStackParamList, 'SetReminder'>;
type Frequency = 'Ek baar' | 'Do baar' | 'Teen baar';
type FoodInstruction = 'Khane ke Baad' | 'Khane se Pehle';

export default function SetReminderScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const [selectedMed, setSelectedMed] = useState(MEDICINES[0].id);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [frequency, setFrequency] = useState<Frequency>('Do baar');
  const [food, setFood] = useState<FoodInstruction>('Khane ke Baad');
  const [tablets, setTablets] = useState(1);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Text style={{ fontSize: 60 }}>⏰</Text>
        <Text style={styles.successTitle}>Reminder save ho gaya!</Text>
        <Text style={styles.successSub}>Patient ko time par notification milegi</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>← Wapas Jao</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Reminder Set Karo ⏰</Text>
          <Text style={styles.headerSub}>{params.patientName} ke liye</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Medicine selector */}
        <Text style={styles.label}>💊 Medicine Chunein</Text>
        {MEDICINES.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={[styles.medOption, selectedMed === med.id && styles.medOptionSelected]}
            onPress={() => setSelectedMed(med.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.medOptionName, selectedMed === med.id && { color: COLORS.primary }]}>{med.name}</Text>
              <Text style={styles.medOptionSub}>{med.manufacturer}</Text>
            </View>
            {selectedMed === med.id && <Text style={{ color: COLORS.primary, fontSize: 20 }}>✓</Text>}
          </TouchableOpacity>
        ))}

        {/* Time picker (simplified clock UI) */}
        <Text style={styles.label}>🕐 Samay Chunein</Text>
        <View style={styles.timePicker}>
          <View style={styles.timeUnit}>
            <TouchableOpacity onPress={() => setHour((h) => (h + 1) % 24)} style={styles.timeArrow}>
              <Text style={styles.timeArrowText}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.timeValue}>{String(hour).padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => setHour((h) => (h - 1 + 24) % 24)} style={styles.timeArrow}>
              <Text style={styles.timeArrowText}>▼</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeSep}>:</Text>
          <View style={styles.timeUnit}>
            <TouchableOpacity onPress={() => setMinute((m) => (m + 5) % 60)} style={styles.timeArrow}>
              <Text style={styles.timeArrowText}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.timeValue}>{String(minute).padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => setMinute((m) => (m - 5 + 60) % 60)} style={styles.timeArrow}>
              <Text style={styles.timeArrowText}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Frequency */}
        <Text style={styles.label}>📅 Kitni baar?</Text>
        <View style={styles.chipsRow}>
          {(['Ek baar', 'Do baar', 'Teen baar'] as Frequency[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, frequency === f && styles.chipActive]}
              onPress={() => setFrequency(f)}
            >
              <Text style={[styles.chipText, frequency === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Food instruction */}
        <Text style={styles.label}>🍽️ Khaane ke saath</Text>
        <View style={styles.chipsRow}>
          {(['Khane ke Baad', 'Khane se Pehle'] as FoodInstruction[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, food === f && styles.chipActive]}
              onPress={() => setFood(f)}
            >
              <Text style={[styles.chipText, food === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tablets stepper */}
        <Text style={styles.label}>💊 Tablets per Dose</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => setTablets(Math.max(1, tablets - 1))}>
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepCount}>{tablets}</Text>
          <TouchableOpacity style={styles.stepBtn} onPress={() => setTablets(tablets + 1)}>
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => setSaved(true)}>
          <Text style={styles.saveBtnText}>⏰ Reminder Save Karo</Text>
        </TouchableOpacity>
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
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark, textAlign: 'center' },
  headerSub: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, textAlign: 'center' },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 10, marginTop: 20 },
  medOption: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, padding: 14, marginBottom: 8,
    borderWidth: 2, borderColor: COLORS.lightGrey, elevation: 1,
  },
  medOptionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.tealLight },
  medOptionName: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark },
  medOptionSub: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.grey, marginTop: 2 },
  timePicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, padding: 20, gap: 8,
  },
  timeUnit: { alignItems: 'center', width: 72 },
  timeArrow: { padding: 8 },
  timeArrowText: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.primary },
  timeSep: { fontFamily: FONTS.bold, fontSize: 36, color: COLORS.primary },
  timeValue: {
    fontFamily: FONTS.bold, fontSize: 42, color: COLORS.dark,
    backgroundColor: COLORS.tealLight, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
    textAlign: 'center', minWidth: 72,
  },
  chipsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: {
    borderWidth: 2, borderColor: COLORS.lightGrey, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.white,
  },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.tealLight },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.grey },
  chipTextActive: { color: COLORS.primary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  stepBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { color: COLORS.white, fontSize: 22, fontFamily: FONTS.bold },
  stepCount: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.dark, minWidth: 40, textAlign: 'center' },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg, paddingVertical: 16,
    alignItems: 'center', marginTop: 28,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
  // Success
  successContainer: { flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.primary, textAlign: 'center', marginTop: 16, marginBottom: 8 },
  successSub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.grey, textAlign: 'center', marginBottom: 28 },
  doneBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg, paddingVertical: 15, paddingHorizontal: 28,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  doneBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
});
