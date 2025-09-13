import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  author: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
  },
  publicUrl: {
    type: String,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  // Job-specific fields
  location: {
    type: String,
    default: '',
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time',
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    default: 'Mid Level',
  },
  salaryRange: {
    type: String,
    default: '',
  },
  requirements: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  applicationDeadline: {
    type: Date,
  },
  applicationCount: {
    type: Number,
    default: 0,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  department: {
    type: String,
    default: '',
  },
  remoteWork: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better performance
JobSchema.index({ status: 1, publishedDate: -1 });
JobSchema.index({ category: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ employmentType: 1 });

// Virtual for checking if application deadline has passed
JobSchema.virtual('isApplicationOpen').get(function () {
  if (this.status !== 'published') return false;
  if (!this.applicationDeadline) return true;
  return new Date() <= this.applicationDeadline;
});

// Method to increment application count
JobSchema.methods.incrementApplicationCount = function () {
  this.applicationCount = (this.applicationCount || 0) + 1;
  return this.save();
};

export default mongoose.models.Job || mongoose.model('Job', JobSchema);