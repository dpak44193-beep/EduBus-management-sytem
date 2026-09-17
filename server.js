import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured before starting the API');
}

const users = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'admin', role: 'admin', phone: '9876543210' },
  { id: 'u2', name: 'Manoj Patel', email: 'driver1', role: 'driver', phone: '9876543211', driverId: 'd1', busId: 'b1' },
  { id: 'u3', name: 'Suresh Sharma', email: 'driver2', role: 'driver', phone: '9876543212', driverId: 'd2', busId: 'b2' },
  { id: 'u4', name: 'Kiran Reddy', email: 'driver3', role: 'driver', phone: '9876543213', driverId: 'd3', busId: 'b3' },
  { id: 'u5', name: 'Arun Kumar', email: 'student1', role: 'student', phone: '9876543214', studentId: 's1' },
  { id: 'u6', name: 'Priya Singh', email: 'student2', role: 'student', phone: '9876543215', studentId: 's2' },
  { id: 'u7', name: 'Sanjay Mehta (Parent)', email: 'parent1', role: 'parent', phone: '9876543216', studentId: 's1' },
  { id: 'u8', name: 'Anita Verma (Parent)', email: 'parent2', role: 'parent', phone: '9876543217', studentId: 's2' },
];

const seedCredentials = [
  { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, user: users[0] },
  { email: process.env.SEED_DRIVER_EMAIL, password: process.env.SEED_DRIVER_PASSWORD, user: users[1] },
  { email: process.env.SEED_STUDENT_EMAIL, password: process.env.SEED_STUDENT_PASSWORD, user: users[4] },
  { email: process.env.SEED_PARENT_EMAIL, password: process.env.SEED_PARENT_PASSWORD, user: users[6] },
];

const students = [
  { id: 's1', name: 'Arun Kumar', rollNumber: 'R001', email: 'arun@school.com', parentName: 'Sanjay Mehta', phone: '9812345001', address: '12, Gandhi Nagar, Chennai', pickupPoint: 'Gandhi Nagar Stop', busId: 'b1', status: 'in', lastPickup: '07:45 AM', lastDrop: '04:15 PM', grade: '10A', parentId: 'u7', initials: 'AK', color: '#3B82F6' },
  { id: 's2', name: 'Priya Singh', rollNumber: 'R002', email: 'priya@school.com', parentName: 'Anita Verma', phone: '9812345002', address: '45, Nehru Street, Chennai', pickupPoint: 'Nehru Street Stop', busId: 'b1', status: 'in', lastPickup: '07:48 AM', lastDrop: '04:18 PM', grade: '10B', parentId: 'u8', initials: 'PS', color: '#EC4899' },
  { id: 's3', name: 'Vikram Nair', rollNumber: 'R003', email: 'vikram@school.com', parentName: 'Mohan Nair', phone: '9812345003', address: '7, Patel Road, Chennai', pickupPoint: 'Patel Road Stop', busId: 'b1', status: 'out', lastPickup: '07:52 AM', lastDrop: '04:20 PM', grade: '9A', parentId: 'p3', initials: 'VN', color: '#8B5CF6' },
  { id: 's4', name: 'Kavitha Rajan', rollNumber: 'R004', email: 'kavitha@school.com', parentName: 'Rajan Kumar', phone: '9812345004', address: '23, MG Road, Chennai', pickupPoint: 'MG Road Stop', busId: 'b2', status: 'in', lastPickup: '07:40 AM', lastDrop: '04:10 PM', grade: '11A', parentId: 'p4', initials: 'KR', color: '#F59E0B' },
  { id: 's5', name: 'Deepak Sharma', rollNumber: 'R005', email: 'deepak@school.com', parentName: 'Ramesh Sharma', phone: '9812345005', address: '56, Anna Nagar, Chennai', pickupPoint: 'Anna Nagar Stop', busId: 'b2', status: 'in', lastPickup: '07:43 AM', lastDrop: '04:13 PM', grade: '11B', parentId: 'p5', initials: 'DS', color: '#10B981' },
  { id: 's6', name: 'Meena Krishnan', rollNumber: 'R006', email: 'meena@school.com', parentName: 'Krishnan Pillai', phone: '9812345006', address: '89, T Nagar, Chennai', pickupPoint: 'T Nagar Stop', busId: 'b2', status: 'absent', lastPickup: '--', lastDrop: '--', grade: '9B', parentId: 'p6', initials: 'MK', color: '#EF4444' },
  { id: 's7', name: 'Rahul Gupta', rollNumber: 'R007', email: 'rahul@school.com', parentName: 'Suresh Gupta', phone: '9812345007', address: '11, Park Street, Chennai', pickupPoint: 'Park Street Stop', busId: 'b3', status: 'in', lastPickup: '07:50 AM', lastDrop: '04:22 PM', grade: '12A', parentId: 'p7', initials: 'RG', color: '#06B6D4' },
  { id: 's8', name: 'Ananya Patel', rollNumber: 'R008', email: 'ananya@school.com', parentName: 'Dinesh Patel', phone: '9812345008', address: '34, Velachery Road, Chennai', pickupPoint: 'Velachery Stop', busId: 'b3', status: 'in', lastPickup: '07:55 AM', lastDrop: '04:25 PM', grade: '12B', parentId: 'p8', initials: 'AP', color: '#F97316' },
  { id: 's9', name: 'Suresh Iyer', rollNumber: 'R009', email: 'suresh@school.com', parentName: 'Iyer Raman', phone: '9812345009', address: '67, Besant Nagar, Chennai', pickupPoint: 'Besant Nagar Stop', busId: 'b3', status: 'out', lastPickup: '07:58 AM', lastDrop: '04:28 PM', grade: '8A', parentId: 'p9', initials: 'SI', color: '#84CC16' },
  { id: 's10', name: 'Lakshmi Devi', rollNumber: 'R010', email: 'lakshmi@school.com', parentName: 'Venkat Devi', phone: '9812345010', address: '90, Adyar, Chennai', pickupPoint: 'Adyar Stop', busId: 'b3', status: 'pending', lastPickup: '--', lastDrop: '--', grade: '8B', parentId: 'p10', initials: 'LD', color: '#A855F7' }
];

