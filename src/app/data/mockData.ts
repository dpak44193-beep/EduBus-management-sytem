export type Role = 'admin' | 'driver' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  avatar?: string;
  studentId?: string;
  driverId?: string;
  busId?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  parentName: string;
  phone: string;
  address: string;
  pickupPoint: string;
  busId: string;
  status: 'in' | 'out' | 'absent' | 'pending';
  lastPickup: string;
  lastDrop: string;
  grade: string;
  parentId: string;
  initials: string;
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  busId: string;
  status: 'active' | 'inactive' | 'on-route';
  license: string;
  experience: number;
  initials: string;
  color: string;
  rating: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  capacity: number;
  model: string;
  year: number;
  routeId: string;
  driverId: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: { x: number; y: number };
  speed: number;
  fuel: number;
}

export interface Stop {
  id: string;
  name: string;
  time: string;
  coordinates: { x: number; y: number };
  studentIds: string[];
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  busId: string;
  driverId: string;
  morningStart: string;
  afternoonStart: string;
  distance: number;
  estimatedTime: number;
  waypoints: { x: number; y: number }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  inTime: string;
  outTime: string;
  status: 'present' | 'absent' | 'late';
  busId: string;
}

export interface Notification {
  id: string;
  type: 'pickup' | 'drop' | 'alert' | 'delay' | 'emergency' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
  targetRoles: Role[];
  studentId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface EmergencyAlert {
  id: string;
  driverId: string;
  driverName: string;
  message: string;
  timestamp: string;
  location: string;
  resolved: boolean;
  busId: string;
}

// ─── USERS ──────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'admin', password: 'admin123', role: 'admin', phone: '9876543210' },
  { id: 'u2', name: 'Manoj Patel', email: 'driver1', password: 'driver123', role: 'driver', phone: '9876543211', driverId: 'd1', busId: 'b1' },
  { id: 'u3', name: 'Suresh Sharma', email: 'driver2', password: 'driver123', role: 'driver', phone: '9876543212', driverId: 'd2', busId: 'b2' },
  { id: 'u4', name: 'Kiran Reddy', email: 'driver3', password: 'driver123', role: 'driver', phone: '9876543213', driverId: 'd3', busId: 'b3' },
  { id: 'u5', name: 'Arun Kumar', email: 'student1', password: 'student123', role: 'student', phone: '9876543214', studentId: 's1' },
  { id: 'u6', name: 'Priya Singh', email: 'student2', password: 'student123', role: 'student', phone: '9876543215', studentId: 's2' },
  { id: 'u7', name: 'Sanjay Mehta (Parent)', email: 'parent1', password: 'parent123', role: 'parent', phone: '9876543216', studentId: 's1' },
  { id: 'u8', name: 'Anita Verma (Parent)', email: 'parent2', password: 'parent123', role: 'parent', phone: '9876543217', studentId: 's2' },
];

// ─── STUDENTS ──────────────────────────────────────────────────────────────

