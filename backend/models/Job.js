import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  salary: String,
  description: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applyUrl: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);