const drivers = [
  { id: 'd1', name: 'Manoj Patel', phone: '9876543211', email: 'manoj@bus.com', address: '5, Driver Colony, Chennai', busId: 'b1', status: 'on-route', license: 'TN01-20231001', experience: 8, initials: 'MP', color: '#3B82F6', rating: 4.8 },
  { id: 'd2', name: 'Suresh Sharma', phone: '9876543212', email: 'suresh@bus.com', address: '8, Transport Nagar, Chennai', busId: 'b2', status: 'on-route', license: 'TN01-20221205', experience: 12, initials: 'SS', color: '#10B981', rating: 4.6 },
  { id: 'd3', name: 'Kiran Reddy', phone: '9876543213', email: 'kiran@bus.com', address: '3, Bus Stand Road, Chennai', busId: 'b3', status: 'active', license: 'TN01-20200315', experience: 15, initials: 'KR', color: '#F59E0B', rating: 4.9 }
];

const buses = [
  { id: 'b1', busNumber: 'TN-01-AB-1234', capacity: 40, model: 'Tata Starbus', year: 2021, routeId: 'r1', driverId: 'd1', status: 'active', location: { x: 180, y: 130 }, speed: 32, fuel: 78 },
  { id: 'b2', busNumber: 'TN-01-CD-5678', capacity: 35, model: 'Ashok Leyland Lynx', year: 2020, routeId: 'r2', driverId: 'd2', status: 'active', location: { x: 600, y: 180 }, speed: 28, fuel: 65 },
  { id: 'b3', busNumber: 'TN-01-EF-9012', capacity: 45, model: 'Eicher Skyline', year: 2022, routeId: 'r3', driverId: 'd3', status: 'active', location: { x: 580, y: 370 }, speed: 35, fuel: 85 }
];

