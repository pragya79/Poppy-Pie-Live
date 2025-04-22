import { Suspense } from "react";
import ServicesPage from "../components/Services/ServicesPage"

export const metadata = {
    title: "Services | Poppy Pie - Marketing, Branding & Growth Experts",
    description: "Discover the full range of marketing, branding, and growth management services offered by Poppy Pie. We help businesses stand out, attract clients, and scale successfully in a competitive market.",
    keywords: "marketing services, branding agency, business growth, brand management, digital marketing, creative marketing agency, growth strategy, client acquisition, Poppy Pie services",
    openGraph: {
        title: "Services | Poppy Pie - Marketing, Branding & Growth Experts",
        description: "Explore how Poppy Pie empowers businesses with strategic marketing, branding, and growth solutions tailored for success.",
    },
}


export default function AboutUsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServicesPage />
        </Suspense>
    );
}