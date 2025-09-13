import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    name: {
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
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'completed', 'closed'],
        default: 'new',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    assignedTo: {
        type: String,
        trim: true,
    },
    response: {
        type: String,
    },
    responseDate: {
        type: Date,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    source: {
        type: String,
        enum: ['website', 'email', 'phone', 'social', 'referral', 'other'],
        default: 'website',
    },
    notes: [{
        note: String,
        addedBy: String,
        addedAt: {
            type: Date,
            default: Date.now,
        }
    }],
    followUpDate: {
        type: Date,
    },
    lastContactedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Index for better query performance
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ email: 1 });
InquirySchema.index({ assignedTo: 1 });

// Virtual for inquiry age
InquirySchema.virtual('ageInDays').get(function () {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update status with timestamp
InquirySchema.methods.updateStatus = function (newStatus, updatedBy = 'system') {
    this.status = newStatus;
    this.lastContactedAt = new Date();

    // Add note about status change
    this.notes.push({
        note: `Status changed from ${this.status} to ${newStatus}`,
        addedBy: updatedBy,
        addedAt: new Date(),
    });

    return this.save();
};

// Method to add response
InquirySchema.methods.addResponse = function (responseText, respondedBy = 'admin') {
    this.response = responseText;
    this.responseDate = new Date();
    this.status = 'completed';
    this.lastContactedAt = new Date();

    // Add note about response
    this.notes.push({
        note: `Response sent by ${respondedBy}`,
        addedBy: respondedBy,
        addedAt: new Date(),
    });

    return this.save();
};

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);