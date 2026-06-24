import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: String,
  company: String,
  jobTitle: String,
  graduationYear: Number,
  skills: [String],
  bio: String,
  profileImage: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Alumni', alumniSchema);

