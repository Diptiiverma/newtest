export type Role = 'shopkeeper' | 'patient' | 'guardian';

export interface Medicine {
  id: string;
  name: string;
  generic?: string;
  manufacturer: string;
  expiryDate: string;
  expiryLabel: string;
  stock: number;
  doseSchedule: ('morning' | 'afternoon' | 'night')[];
  status: 'valid' | 'warning' | 'expired';
  daysLeft: number;
  batchNo: string;
  barcode?: string;
}

export interface Patient {
  id: string;
  name: string;
  relation?: string;
  dosesToday: number;
  totalDoses: number;
  medicines: Medicine[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'expiry' | 'missed' | 'low_stock' | 'info';
  message: string;
  timeAgo: string;
  patientName: string;
}

export const MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Metformin 500mg',
    manufacturer: 'Sun Pharma',
    expiryDate: 'June 2026',
    expiryLabel: '45 din baaki',
    stock: 22,
    doseSchedule: ['morning', 'night'],
    status: 'valid',
    daysLeft: 85,
    batchNo: 'BT-2024-MF-06',
    barcode: '8901234567890',
  },
  {
    id: '2',
    name: 'Amlodipine 5mg',
    manufacturer: 'Cipla',
    expiryDate: '18 March 2026',
    expiryLabel: '2 din bache!',
    stock: 5,
    doseSchedule: ['night'],
    status: 'warning',
    daysLeft: 2,
    batchNo: 'BT-2024-AM-03',
    barcode: '8901234567891',
  },
  {
    id: '3',
    name: 'Atorvastatin 10mg',
    manufacturer: 'Ranbaxy',
    expiryDate: 'March 2027',
    expiryLabel: '380 din baaki',
    stock: 30,
    doseSchedule: ['night'],
    status: 'valid',
    daysLeft: 380,
    batchNo: 'BT-2025-AT-03',
    barcode: '8901234567892',
  },
];

export const PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Ramesh Ji',
    relation: 'Papa',
    dosesToday: 3,
    totalDoses: 5,
    medicines: MEDICINES,
    alerts: [
      {
        id: 'a1',
        type: 'expiry',
        message: "Amlodipine 5mg 2 din mein expire hogi",
        timeAgo: '2 ghante pehle',
        patientName: 'Ramesh Ji',
      },
      {
        id: 'a2',
        type: 'missed',
        message: 'Dopahar ki Metformin miss hui',
        timeAgo: '5 ghante pehle',
        patientName: 'Ramesh Ji',
      },
    ],
  },
];

export const RECENT_SCANS = [
  { id: 's1', name: 'Metformin 500mg', status: 'valid' as const, time: '10:32 AM' },
  { id: 's2', name: 'Paracetamol 500mg', status: 'warning' as const, time: '09:15 AM' },
  { id: 's3', name: 'Azithromycin 250mg', status: 'expired' as const, time: 'Kal 06:10 PM' },
];

export const DOSE_SCHEDULE: Record<'morning' | 'afternoon' | 'night', { label: string; time: string; taken: boolean }[]> = {
  morning: [
    { label: 'Metformin 500mg — 1 goli', time: '8:00 AM', taken: true },
  ],
  afternoon: [
    { label: 'Metformin 500mg — 1 goli', time: '1:00 PM', taken: false },
  ],
  night: [
    { label: 'Metformin 500mg — 1 goli', time: '9:00 PM', taken: false },
    { label: 'Amlodipine 5mg — 1 goli', time: '9:00 PM', taken: false },
    { label: 'Atorvastatin 10mg — 1 goli', time: '9:00 PM', taken: true },
  ],
};
