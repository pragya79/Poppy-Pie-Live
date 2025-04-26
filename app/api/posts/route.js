import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory store initialized with mock data
let blogPosts = [
    {
        id: "POST-001",
        title: "Digital Marketing Trends for 2025",
        slug: "digital-marketing-trends-2025",
        excerpt: "Discover the emerging digital marketing trends that will shape your strategy in 2025.",
        content: "# Digital Marketing Trends for 2025\n\nThe digital marketing landscape continues to evolve at a rapid pace. As we move into 2025, businesses need to adapt their strategies to stay competitive and effectively reach their target audiences.\n\n## 1. AI-Powered Personalization\n\nArtificial intelligence is revolutionizing how marketers personalize content and offers. In 2025, we'll see even more sophisticated AI tools that can analyze vast amounts of customer data to create hyper-personalized experiences.\n\n## 2. Voice Search Optimization\n\nWith the growing popularity of smart speakers and voice assistants, optimizing for voice search will be essential. This means focusing on natural language queries and creating content that directly answers specific questions.\n\n## 3. Immersive AR/VR Experiences\n\nAugmented reality (AR) and virtual reality (VR) are moving beyond gaming and entertainment into marketing. Brands that create immersive experiences will stand out and drive higher engagement.\n\n## 4. Sustainability Marketing\n\nConsumers are increasingly concerned about environmental issues, leading to the rise of sustainability marketing. Brands that authentically communicate their environmental initiatives will connect more deeply with conscious consumers.\n\n## 5. Privacy-First Marketing\n\nAs privacy regulations tighten and third-party cookies phase out, marketers need to develop strategies that respect user privacy while still delivering personalized experiences through first-party data.\n\n## Conclusion\n\nStaying ahead of these trends will help your business navigate the evolving digital landscape and maintain a competitive edge in 2025 and beyond.",
        featuredImage: "/images/blog1.jpg",
        category: "Digital Marketing",
        tags: ["AI", "Voice Search", "AR/VR", "Sustainability", "Privacy"],
        author: "Admin",
        publishedDate: "2025-04-01T10:30:00",
        status: "published",
        views: 428
    },
    // ... (include other mock posts as needed, truncated for brevity)
    {
        id: "POST-005",
        title: "Email Marketing Best Practices for 2025",
        slug: "email-marketing-best-practices-2025",
        excerpt: "Stay ahead of the curve with these cutting-edge email marketing strategies for 2025 and beyond.",
        content: "# Email Marketing Best Practices for 2025\n\n*Draft content in progress...*",
        featuredImage: "/images/blog5.jpg",
        category: "Email Marketing",
        tags: ["Email Automation", "Personalization", "Deliverability"],
        author: "Admin",
        publishedDate: null,
        status: "draft",
        views: 0
    }
];

export async function GET(request) {
    return NextResponse.json(blogPosts);
}

export async function POST(request) {
    const { title, slug, excerpt, content, featuredImage, category, tags, status, author } = await request.json();

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = {
        id: `POST-${uuidv4().slice(0, 3).toUpperCase()}`,
        title,
        slug,
        excerpt,
        content,
        featuredImage: featuredImage || '',
        category,
        tags: tags || [],
        author: author || 'Admin',
        publishedDate: status === 'published' ? new Date().toISOString() : null,
        status,
        views: 0
    };

    blogPosts.unshift(newPost);
    return NextResponse.json(newPost, { status: 201 });
}