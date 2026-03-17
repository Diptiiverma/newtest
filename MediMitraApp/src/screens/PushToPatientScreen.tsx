import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/colors';

type DoseTime = 'Subah' | 'Dopahar' | 'Raat';
type FoodInstruction = 'Khane ke Baad' | 'Khane se Pehle';

export default function PushToPatientScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [times, setTimes] = useState<DoseTime[]>(['Subah', 'Raat']);
  const [food, setFood] = useState<FoodInstruction>('Khane ke Baad');
  const [tablets, setTablets] = useState(1);
  const [success, setSuccess] = useState(false);

  const toggleTime = (t: DoseTime) => setTimes((prev) =>
    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
  );

  if (success) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <StatusBar style="dark" />
        <View style={styles.successCircle}>
          <Text style={{ fontSize: 52 }}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Patient ko bhej diya! ✓</Text>
        <Text style={styles.successSub}>SMS bhi gaya 📱</Text>
        <View style={styles.successInfo}>
          <Text style={styles.infoLine}>✅ Dashboard update ho gaya</Text>
          <Text style={styles.infoLine}>👨‍👩‍👦 Guardian ko bhi bata diya</Text>
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('ScanScreen' as never)}>
          <Text style={styles.doneBtnText}>📷 Nayi Dawa Scan Karo</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient ko Bhejo 📤</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Medicine Summary */}
        <View style={styles.medCard}>
          <Text style={styles.medName}>Metformin 500mg</Text>
          <View style={styles.row}><Text style={styles.label}>Expiry:</Text><Text style={styles.value}>June 2026 ✅</Text></View>
          <View style={styles.row}><Text style={styles.label}>Batch:</Text><Text style={styles.value}>BT-2024-MF-06</Text></View>
        </View>

        {/* Phone input */}
        <Text style={styles.fieldLabel}>📱 Patient ka Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor={COLORS.grey}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Time chips */}
        <Text style={styles.fieldLabel}>⏰ Dose ka Samay</Text>
        <View style={styles.chipsRow}>
          {(['Subah', 'Dopahar', 'Raat'] as DoseTime[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, times.includes(t) && styles.chipActive]}
              onPress={() => toggleTime(t)}
            >
              <Text style={[styles.chipText, times.includes(t) && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tablets stepper */}
        <Text style={styles.fieldLabel}>💊 Tablets per Dose</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => setTablets(Math.max(1, tablets - 1))}>
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepCount}>{tablets}</Text>
          <TouchableOpacity style={styles.stepBtn} onPress={() => setTablets(tablets + 1)}>
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Food toggle */}
        <Text style={styles.fieldLabel}>🍽️ Khaane ke saath</Text>
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

        {/* Send button */}
        <TouchableOpacity style={styles.sendBtn} onPress={() => setSuccess(true)} activeOpacity={0.88}>
          <Text style={styles.sendBtnText}>📤 Bhejo</Text>
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
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.dark },
  medCard: {
    backgroundColor: COLORS.tealLight, borderRadius: SIZES.radius, padding: 16, marginBottom: 20,
  },
  medName: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.primaryDark, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  label: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.grey },
  value: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark },
  fieldLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: SIZES.base, fontFamily: FONTS.regular,
    borderWidth: 2, borderColor: COLORS.lightGrey, color: COLORS.dark,
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
  sendBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg, paddingVertical: 16,
    alignItems: 'center', marginTop: 28,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  sendBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
  // Success state
  successContainer: { flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding * 2 },
  successCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.tealLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  successTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.primary, textAlign: 'center', marginBottom: 8 },
  successSub: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.grey, marginBottom: 24 },
  successInfo: { backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: 16, width: '100%', marginBottom: 24 },
  infoLine: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 8 },
  doneBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg, paddingVertical: 15, paddingHorizontal: 32,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  doneBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white },
});
