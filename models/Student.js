import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  parentName: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  pickupPoint: { type: String, required: true },
  busId: { type: String, required: true },
  status: { type: String, enum: ['in', 'out', 'absent', 'pending'], default: 'pending' },
  grade: { type: String, required: true },
  parentId: { type: String },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);