export const students: Student[] = [
  { id: 's1', name: 'Arun Kumar', rollNumber: 'R001', email: 'arun@school.com', parentName: 'Sanjay Mehta', phone: '9812345001', address: '12, Gandhi Nagar, Chennai', pickupPoint: 'Gandhi Nagar Stop', busId: 'b1', status: 'in', lastPickup: '07:45 AM', lastDrop: '04:15 PM', grade: '10A', parentId: 'u7', initials: 'AK', color: '#3B82F6' },
  { id: 's2', name: 'Priya Singh', rollNumber: 'R002', email: 'priya@school.com', parentName: 'Anita Verma', phone: '9812345002', address: '45, Nehru Street, Chennai', pickupPoint: 'Nehru Street Stop', busId: 'b1', status: 'in', lastPickup: '07:48 AM', lastDrop: '04:18 PM', grade: '10B', parentId: 'u8', initials: 'PS', color: '#EC4899' },
  { id: 's3', name: 'Vikram Nair', rollNumber: 'R003', email: 'vikram@school.com', parentName: 'Mohan Nair', phone: '9812345003', address: '7, Patel Road, Chennai', pickupPoint: 'Patel Road Stop', busId: 'b1', status: 'out', lastPickup: '07:52 AM', lastDrop: '04:20 PM', grade: '9A', parentId: 'p3', initials: 'VN', color: '#8B5CF6' },
  { id: 's4', name: 'Kavitha Rajan', rollNumber: 'R004', email: 'kavitha@school.com', parentName: 'Rajan Kumar', phone: '9812345004', address: '23, MG Road, Chennai', pickupPoint: 'MG Road Stop', busId: 'b2', status: 'in', lastPickup: '07:40 AM', lastDrop: '04:10 PM', grade: '11A', parentId: 'p4', initials: 'KR', color: '#F59E0B' },
  { id: 's5', name: 'Deepak Sharma', rollNumber: 'R005', email: 'deepak@school.com', parentName: 'Ramesh Sharma', phone: '9812345005', address: '56, Anna Nagar, Chennai', pickupPoint: 'Anna Nagar Stop', busId: 'b2', status: 'in', lastPickup: '07:43 AM', lastDrop: '04:13 PM', grade: '11B', parentId: 'p5', initials: 'DS', color: '#10B981' },
  { id: 's6', name: 'Meena Krishnan', rollNumber: 'R006', email: 'meena@school.com', parentName: 'Krishnan Pillai', phone: '9812345006', address: '89, T Nagar, Chennai', pickupPoint: 'T Nagar Stop', busId: 'b2', status: 'absent', lastPickup: '--', lastDrop: '--', grade: '9B', parentId: 'p6', initials: 'MK', color: '#EF4444' },
  { id: 's7', name: 'Rahul Gupta', rollNumber: 'R007', email: 'rahul@school.com', parentName: 'Suresh Gupta', phone: '9812345007', address: '11, Park Street, Chennai', pickupPoint: 'Park Street Stop', busId: 'b3', status: 'in', lastPickup: '07:50 AM', lastDrop: '04:22 PM', grade: '12A', parentId: 'p7', initials: 'RG', color: '#06B6D4' },
  { id: 's8', name: 'Ananya Patel', rollNumber: 'R008', email: 'ananya@school.com', parentName: 'Dinesh Patel', phone: '9812345008', address: '34, Velachery Road, Chennai', pickupPoint: 'Velachery Stop', busId: 'b3', status: 'in', lastPickup: '07:55 AM', lastDrop: '04:25 PM', grade: '12B', parentId: 'p8', initials: 'AP', color: '#F97316' },
  { id: 's9', name: 'Suresh Iyer', rollNumber: 'R009', email: 'suresh@school.com', parentName: 'Iyer Raman', phone: '9812345009', address: '67, Besant Nagar, Chennai', pickupPoint: 'Besant Nagar Stop', busId: 'b3', status: 'out', lastPickup: '07:58 AM', lastDrop: '04:28 PM', grade: '8A', parentId: 'p9', initials: 'SI', color: '#84CC16' },
  { id: 's10', name: 'Lakshmi Devi', rollNumber: 'R010', email: 'lakshmi@school.com', parentName: 'Venkat Devi', phone: '9812345010', address: '90, Adyar, Chennai', pickupPoint: 'Adyar Stop', busId: 'b3', status: 'pending', lastPickup: '--', lastDrop: '--', grade: '8B', parentId: 'p10', initials: 'LD', color: '#A855F7' },
];

// ─── DRIVERS ──────────────────────────────────────────────────────────────

export const drivers: Driver[] = [
  { id: 'd1', name: 'Manoj Patel', phone: '9876543211', email: 'manoj@bus.com', address: '5, Driver Colony, Chennai', busId: 'b1', status: 'on-route', license: 'TN01-20231001', experience: 8, initials: 'MP', color: '#3B82F6', rating: 4.8 },
  { id: 'd2', name: 'Suresh Sharma', phone: '9876543212', email: 'suresh@bus.com', address: '8, Transport Nagar, Chennai', busId: 'b2', status: 'on-route', license: 'TN01-20221205', experience: 12, initials: 'SS', color: '#10B981', rating: 4.6 },
  { id: 'd3', name: 'Kiran Reddy', phone: '9876543213', email: 'kiran@bus.com', address: '3, Bus Stand Road, Chennai', busId: 'b3', status: 'active', license: 'TN01-20200315', experience: 15, initials: 'KR', color: '#F59E0B', rating: 4.9 },
];

// ─── BUSES ────────────────────────────────────────────────────────────────

