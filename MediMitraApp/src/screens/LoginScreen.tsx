import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Animated,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';

type Nav = StackNavigationProp<RootStackParamList, 'Login'>;
type Route = RouteProp<RootStackParamList, 'Login'>;

const roleLabels: Record<string, string> = {
  shopkeeper: 'Dukaan Wala',
  patient: 'Mareed',
  guardian: 'Guardian',
};
const destMap: Record<string, keyof RootStackParamList> = {
  shopkeeper: 'ShopkeeperDashboard',
  patient: 'PatientDashboard',
  guardian: 'GuardianDashboard',
};

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { role } = params;
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const otpAnim = useRef(new Animated.Value(0)).current;

  const sendOtp = () => {
    if (phone.length < 10) return;
    setStep('otp');
    Animated.spring(otpAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const login = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace(destMap[role] as any);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{roleLabels[role]} Login</Text>
        <Text style={styles.headerSub}>Phone se login karein</Text>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: SIZES.padding }}>
        <Text style={styles.label}>📱 Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor={COLORS.grey}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={13}
        />

        {step === 'phone' ? (
          <TouchableOpacity style={styles.btn} onPress={sendOtp} activeOpacity={0.85}>
            <Text style={styles.btnText}>OTP Bhejo 📨</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View style={{ opacity: otpAnim, transform: [{ translateY: otpAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }}>
            <Text style={[styles.label, { marginTop: 24 }]}>🔐 OTP Dalein</Text>
            <View style={styles.otpRow}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={[styles.otpBox, otp.length > i && styles.otpBoxFilled]}>
                  <Text style={styles.otpChar}>{otp[i] || ''}</Text>
                </View>
              ))}
            </View>
            <TextInput
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
              keyboardType="number-pad"
              value={otp}
              onChangeText={(val) => setOtp(val.slice(0, 4))}
              autoFocus
              maxLength={4}
            />
            <Text style={styles.resend}>OTP nahi aaya? <Text style={{ color: COLORS.primary }}>Dobara Bhejo</Text></Text>
            <TouchableOpacity style={styles.btn} onPress={login} activeOpacity={0.85}>
              <Text style={styles.btnText}>{loading ? 'Login ho raha hai...' : 'Login Karein ✓'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: SIZES.padding },
  back: { marginBottom: 8 },
  backText: { color: COLORS.white, fontSize: 24 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.white },
  headerSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  body: { flex: 1, backgroundColor: COLORS.background },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.dark, marginBottom: 8, marginTop: 24 },
  input: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: SIZES.base, fontFamily: FONTS.regular,
    borderWidth: 2, borderColor: COLORS.lightGrey, color: COLORS.dark,
  },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusLg, paddingVertical: 16,
    alignItems: 'center', marginTop: 24,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  btnText: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.white, letterSpacing: 0.5 },
  otpRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 8 },
  otpBox: {
    width: 60, height: 60, borderRadius: SIZES.radius, borderWidth: 2,
    borderColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.tealLight },
  otpChar: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.dark },
  resend: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, textAlign: 'center', marginTop: 12 },
});
