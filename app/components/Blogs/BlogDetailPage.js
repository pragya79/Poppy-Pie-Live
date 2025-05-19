'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Calendar, Tag, ArrowLeft, Share2, Bookmark, MessageSquare, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for blog posts - in a real app, this would be fetched from an API
const mockBlogPosts = [
    {
        id: 1,
        title: 'Digital Marketing Trends for 2025',
        slug: 'digital-marketing-trends-2025',
        image: '/placeholder.svg',
        featuredImage: '/placeholder.svg',
        excerpt: 'Discover the emerging digital marketing trends that will shape your strategy in 2025.',
        date: 'March 15, 2025',
        readTime: '5 min read',
        category: 'Digital Marketing',
        author: 'Admin',
        tags: ['AI', 'Voice Search', 'AR/VR', 'Sustainability', 'Privacy'],
        content: `
# Digital Marketing Trends for 2025

The digital marketing landscape continues to evolve at a rapid pace. As we move into 2025, businesses need to adapt their strategies to stay competitive and effectively reach their target audiences.

## 1. AI-Powered Personalization

Artificial intelligence is revolutionizing how marketers personalize content and offers. In 2025, we'll see even more sophisticated AI tools that can analyze vast amounts of customer data to create hyper-personalized experiences.

These tools will not only predict what customers might want to buy next but also determine the ideal time, channel, and messaging to reach them. The result will be marketing that feels less like promotion and more like helpful service.

## 2. Voice Search Optimization

With the growing popularity of smart speakers and voice assistants, optimizing for voice search will be essential. This means focusing on natural language queries and creating content that directly answers specific questions.

Marketers need to understand how people talk, not just how they type. Voice searches tend to be longer and more conversational, often phrased as questions. Content should be structured to provide clear, concise answers to these queries.

## 3. Immersive AR/VR Experiences

Augmented reality (AR) and virtual reality (VR) are moving beyond gaming and entertainment into marketing. Brands that create immersive experiences will stand out and drive higher engagement.

From virtual product trials to immersive brand storytelling, AR/VR offers unprecedented ways to connect with audiences. As the technology becomes more accessible, we'll see smaller brands adopting these tools as well.

## 4. Sustainability Marketing

Consumers are increasingly concerned about environmental issues, leading to the rise of sustainability marketing. Brands that authentically communicate their environmental initiatives will connect more deeply with conscious consumers.

However, authenticity is key. Greenwashing will backfire, so brands must ensure their sustainability claims are backed by real action and transparency.

## 5. Privacy-First Marketing

As privacy regulations tighten and third-party cookies phase out, marketers need to develop strategies that respect user privacy while still delivering personalized experiences through first-party data.

Building trust will become a central marketing goal, with transparent data practices and clear value exchanges becoming essential for collecting the data needed for effective marketing.

## Conclusion

Staying ahead of these trends will help your business navigate the evolving digital landscape and maintain a competitive edge in 2025 and beyond. The most successful marketers will be those who can balance innovation with authenticity, leveraging new technologies while maintaining a human touch in their customer interactions.
`,
        views: 428
    },
    {
        id: 2,
        title: 'How to Build a Strong Brand Identity',
        slug: 'build-strong-brand-identity',
        image: '/placeholder.svg',
        featuredImage: '/placeholder.svg',
        excerpt: 'Learn how to create a cohesive and compelling brand identity that resonates with your target audience.',
        date: 'March 12, 2025',
        readTime: '7 min read',
        category: 'Branding',
        author: 'Admin',
        tags: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines', 'Brand Voice'],
        content: `
# How to Build a Strong Brand Identity

A strong brand identity is crucial for standing out in today's crowded marketplace. It helps establish recognition, build trust, and create emotional connections with your audience.

## Understanding Brand Identity

Brand identity encompasses the visible elements of a brand, such as color, design, and logo, that identify and distinguish it in consumers' minds. It's the tangible expression of your brand's personality, values, and promise.

## Key Elements of Brand Identity

### 1. Brand Purpose and Values

Clearly define why your brand exists beyond making money. What impact do you want to have? What values drive your business decisions?

Your purpose and values should be authentic, resonant with your target audience, and consistently reflected in everything you do. They form the foundation upon which all other brand elements are built.

### 2. Brand Personality

Is your brand serious or playful? Luxurious or accessible? Define the human characteristics that describe your brand's tone and style.

Think of your brand as a person - how would they talk, act, and dress? This personality should be consistent across all touchpoints to create a coherent brand experience.

### 3. Visual Identity

Develop a cohesive visual system including your logo, color palette, typography, imagery style, and design elements.

Your visual identity should be distinctive, appropriate for your industry, versatile enough to work across all applications, and designed to stand the test of time.

### 4. Voice and Messaging

Establish how your brand communicates across platforms, from the words you use to the tone you adopt.

Your brand voice could be friendly, authoritative, inspirational, or technical, but it should always align with your brand personality and resonate with your audience.

## Steps to Create a Strong Brand Identity

1. **Research your audience**: Understand their preferences, needs, and values
2. **Analyze competitors**: Identify how to differentiate your brand
3. **Define your unique value proposition**: What makes your offering special?
4. **Develop your visual identity**: Create logos, select colors, and define design principles
5. **Establish brand guidelines**: Document rules for consistent application
6. **Implement consistently**: Apply your identity across all touchpoints

## Maintaining Brand Consistency

Consistency is key to building recognition and trust. Create comprehensive brand guidelines and ensure everyone representing your brand understands and follows them.

Regular brand audits can help identify inconsistencies and opportunities for improvement.

## Evolving Your Brand

Strong brands evolve over time while maintaining their core identity. Regularly review your brand identity and make thoughtful updates to stay relevant without losing recognition.

## Conclusion

Building a strong brand identity requires strategic thinking, creativity, and consistency. When done right, it becomes a powerful asset that drives business growth and creates lasting customer relationships.
`,
        views: 356
    },
    {
        id: 3,
        title: 'The Power of Content Marketing',
        slug: 'power-of-content-marketing',
        image: '/placeholder.svg',
        featuredImage: '/placeholder.svg',
        excerpt: 'Explore how content marketing can drive traffic, build authority, and convert prospects into customers.',
        date: 'March 10, 2025',
        readTime: '6 min read',
        category: 'Content Marketing',
        author: 'Admin',
        tags: ['Content Strategy', 'SEO', 'Lead Generation', 'Audience Engagement'],
        content: `
# The Power of Content Marketing

Content marketing has become a cornerstone of modern marketing strategies. By creating and distributing valuable, relevant content, businesses can attract and engage a clearly defined audience, ultimately driving profitable customer action.

## Why Content Marketing Works

Unlike traditional advertising that interrupts consumers, content marketing provides value before asking for anything in return. This builds trust, establishes authority, and creates a positive brand association.

By focusing on addressing customer needs and pain points rather than pushing products, content marketing aligns with how modern consumers prefer to make purchasing decisions - through research and self-education.

## Key Benefits of Content Marketing

### 1. Builds Brand Awareness and Recognition

Consistent, high-quality content helps more people become familiar with your brand. The more value you provide, the more likely your audience will remember you when they're ready to make a purchase.

Content gives you multiple touchpoints with potential customers throughout their journey, keeping your brand top-of-mind.

### 2. Establishes Authority and Expertise

Thoughtful, informative content demonstrates your knowledge and positions your brand as an authority in your industry.

When consumers view you as a trusted source of information, they're more likely to trust your products or services as well.

### 3. Supports Search Engine Optimization

Quality content that addresses topics your audience searches for improves your search engine rankings, driving organic traffic to your website.

Each piece of content represents an opportunity to rank for relevant keywords, expanding your digital footprint.

### 4. Nurtures Relationships Throughout the Customer Journey

From awareness to consideration to decision, the right content helps move prospects through your sales funnel.

Educational content works for early-stage prospects, while more detailed product-focused content serves those closer to purchase.

### 5. Generates Qualified Leads

Content tailored to your ideal customer attracts more qualified prospects to your business.

Strategic use of lead magnets - valuable content offered in exchange for contact information - helps convert visitors into leads.

## Creating an Effective Content Marketing Strategy

1. **Define clear objectives**: What do you want your content to achieve?
2. **Understand your audience**: Create detailed buyer personas to guide content creation
3. **Audit existing content**: Evaluate what's working and identify gaps
4. **Plan your content calendar**: Organize topics, formats, and publishing schedule
5. **Create compelling content**: Focus on quality, relevance, and value
6. **Distribute strategically**: Share across appropriate channels
7. **Measure and optimize**: Track performance against objectives

## Content Formats to Consider

- Blog posts and articles
- Ebooks and whitepapers
- Infographics and visual content
- Videos and webinars
- Podcasts
- Case studies and testimonials
- Email newsletters
- Social media content

## Conclusion

Content marketing is no longer optional for businesses looking to thrive in the digital landscape. By consistently providing valuable content that addresses your audience's needs and challenges, you can build lasting relationships that drive sustainable business growth.
`,
        views: 279
    },
    {
        id: 4,
        title: 'Social Media Strategies for B2B Companies',
        slug: 'social-media-strategies-b2b',
        image: '/placeholder.svg',
        featuredImage: '/placeholder.svg',
        excerpt: 'Discover effective social media approaches specifically designed for B2B audience engagement and lead generation.',
        date: 'March 5, 2025',
        readTime: '8 min read',
        category: 'Social Media',
        author: 'Admin',
        tags: ['LinkedIn', 'B2B Marketing', 'Thought Leadership', 'Lead Generation'],
        content: `
# Social Media Strategies for B2B Companies

While social media is often associated with B2C marketing, it offers tremendous opportunities for B2B companies when approached strategically. This guide explores how B2B organizations can leverage social platforms to build relationships, establish thought leadership, and generate quality leads.

## LinkedIn: The B2B Powerhouse

LinkedIn remains the most important social platform for B2B marketers. Strategies for maximizing LinkedIn include:

- Optimizing company pages with complete information
- Sharing industry insights and thought leadership content
- Leveraging employee advocacy for wider reach
- Using LinkedIn Groups to establish expertise
- Implementing targeted advertising campaigns

The platform's professional focus and robust targeting capabilities make it uniquely valuable for B2B relationship building and lead generation.

## Other Valuable Platforms for B2B

### Twitter
- Engage in industry conversations using relevant hashtags
- Share timely updates and news
- Participate in Twitter chats relevant to your industry

Twitter's real-time nature makes it excellent for demonstrating industry expertise and engaging with current topics.

### YouTube
- Create educational content showcasing your expertise
- Develop case studies and client testimonials
- Produce product demonstrations and tutorials

Video content helps humanize your brand and explain complex B2B solutions in an accessible way.

### Facebook and Instagram
- Showcase company culture and values
- Highlight team members and behind-the-scenes content
- Share event updates and industry conference participation

These platforms help show the human side of your business, which is increasingly important even in B2B relationships.

## Content Strategies for B2B Social Media

1. **Educational Content**: Provide valuable insights that help your audience solve problems
2. **Case Studies**: Demonstrate real-world applications and results
3. **Industry Research and Reports**: Position your company as a knowledge leader
4. **Employee Spotlights**: Humanize your brand and showcase expertise
5. **Event Content**: Promote participation in and insights from industry events

The key is creating content that demonstrates your expertise while providing genuine value to your audience.

## Measuring B2B Social Media Success

Track these metrics to evaluate your B2B social media effectiveness:

- Website traffic from social channels
- Lead generation and conversion rates
- Engagement metrics (shares, comments, saves)
- Follower growth and quality
- Share of voice compared to competitors

Focus on metrics that align with your business objectives rather than vanity metrics.

## Common B2B Social Media Challenges and Solutions

### Challenge: Long Sales Cycles
**Solution**: Use social media for ongoing nurturing and relationship building through multiple touchpoints

### Challenge: Multiple Decision Makers
**Solution**: Create content tailored to different stakeholders and their specific concerns

### Challenge: Measuring ROI
**Solution**: Implement proper tracking from social engagement through to closed deals

## Conclusion

Effective B2B social media marketing requires strategic thinking, consistent execution, and patience. By focusing on providing value to your professional audience and building meaningful relationships, B2B companies can achieve significant results through social channels.
`,
        views: 0
    },
    {
        id: 5,
        title: 'Email Marketing Best Practices for 2025',
        slug: 'email-marketing-best-practices-2025',
        image: '/placeholder.svg',
        featuredImage: '/placeholder.svg',
        excerpt: 'Stay ahead of the curve with these cutting-edge email marketing strategies for 2025 and beyond.',
        date: 'March 1, 2025',
        readTime: '6 min read',
        category: 'Email Marketing',
        author: 'Admin',
        tags: ['Email Automation', 'Personalization', 'Deliverability'],
        content: `
# Email Marketing Best Practices for 2025

Despite the constant emergence of new marketing channels, email marketing remains one of the most effective tools for generating leads, nurturing relationships, and driving conversions. As we move into 2025, several key trends and best practices will define successful email marketing strategies.

## 1. Hyper-Personalization Beyond Name Tags

Basic personalization is no longer enough. In 2025, successful email marketing will leverage AI and machine learning to create truly personalized experiences:

- Dynamic content based on past purchases, browsing behavior, and preferences
- Predictive product recommendations that anticipate needs
- Personalized send times optimized for individual open rates
- Content adapted to the recipient's position in the customer journey

The goal is to make each email feel like it was created specifically for the individual recipient.

## 2. Interactive Email Experiences

Static emails are giving way to interactive experiences that engage recipients directly within their inbox:

- Polls and surveys that can be completed without leaving the email
- Product carousels that allow browsing multiple items
- Interactive calculators and configurators
- "Add to cart" functionality embedded in emails
- Gamified elements that boost engagement

These interactive elements not only improve engagement but also collect valuable data on recipient preferences.

## 3. Privacy-Centric Approaches

With increasing privacy regulations and the deprecation of tracking pixels, successful email marketers in 2025 are adopting privacy-centric approaches:

- Transparent data collection practices
- Clear value exchanges for subscriber data
- Zero-party data strategies (information directly shared by customers)
- Alternative measurement frameworks that respect privacy while providing insights

Brands that prioritize trust and transparency will outperform those relying on increasingly restricted tracking methods.

## 4. AI-Optimized Content and Copy

AI tools are transforming how email content is created and optimized:

- AI-generated subject lines with high open-rate potential
- Content tailored to individual preferences and reading patterns
- Sentiment analysis to refine messaging tone and style
- Automated A/B testing that continuously improves performance

The most successful email marketers will use AI as a collaborative tool to enhance human creativity rather than replace it.

## 5. Omnichannel Integration

Email no longer exists in isolation. In 2025, email marketing is deeply integrated with other channels:

- Coordinated messaging across email, SMS, push notifications, and social
- Cross-channel journey mapping to provide consistent experiences
- Unified data from multiple touchpoints informing email strategy
- Seamless transitions between channels based on user preferences

This integration ensures consistent messaging and optimized customer experiences regardless of how customers interact with your brand.

## 6. Accessibility as a Priority

Inclusive design is no longer optional. Email marketers in 2025 prioritize accessibility:

- Screen reader-friendly content structures
- Sufficient color contrast for visually impaired readers
- Alternative text for images
- Keyboard-navigable interactive elements
- Simple, clear layouts that work for all users

Making emails accessible doesn't just serve those with disabilities—it generally improves the experience for all recipients.

## Conclusion

As we navigate 2025, email marketing continues to evolve while remaining a cornerstone of effective digital marketing strategy. By embracing these best practices—hyper-personalization, interactivity, privacy-centricity, AI optimization, omnichannel integration, and accessibility—marketers can ensure their email programs drive meaningful results in an increasingly complex landscape.

The most successful email marketing programs will be those that balance innovation with the fundamental principles of providing value, respecting user preferences, and building meaningful relationships with subscribers.
`,
        views: 0
    }
];

const BlogDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Fetch blog post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);

                // In a real app, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request

                // Find post by ID
                const blogPost = mockBlogPosts.find(post => post.id === parseInt(params.id));

                if (!blogPost) {
                    throw new Error("Blog post not found");
                }

                setPost(blogPost);
            } catch (err) {
                console.error("Failed to fetch post:", err);
                setError(err.message || "Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        } else {
            setError("No blog ID provided");
            setLoading(false);
        }
    }, [params.id]);

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setScrollProgress(scrollPercent);
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Renders markdown content with basic formatting
    const renderMarkdownContent = (content) => {
        return { __html: content };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/blogs')}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Back to Blogs
                </button>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Reading progress bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Back to top button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg z-50"
                    onClick={scrollToTop}
                >
                    <ChevronUp className="h-5 w-5" />
                </motion.button>
            )}

            {/* Article header */}
            <header className="relative w-full bg-gray-900 text-white">
                <div className="absolute inset-0 opacity-50">
                    {post.featuredImage && (
                        <div className="relative w-full h-full">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                        </div>
                    )}
                </div>
                <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-sm sm:text-base text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blogs
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                            <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4">
                                <span className="flex items-center mr-4 mb-2">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {post.date}
                                </span>
                                <span className="flex items-center mr-4 mb-2">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {post.readTime}
                                </span>
                                <span className="flex items-center mb-2">
                                    <Tag className="h-4 w-4 mr-1" />
                                    {post.category}
                                </span>
                            </div>

                            {post.excerpt && (
                                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">
                                    {post.excerpt}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Social sharing sidebar on desktop */}
                    <div className="hidden md:block relative left-8 top-1/2 transform -translate-y-1/2 space-y-4">
                        <motion.button
                            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bookmark className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageSquare className="h-5 w-5" />
                        </motion.button>
                    </div>

                    {/* Article content */}
                    <article className="bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 mb-8">
                        <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={renderMarkdownContent(post.content)} />
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-4">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{post.author}</p>
                                    <p className="text-sm text-gray-500">Author</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Mobile social sharing */}
                    <div className="md:hidden flex justify-center space-x-4 mb-8">
                        <motion.button
                            className="p-3 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            className="p-3 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bookmark className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            className="p-3 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageSquare className="h-5 w-5" />
                        </motion.button>
                    </div>

                    {/* Related posts */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mockBlogPosts
                                .filter(relatedPost => relatedPost.id !== post.id && relatedPost.category === post.category)
                                .slice(0, 2)
                                .map(relatedPost => (
                                    <Link key={relatedPost.id} href={`/blogs/${relatedPost.id}`}>
                                        <motion.div
                                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="h-48 relative">
                                                <Image
                                                    src={relatedPost.image || '/placeholder.svg'}
                                                    alt={relatedPost.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-lg mb-2">{relatedPost.title}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{relatedPost.excerpt}</p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>{relatedPost.date}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                        </div>
                    </div>

                    {/* Subscribe section */}
                    <div className="bg-gray-900 text-white rounded-lg p-8 mb-8">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
                            <p className="mb-6">Subscribe to our newsletter to get the latest insights on digital marketing and branding.</p>
                            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-grow px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
                                />
                                <motion.button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Subscribe
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BlogDetailPage;