const routes = [
  { id: 'r1', name: 'Route A – North Zone', color: '#3B82F6', morningStart: '06:30 AM', afternoonStart: '04:00 PM', distance: 18.5, estimatedTime: 45, busId: 'b1', driverId: 'd1', waypoints: [{ x: 80, y: 80 }, { x: 160, y: 80 }, { x: 240, y: 90 }, { x: 320, y: 120 }, { x: 380, y: 160 }, { x: 400, y: 240 }], stops: [{ id: 'stop-a1', name: 'Gandhi Nagar Stop', time: '06:35 AM', coordinates: { x: 80, y: 80 }, studentIds: ['s1'] }, { id: 'stop-a2', name: 'Nehru Street Stop', time: '06:45 AM', coordinates: { x: 160, y: 80 }, studentIds: ['s2'] }, { id: 'stop-a3', name: 'Patel Road Stop', time: '06:55 AM', coordinates: { x: 240, y: 90 }, studentIds: ['s3'] }, { id: 'stop-a4', name: 'School Campus', time: '07:20 AM', coordinates: { x: 400, y: 240 }, studentIds: [] }] },
  { id: 'r2', name: 'Route B – East Zone', color: '#10B981', morningStart: '06:30 AM', afternoonStart: '04:00 PM', distance: 21.2, estimatedTime: 52, busId: 'b2', driverId: 'd2', waypoints: [{ x: 680, y: 80 }, { x: 700, y: 160 }, { x: 680, y: 240 }, { x: 580, y: 220 }, { x: 480, y: 230 }, { x: 400, y: 240 }], stops: [{ id: 'stop-b1', name: 'MG Road Stop', time: '06:35 AM', coordinates: { x: 680, y: 80 }, studentIds: ['s4'] }, { id: 'stop-b2', name: 'Anna Nagar Stop', time: '06:47 AM', coordinates: { x: 700, y: 160 }, studentIds: ['s5'] }, { id: 'stop-b3', name: 'T Nagar Stop', time: '06:58 AM', coordinates: { x: 680, y: 240 }, studentIds: ['s6'] }, { id: 'stop-b4', name: 'School Campus', time: '07:25 AM', coordinates: { x: 400, y: 240 }, studentIds: [] }] },
  { id: 'r3', name: 'Route C – South Zone', color: '#F59E0B', morningStart: '06:30 AM', afternoonStart: '04:00 PM', distance: 24.8, estimatedTime: 60, busId: 'b3', driverId: 'd3', waypoints: [{ x: 700, y: 400 }, { x: 580, y: 420 }, { x: 460, y: 400 }, { x: 340, y: 380 }, { x: 280, y: 320 }, { x: 360, y: 280 }, { x: 400, y: 240 }], stops: [{ id: 'stop-c1', name: 'Park Street Stop', time: '06:35 AM', coordinates: { x: 700, y: 400 }, studentIds: ['s7'] }, { id: 'stop-c2', name: 'Velachery Stop', time: '06:45 AM', coordinates: { x: 580, y: 420 }, studentIds: ['s8'] }, { id: 'stop-c3', name: 'Besant Nagar Stop', time: '06:56 AM', coordinates: { x: 340, y: 380 }, studentIds: ['s9'] }, { id: 'stop-c4', name: 'Adyar Stop', time: '07:05 AM', coordinates: { x: 280, y: 320 }, studentIds: ['s10'] }, { id: 'stop-c5', name: 'School Campus', time: '07:28 AM', coordinates: { x: 400, y: 240 }, studentIds: [] }] }
];

const attendanceRecords = [
  { id: 'a1', studentId: 's1', date: '2026-04-02', inTime: '07:45 AM', outTime: '04:15 PM', status: 'present', busId: 'b1' },
  { id: 'a2', studentId: 's2', date: '2026-04-02', inTime: '07:48 AM', outTime: '04:18 PM', status: 'present', busId: 'b1' },
  { id: 'a3', studentId: 's3', date: '2026-04-02', inTime: '07:52 AM', outTime: '04:20 PM', status: 'present', busId: 'b1' },
  { id: 'a4', studentId: 's4', date: '2026-04-02', inTime: '07:40 AM', outTime: '04:10 PM', status: 'present', busId: 'b2' },
  { id: 'a5', studentId: 's5', date: '2026-04-02', inTime: '07:43 AM', outTime: '04:13 PM', status: 'present', busId: 'b2' },
  { id: 'a6', studentId: 's6', date: '2026-04-02', inTime: '--', outTime: '--', status: 'absent', busId: 'b2' },
  { id: 'a7', studentId: 's7', date: '2026-04-02', inTime: '07:50 AM', outTime: '04:22 PM', status: 'present', busId: 'b3' },
  { id: 'a8', studentId: 's8', date: '2026-04-02', inTime: '07:55 AM', outTime: '04:25 PM', status: 'present', busId: 'b3' },
  { id: 'a9', studentId: 's9', date: '2026-04-02', inTime: '07:58 AM', outTime: '04:28 PM', status: 'present', busId: 'b3' },
  { id: 'a10', studentId: 's10', date: '2026-04-02', inTime: '--', outTime: '--', status: 'absent', busId: 'b3' }
];