export const buses: Bus[] = [
  { id: 'b1', busNumber: 'TN-01-AB-1234', capacity: 40, model: 'Tata Starbus', year: 2021, routeId: 'r1', driverId: 'd1', status: 'active', location: { x: 180, y: 130 }, speed: 32, fuel: 78 },
  { id: 'b2', busNumber: 'TN-01-CD-5678', capacity: 35, model: 'Ashok Leyland Lynx', year: 2020, routeId: 'r2', driverId: 'd2', status: 'active', location: { x: 600, y: 180 }, speed: 28, fuel: 65 },
  { id: 'b3', busNumber: 'TN-01-EF-9012', capacity: 45, model: 'Eicher Skyline', year: 2022, routeId: 'r3', driverId: 'd3', status: 'active', location: { x: 580, y: 370 }, speed: 35, fuel: 85 },
];

// ─── MAP WAYPOINTS ─────────────────────────────────────────────────────────
// SVG viewport: 800 x 480
// School is at (400, 240)

export const schoolLocation = { x: 400, y: 240 };

export const routes: Route[] = [
  {
    id: 'r1',
    name: 'Route A – North Zone',
    color: '#3B82F6',
    morningStart: '06:30 AM',
    afternoonStart: '04:00 PM',
    distance: 18.5,
    estimatedTime: 45,
    busId: 'b1',
    driverId: 'd1',
    waypoints: [
      { x: 80, y: 80 }, { x: 160, y: 80 }, { x: 240, y: 90 }, { x: 320, y: 120 },
      { x: 380, y: 160 }, { x: 400, y: 240 }
    ],
    stops: [
      { id: 'stop-a1', name: 'Gandhi Nagar Stop', time: '06:35 AM', coordinates: { x: 80, y: 80 }, studentIds: ['s1'] },
      { id: 'stop-a2', name: 'Nehru Street Stop', time: '06:45 AM', coordinates: { x: 160, y: 80 }, studentIds: ['s2'] },
      { id: 'stop-a3', name: 'Patel Road Stop', time: '06:55 AM', coordinates: { x: 240, y: 90 }, studentIds: ['s3'] },
      { id: 'stop-a4', name: 'School Campus', time: '07:20 AM', coordinates: { x: 400, y: 240 }, studentIds: [] },
    ]
  },
  {
    id: 'r2',
    name: 'Route B – East Zone',
    color: '#10B981',
    morningStart: '06:30 AM',
    afternoonStart: '04:00 PM',
    distance: 21.2,
    estimatedTime: 52,
    busId: 'b2',
    driverId: 'd2',
    waypoints: [
      { x: 680, y: 80 }, { x: 700, y: 160 }, { x: 680, y: 240 },
      { x: 580, y: 220 }, { x: 480, y: 230 }, { x: 400, y: 240 }
    ],
    stops: [
      { id: 'stop-b1', name: 'MG Road Stop', time: '06:35 AM', coordinates: { x: 680, y: 80 }, studentIds: ['s4'] },
      { id: 'stop-b2', name: 'Anna Nagar Stop', time: '06:47 AM', coordinates: { x: 700, y: 160 }, studentIds: ['s5'] },
      { id: 'stop-b3', name: 'T Nagar Stop', time: '06:58 AM', coordinates: { x: 680, y: 240 }, studentIds: ['s6'] },
      { id: 'stop-b4', name: 'School Campus', time: '07:25 AM', coordinates: { x: 400, y: 240 }, studentIds: [] },
    ]
  },
  {
    id: 'r3',
    name: 'Route C – South Zone',
    color: '#F59E0B',
    morningStart: '06:30 AM',
    afternoonStart: '04:00 PM',
    distance: 24.8,
    estimatedTime: 60,
    busId: 'b3',
    driverId: 'd3',
    waypoints: [
      { x: 700, y: 400 }, { x: 580, y: 420 }, { x: 460, y: 400 },
      { x: 340, y: 380 }, { x: 280, y: 320 }, { x: 360, y: 280 }, { x: 400, y: 240 }
    ],
    stops: [
      { id: 'stop-c1', name: 'Park Street Stop', time: '06:35 AM', coordinates: { x: 700, y: 400 }, studentIds: ['s7'] },
      { id: 'stop-c2', name: 'Velachery Stop', time: '06:45 AM', coordinates: { x: 580, y: 420 }, studentIds: ['s8'] },
      { id: 'stop-c3', name: 'Besant Nagar Stop', time: '06:56 AM', coordinates: { x: 340, y: 380 }, studentIds: ['s9'] },
      { id: 'stop-c4', name: 'Adyar Stop', time: '07:05 AM', coordinates: { x: 280, y: 320 }, studentIds: ['s10'] },
      { id: 'stop-c5', name: 'School Campus', time: '07:28 AM', coordinates: { x: 400, y: 240 }, studentIds: [] },
    ]
  }
];

