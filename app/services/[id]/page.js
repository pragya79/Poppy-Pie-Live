import { Suspense } from "react"
import ServiceDetailPage from "@/app/components/Services/ServiceDetailPage"
import { products, services } from "@/app/components/Services/servicesData"

// Generate metadata for this page
export async function generateMetadata({ params }) {
    // Make sure params is resolved if it's a promise
    const resolvedParams = params instanceof Promise ? await params : params
    const serviceId = resolvedParams.id

    // Find the service or product
    const service = services.find(s => s.id === serviceId)
    const product = products.find(p => p.id === serviceId)
    const item = service || product

    if (!item) {
        return {
            title: "Service Not Found | Poppy Pie",
            description: "The requested service or product could not be found."
        }
    }

    return {
        title: `${item.title} | Poppy Pie Services`,
        description: item.description.split('\n')[0],
        openGraph: {
            title: `${item.title} | Poppy Pie Services`,
            description: item.description.split('\n')[0]
        }
    }
}

export default function ServicePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>}>
            <ServiceDetailPage />
        </Suspense>
    )
}