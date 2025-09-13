import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    applicantName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    resume: {
        url: String,
        publicId: String,
        filename: String,
    },
    coverLetter: {
        type: String,
        trim: true,
    },
    portfolio: {
        type: String,
        trim: true,
    },
    linkedinProfile: {
        type: String,
        trim: true,
    },
    experience: {
        type: String,
        enum: ['fresher', '1-2', '2-5', '5-10', '10+'],
        required: true,
    },
    expectedSalary: {
        type: String,
        trim: true,
    },
    availableFrom: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['applied', 'screening', 'interview', 'selected', 'rejected', 'withdrawn'],
        default: 'applied',
    },
    notes: [{
        note: String,
        addedBy: String,
        addedAt: {
            type: Date,
            default: Date.now,
        }
    }],
    interviewScheduled: {
        date: Date,
        time: String,
        mode: {
            type: String,
            enum: ['in-person', 'phone', 'video', 'online-test']
        },
        location: String,
        interviewer: String,
    },
    skills: [{
        type: String,
        trim: true,
    }],
    source: {
        type: String,
        enum: ['website', 'linkedin', 'referral', 'job-board', 'email', 'other'],
        default: 'website',
    },
}, {
    timestamps: true,
});

// Indexes for better query performance
JobApplicationSchema.index({ jobId: 1, createdAt: -1 });
JobApplicationSchema.index({ email: 1 });
JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ applicantName: 1 });

// Virtual for application age
JobApplicationSchema.virtual('ageInDays').get(function () {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update status
JobApplicationSchema.methods.updateStatus = function (newStatus, updatedBy = 'system', note = null) {
    this.status = newStatus;

    if (note) {
        this.notes.push({
            note: note || `Status changed to ${newStatus}`,
            addedBy: updatedBy,
            addedAt: new Date(),
        });
    }

    return this.save();
};

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);