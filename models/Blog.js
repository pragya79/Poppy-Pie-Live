import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        minlength: [10, 'Title must be at least 10 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
        validate: {
            validator: function (title) {
                // Title should not be just numbers or special characters
                return /[a-zA-Z]/.test(title);
            },
            message: 'Title must contain at least some letters'
        }
    },
    slug: {
        type: String,
        required: [true, 'Blog slug is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (slug) {
                // Slug should only contain lowercase letters, numbers, and hyphens
                return /^[a-z0-9-]+$/.test(slug);
            },
            message: 'Slug can only contain lowercase letters, numbers, and hyphens'
        },
        maxlength: [100, 'Slug cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
        minlength: [100, 'Content must be at least 100 characters'],
        maxlength: [50000, 'Content cannot exceed 50,000 characters'],
        validate: {
            validator: function (content) {
                // Remove HTML tags and check if there's actual text content
                const textContent = content.replace(/<[^>]*>/g, '').trim();
                return textContent.length >= 50;
            },
            message: 'Content must have at least 50 characters of actual text (excluding HTML tags)'
        }
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters'],
        validate: {
            validator: function (excerpt) {
                if (!excerpt) return true; // Optional field
                return excerpt.length >= 20;
            },
            message: 'Excerpt must be at least 20 characters if provided'
        }
    },
    featuredImage: {
        type: String,
        default: '',
        validate: {
            validator: function (url) {
                if (!url) return true; // Optional field
                // Basic URL validation for image
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
                    /^\/[^\/].*\.(jpg|jpeg|png|gif|webp)$/i.test(url);
            },
            message: 'Featured image must be a valid image URL or path'
        }
    },
    category: {
        type: String,
        required: [true, 'Blog category is required'],
        trim: true,
        enum: {
            values: [
                'Digital Marketing',
                'Content Marketing',
                'Social Media',
                'Sales Strategies',
                'SEO',
                'Branding',
                'Analytics',
                'General'
            ],
            message: 'Category must be one of the predefined categories'
        }
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (tag) {
                return tag.length >= 2 && tag.length <= 30;
            },
            message: 'Each tag must be between 2 and 30 characters'
        }
    }],
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        minlength: [2, 'Author name must be at least 2 characters'],
        maxlength: [100, 'Author name cannot exceed 100 characters'],
        default: 'Admin'
    },
    publishedDate: {
        type: Date,
        default: null,
        validate: {
            validator: function (date) {
                if (!date) return true; // Can be null for drafts
                return date <= new Date(); // Cannot be future dated
            },
            message: 'Published date cannot be in the future'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: 'Status must be draft, published, or archived'
        },
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Views must be a whole number'
        }
    },
    readingTime: {
        type: Number,
        min: [1, 'Reading time must be at least 1 minute'],
        max: [60, 'Reading time cannot exceed 60 minutes']
    },
    featured: {
        type: Boolean,
        default: false
    },
    seoTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    seoDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'SEO description cannot exceed 160 characters']
    }
}, {
    timestamps: true
});

// Indexes for better query performance
// Note: slug already has unique: true which creates an index automatically
blogSchema.index({ status: 1, publishedDate: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1, status: 1 });

// Pre-save middleware to calculate reading time
blogSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        // Calculate reading time based on content (average reading speed: 200 words per minute)
        const textContent = this.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        const wordCount = textContent.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / 200);
    }
    next();
});

// Pre-save middleware to auto-generate excerpt if not provided
blogSchema.pre('save', function (next) {
    if (!this.excerpt && this.content) {
        // Generate excerpt from content (first 200 characters of text)
        const textContent = this.content.replace(/<[^>]*>/g, '').trim();
        this.excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
    }
    next();
});

// Pre-save middleware to auto-generate slug if not provided
blogSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
    }
    next();
});

// Virtual for URL
blogSchema.virtual('url').get(function () {
    return `/blogs/${this.slug}`;
});

// Method to increment views
blogSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Static method to get published posts
blogSchema.statics.getPublished = function (options = {}) {
    const { limit = 10, skip = 0, category, featured } = options;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured;

    return this.find(query)
        .sort({ publishedDate: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
};

// Static method to get popular posts
blogSchema.statics.getPopular = function (limit = 5) {
    return this.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(limit)
        .lean();
};

// Ensure virtual fields are serialized
blogSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);