// ─── ATTENDANCE ────────────────────────────────────────────────────────────

export const attendanceRecords: AttendanceRecord[] = [
  // Today
  { id: 'a1', studentId: 's1', date: '2026-04-02', inTime: '07:45 AM', outTime: '04:15 PM', status: 'present', busId: 'b1' },
  { id: 'a2', studentId: 's2', date: '2026-04-02', inTime: '07:48 AM', outTime: '04:18 PM', status: 'present', busId: 'b1' },
  { id: 'a3', studentId: 's3', date: '2026-04-02', inTime: '07:52 AM', outTime: '04:20 PM', status: 'present', busId: 'b1' },
  { id: 'a4', studentId: 's4', date: '2026-04-02', inTime: '07:40 AM', outTime: '04:10 PM', status: 'present', busId: 'b2' },
  { id: 'a5', studentId: 's5', date: '2026-04-02', inTime: '07:43 AM', outTime: '04:13 PM', status: 'present', busId: 'b2' },
  { id: 'a6', studentId: 's6', date: '2026-04-02', inTime: '--', outTime: '--', status: 'absent', busId: 'b2' },
  { id: 'a7', studentId: 's7', date: '2026-04-02', inTime: '07:50 AM', outTime: '04:22 PM', status: 'present', busId: 'b3' },
  { id: 'a8', studentId: 's8', date: '2026-04-02', inTime: '07:55 AM', outTime: '04:25 PM', status: 'present', busId: 'b3' },
  { id: 'a9', studentId: 's9', date: '2026-04-02', inTime: '07:58 AM', outTime: '04:28 PM', status: 'present', busId: 'b3' },
  { id: 'a10', studentId: 's10', date: '2026-04-02', inTime: '--', outTime: '--', status: 'absent', busId: 'b3' },
  // Yesterday
  { id: 'a11', studentId: 's1', date: '2026-04-01', inTime: '07:42 AM', outTime: '04:12 PM', status: 'present', busId: 'b1' },
  { id: 'a12', studentId: 's2', date: '2026-04-01', inTime: '07:46 AM', outTime: '04:16 PM', status: 'present', busId: 'b1' },
  { id: 'a13', studentId: 's3', date: '2026-04-01', inTime: '--', outTime: '--', status: 'absent', busId: 'b1' },
  { id: 'a14', studentId: 's4', date: '2026-04-01', inTime: '07:38 AM', outTime: '04:08 PM', status: 'present', busId: 'b2' },
  { id: 'a15', studentId: 's5', date: '2026-04-01', inTime: '07:50 AM', outTime: '04:20 PM', status: 'late', busId: 'b2' },
  { id: 'a16', studentId: 's6', date: '2026-04-01', inTime: '07:40 AM', outTime: '04:10 PM', status: 'present', busId: 'b2' },
  { id: 'a17', studentId: 's7', date: '2026-04-01', inTime: '07:48 AM', outTime: '04:18 PM', status: 'present', busId: 'b3' },
  { id: 'a18', studentId: 's8', date: '2026-04-01', inTime: '07:52 AM', outTime: '04:22 PM', status: 'present', busId: 'b3' },
  { id: 'a19', studentId: 's9', date: '2026-04-01', inTime: '07:56 AM', outTime: '04:26 PM', status: 'present', busId: 'b3' },
  { id: 'a20', studentId: 's10', date: '2026-04-01', inTime: '08:02 AM', outTime: '04:32 PM', status: 'late', busId: 'b3' },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'n1', type: 'pickup', message: 'Bus B1 (TN-01-AB-1234) has picked up Arun Kumar at Gandhi Nagar Stop', timestamp: '07:45 AM', read: false, targetRoles: ['admin', 'parent'], studentId: 's1', priority: 'medium' },
  { id: 'n2', type: 'pickup', message: 'Bus B1 (TN-01-AB-1234) has picked up Priya Singh at Nehru Street Stop', timestamp: '07:48 AM', read: false, targetRoles: ['admin', 'parent'], studentId: 's2', priority: 'medium' },
  { id: 'n3', type: 'alert', message: 'Bus B2 (TN-01-CD-5678) is running 5 minutes late on Route B', timestamp: '07:30 AM', read: true, targetRoles: ['admin', 'parent', 'student'], priority: 'high' },
  { id: 'n4', type: 'emergency', message: '🚨 Emergency Alert from Driver Kiran Reddy – Bus B3 near Velachery', timestamp: '06:55 AM', read: false, targetRoles: ['admin'], priority: 'high' },
  { id: 'n5', type: 'info', message: 'Route C schedule updated for tomorrow: 06:25 AM start', timestamp: '06:00 AM', read: true, targetRoles: ['admin', 'parent', 'student', 'driver'], priority: 'low' },
  { id: 'n6', type: 'drop', message: 'Vikram Nair has been dropped at Patel Road Stop', timestamp: '04:20 PM', read: false, targetRoles: ['parent'], studentId: 's3', priority: 'medium' },
  { id: 'n7', type: 'alert', message: 'Meena Krishnan marked absent for today', timestamp: '08:00 AM', read: false, targetRoles: ['admin', 'parent'], studentId: 's6', priority: 'medium' },
  { id: 'n8', type: 'pickup', message: 'Bus B3 approaching Besant Nagar Stop – estimated 3 minutes', timestamp: '06:53 AM', read: false, targetRoles: ['student', 'parent'], priority: 'high' },
];

