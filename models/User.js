import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please provide a valid email address'
        }
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        validate: {
            validator: function (mobile) {
                // Validates Indian mobile numbers (10 digits) with optional +91 prefix
                return /^(\+91|91)?[6-9]\d{9}$/.test(mobile.replace(/\s+/g, ''));
            },
            message: 'Please provide a valid mobile number'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function (password) {
                // Password must contain at least one uppercase, one lowercase, one number, and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role must be either user or admin'
        },
        default: 'user'
    },
    resetPasswordToken: {
        type: String,
        select: false // Don't include in queries by default for security
    },
    resetPasswordExpiry: {
        type: Date,
        select: false // Don't include in queries by default for security
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    accountLockedUntil: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
// Note: email already has unique: true which creates an index automatically
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ emailVerificationToken: 1 });

// Pre-save middleware to hash password and encrypt sensitive fields
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // Hash password
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate and encrypt reset token
UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    // Encrypt the token before saving to database
    const crypto = require('crypto');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken; // Return unencrypted token to send via email
};

// Method to verify reset token
UserSchema.methods.verifyPasswordResetToken = function (token) {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return this.resetPasswordToken === hashedToken &&
        this.resetPasswordExpiry > Date.now();
};

// Method to handle account locking
UserSchema.methods.incrementLoginAttempts = function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.accountLocked && this.accountLockedUntil < Date.now()) {
        return this.updateOne({
            $unset: {
                accountLocked: 1,
                accountLockedUntil: 1
            },
            $set: {
                loginAttempts: 1
            }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account after 5 failed attempts for 2 hours
    if (this.loginAttempts + 1 >= 5 && !this.accountLocked) {
        updates.$set = {
            accountLocked: true,
            accountLockedUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        };
    }

    return this.updateOne(updates);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiry;
        delete ret.emailVerificationToken;
        return ret;
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);