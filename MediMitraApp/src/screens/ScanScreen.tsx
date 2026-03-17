import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONTS, SIZES } from '../constants/colors';

type Nav = StackNavigationProp<RootStackParamList, 'ScanScreen'>;
const { width, height } = Dimensions.get('window');
const FRAME_W = width * 0.8;
const FRAME_H = height * 0.42;

type ScanPhase = 'scanning' | 'ocr' | 'processing' | 'done';
type ScanMethod = 'BARCODE' | 'OCR' | 'BATCH';

export default function ScanScreen() {
  const navigation = useNavigation<Nav>();
  const [torch, setTorch] = useState(false);
  const [phase, setPhase] = useState<ScanPhase>('scanning');
  const [method, setMethod] = useState<ScanMethod>('BARCODE');
  const scanLine = useRef(new Animated.Value(0)).current;
  const statusOpacity = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  // Animate scan line up/down
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: FRAME_H - 4, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Simulate scan progression
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('ocr'); setMethod('OCR');
      Animated.sequence([
        Animated.timing(statusOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(statusOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }, 3500);
    const t2 = setTimeout(() => { setPhase('processing'); }, 5000);
    const t3 = setTimeout(() => { setPhase('done'); navigation.navigate('ScanResult', { status: 'valid' }); }, 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const methodColors: Record<ScanMethod, string> = {
    BARCODE: COLORS.primary, OCR: COLORS.warning, BATCH: '#7C3AED',
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Simulated dark camera bg */}
      <View style={styles.cameraBg} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.topIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Medicine Scan</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setTorch(!torch)}>
          <Text style={styles.topIcon}>{torch ? '🔦' : '💡'}</Text>
        </TouchableOpacity>
      </View>

      {/* Scanning Frame */}
      <View style={styles.frameContainer}>
        {/* Method badge above frame */}
        <View style={[styles.methodBadge, { backgroundColor: methodColors[method] + '22', borderColor: methodColors[method] }]}>
          <Text style={[styles.methodText, { color: methodColors[method] }]}>{method}</Text>
        </View>

        <View style={styles.frame}>
          {/* Corners */}
          {['tl', 'tr', 'bl', 'br'].map((c) => (
            <View key={c} style={[styles.corner, styles[c as 'tl']]} />
          ))}
          {/* Scan line */}
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLine }] }]} />
        </View>
      </View>

      {/* Status Card */}
      <Animated.View style={[styles.statusCard, { opacity: statusOpacity }]}>
        <Text style={styles.statusIcon}>
          {phase === 'scanning' ? '📷' : phase === 'ocr' ? '🔤' : '⏳'}
        </Text>
        <Text style={styles.statusMain}>
          {phase === 'scanning' ? 'Strip ko frame mein laayein' :
           phase === 'ocr' ? 'Barcode nahi mila' :
           'Details check ho rahi hain...'}
        </Text>
        <Text style={styles.statusSub}>
          {phase === 'scanning' ? 'Barcode scan kar raha hai...' :
           phase === 'ocr' ? 'Text padh raha hai...' :
           'Thoda ruko...'}
        </Text>
      </Animated.View>

      {/* Torch FAB */}
      <TouchableOpacity style={styles.torchBtn} onPress={() => setTorch(!torch)}>
        <Text style={{ fontSize: 22 }}>🔦</Text>
      </TouchableOpacity>
    </View>
  );
}

function cornerStyle(c: string) {
  const size = 28, border = 3;
  const base: any = { position: 'absolute', width: size, height: size, borderColor: COLORS.primary };
  if (c === 'tl') return { ...base, top: -1, left: -1, borderTopWidth: border, borderLeftWidth: border };
  if (c === 'tr') return { ...base, top: -1, right: -1, borderTopWidth: border, borderRightWidth: border };
  if (c === 'bl') return { ...base, bottom: -1, left: -1, borderBottomWidth: border, borderLeftWidth: border };
  return { ...base, bottom: -1, right: -1, borderBottomWidth: border, borderRightWidth: border };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center' },
  cameraBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#111820' },
  topBar: {
    position: 'absolute', top: 56, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, zIndex: 10,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topIcon: { fontSize: 22, color: COLORS.white },
  topTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.white },
  frameContainer: { marginTop: height * 0.2, alignItems: 'center' },
  methodBadge: {
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5,
    marginBottom: 12,
  },
  methodText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, letterSpacing: 1.5 },
  frame: {
    width: FRAME_W, height: FRAME_H,
    overflow: 'hidden', position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tl: cornerStyle('tl') as any,
  tr: cornerStyle('tr') as any,
  bl: cornerStyle('bl') as any,
  br: cornerStyle('br') as any,
  corner: { position: 'absolute', width: 28, height: 28 } as any,
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  statusCard: {
    position: 'absolute', bottom: 120, left: SIZES.padding * 2, right: SIZES.padding * 2,
    backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: SIZES.radiusLg,
    padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  statusIcon: { fontSize: 32, marginBottom: 8 },
  statusMain: { fontFamily: FONTS.semiBold, fontSize: SIZES.md, color: COLORS.dark, textAlign: 'center' },
  statusSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.grey, marginTop: 4, textAlign: 'center' },
  torchBtn: {
    position: 'absolute', bottom: 40, right: 24,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
});