// ─── EMERGENCY ALERTS ──────────────────────────────────────────────────────

export const emergencyAlerts: EmergencyAlert[] = [
  { id: 'e1', driverId: 'd3', driverName: 'Kiran Reddy', message: 'Tyre puncture near Velachery junction. Need assistance.', timestamp: '2026-04-02 06:55 AM', location: 'Velachery Junction, Chennai', resolved: false, busId: 'b3' },
  { id: 'e2', driverId: 'd1', driverName: 'Manoj Patel', message: 'Traffic jam on GST Road. Will be 10 mins late.', timestamp: '2026-04-01 07:30 AM', location: 'GST Road, Chennai', resolved: true, busId: 'b1' },
  { id: 'e3', driverId: 'd2', driverName: 'Suresh Sharma', message: 'Student left bag on bus. Returning to school.', timestamp: '2026-03-31 04:30 PM', location: 'Anna Nagar, Chennai', resolved: true, busId: 'b2' },
];

// ─── WEEKLY ANALYTICS DATA ─────────────────────────────────────────────────

export const weeklyAttendance = [
  { day: 'Mon', present: 9, absent: 1, late: 0 },
  { day: 'Tue', present: 8, absent: 1, late: 1 },
  { day: 'Wed', present: 10, absent: 0, late: 0 },
  { day: 'Thu', present: 7, absent: 2, late: 1 },
  { day: 'Fri', present: 9, absent: 1, late: 0 },
  { day: 'Sat', present: 6, absent: 4, late: 0 },
  { day: 'Today', present: 8, absent: 2, late: 0 },
];

export const monthlyTrend = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 88 },
  { month: 'Mar', attendance: 95 },
  { month: 'Apr', attendance: 91 },
];

export const busOccupancy = [
  { name: 'Bus B1 (Route A)', value: 3, color: '#3B82F6' },
  { name: 'Bus B2 (Route B)', value: 3, color: '#10B981' },
  { name: 'Bus B3 (Route C)', value: 4, color: '#F59E0B' },
];

export const routePerformance = [
  { route: 'Route A', onTime: 22, delayed: 3 },
  { route: 'Route B', onTime: 18, delayed: 7 },
  { route: 'Route C', onTime: 24, delayed: 1 },
];

export const getStudentsByBus = (busId: string) =>
  students.filter(s => s.busId === busId);

export const getDriverByBus = (busId: string) =>
  drivers.find(d => d.busId === busId);

export const getRouteByBus = (busId: string) =>
  routes.find(r => r.busId === busId);

export const getStudentById = (id: string) =>
  students.find(s => s.id === id);

export const getDriverById = (id: string) =>
  drivers.find(d => d.id === id);

export const getBusById = (id: string) =>
  buses.find(b => b.id === id);
