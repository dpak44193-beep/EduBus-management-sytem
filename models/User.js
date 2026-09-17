import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'driver', 'student', 'parent'], required: true },
  phone: { type: String, default: '' },
  driverId: { type: String },
  studentId: { type: String },
  busId: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);