const notifications = [
  { id: 'n1', type: 'pickup', message: 'Bus TN-01-AB-1234 has picked up Arun from Gandhi Nagar Stop.', timestamp: '07:45 AM', read: false, targetRoles: ['admin', 'student', 'parent'], studentId: 's1', priority: 'medium' },
  { id: 'n2', type: 'delay', message: 'Route B is running 8 minutes behind schedule due to traffic.', timestamp: '08:10 AM', read: false, targetRoles: ['admin', 'driver', 'parent'], priority: 'high' },
  { id: 'n3', type: 'alert', message: 'Priya has reached the drop-off point on time.', timestamp: '04:20 PM', read: true, targetRoles: ['parent', 'student'], studentId: 's2', priority: 'low' },
  { id: 'n4', type: 'emergency', message: 'Emergency alert received from bus TN-01-EF-9012. Driver is checking the issue.', timestamp: '03:14 PM', read: false, targetRoles: ['admin', 'driver'], priority: 'high' }
];

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '100kb' }));

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) return res.status(401).json({ success: false, error: 'Authentication required.' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired session.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'You do not have permission for this action.' });
    return next();
  };
}

app.get('/api/health', (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ok' : 'degraded', service: 'Campus Transit API', database: databaseReady ? 'connected' : 'disconnected' });
});

app.get('/api/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash');
  if (!user || !user.active) return res.status(401).json({ success: false, error: 'Account is unavailable.' });
  return res.json({ success: true, data: user });
});

app.patch('/api/me', authenticate, async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const phone = String(req.body?.phone ?? '').trim();

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ success: false, error: 'Name must be between 2 and 80 characters.' });
  }

  if (phone && !/^\+?[0-9 ()-]{7,20}$/.test(phone)) {
    return res.status(400).json({ success: false, error: 'Enter a valid phone number.' });
  }

  const user = await User.findByIdAndUpdate(req.user.sub, { name, phone }, { new: true, runValidators: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ success: false, error: 'Account not found.' });
  return res.json({ success: true, data: user });
});

app.get('/api/users', authenticate, requireRole('admin'), async (_req, res) => {
  const records = await User.find().select('-passwordHash').lean();
  return res.json({ success: true, data: records });
});

app.get('/api/students', authenticate, async (_req, res) => {
  return res.json({ success: true, data: students });
});

app.get('/api/drivers', authenticate, async (_req, res) => {
  return res.json({ success: true, data: drivers });
});

app.get('/api/buses', authenticate, async (_req, res) => {
  return res.json({ success: true, data: buses });
});

app.get('/api/routes', authenticate, async (_req, res) => {
  return res.json({ success: true, data: routes });
});

app.get('/api/attendance', authenticate, async (_req, res) => {
  return res.json({ success: true, data: attendanceRecords });
});

app.get('/api/notifications', authenticate, async (req, res) => {
  const filtered = notifications.filter((item) => item.targetRoles.includes(req.user.role));
  return res.json({ success: true, data: filtered });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = String(email ?? '').trim();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: normalizedEmail, active: true });

  if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials. Please try again.' });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  return res.json({ success: true, token, user: safeUser });
});

app.post('/api/auth/change-password', authenticate, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword ?? '');
  const newPassword = String(req.body?.newPassword ?? '');
  if (newPassword.length < 8 || newPassword.length > 128) {
    return res.status(400).json({ success: false, error: 'New password must be between 8 and 128 characters.' });
  }

  const user = await User.findById(req.user.sub);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return res.json({ success: true, message: 'Password updated successfully.' });
});

app.get('/', (_req, res) => {
  res.json({ app: 'Campus Transit API', status: 'running', endpoints: ['/api/health', '/api/auth/login', '/api/students', '/api/drivers', '/api/buses', '/api/routes', '/api/attendance'] });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled API error:', error.message);
  return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL);

  for (const credential of seedCredentials) {
    if (!credential.email || !credential.password) continue;
    const existing = await User.findOne({ email: credential.email });
    if (!existing) {
      await User.create({ ...credential.user, email: credential.email, passwordHash: await bcrypt.hash(credential.password, 12) });
    }
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});