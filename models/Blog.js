import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    author: {
        type: String,
        default: 'Admin'
    },
    publishedDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);