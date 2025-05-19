import BlogDetailPage from "@/app/components/Blogs/BlogDetailPage";

export const generateMetadata = async ({ params }) => {

    return {
        title: `Blog Post | Poppy Pie - Marketing & Brand Management`,
        description: "Read our latest insights on marketing strategies, branding tips, and industry trends.",
        keywords: "blog post, marketing insights, branding tips, poppy pie blog",
        openGraph: {
            title: "Blog Post | Poppy Pie",
            description: "Discover valuable insights on marketing and branding strategies.",
        },
    };
};

export default function BlogPage({ params }) {
    return <BlogDetailPage />;
}