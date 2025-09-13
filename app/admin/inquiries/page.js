"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Search,
    Filter,
    Mail,
    Eye,
    Check,
    MessageSquare,
    Download,
    RefreshCw
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"

// Mock data for inquiries
const mockInquiries = [
    {
        id: "INQ-001",
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        date: "2025-04-02T10:45:00",
        subject: "Branding services inquiry",
        message: "I'm interested in your branding services for my new startup. We're in the tech industry and looking to establish a strong brand identity. Could you provide more information about your packages and pricing?",
        status: "new"
    },
    {
        id: "INQ-002",
        name: "Emily Johnson",
        email: "emily@company.co",
        phone: "+1 (555) 987-6543",
        date: "2025-04-01T14:22:00",
        subject: "Digital marketing strategy",
        message: "We're looking to improve our digital marketing efforts and would like to discuss how your agency could help us. Our main goals are increasing brand awareness and lead generation. Do you offer customized strategies?",
        status: "new"
    },
    {
        id: "INQ-003",
        name: "Michael Brown",
        email: "michael@startup.io",
        phone: "+1 (555) 246-8135",
        date: "2025-03-31T09:10:00",
        subject: "Website redesign project",
        message: "Our company website needs a complete overhaul. We're looking for a modern, responsive design with improved user experience. Could we schedule a call to discuss this project in more detail?",
        status: "in-progress"
    },
    {
        id: "INQ-004",
        name: "Sarah Williams",
        email: "sarah@corporation.com",
        phone: "+1 (555) 369-7452",
        date: "2025-03-30T16:55:00",
        subject: "Social media management",
        message: "We need help managing our social media presence across multiple platforms. Our team lacks the time and expertise to handle this effectively. Could you tell me about your social media management services?",
        status: "in-progress"
    },
    {
        id: "INQ-005",
        name: "David Lee",
        email: "david@business.org",
        phone: "+1 (555) 159-7536",
        date: "2025-03-28T11:30:00",
        subject: "Logo design inquiry",
        message: "I'm looking for a professional logo design for my consulting business. I need something that conveys trust and expertise. What's your process for logo design, and what information would you need from me?",
        status: "completed"
    },
    {
        id: "INQ-006",
        name: "Jennifer Garcia",
        email: "jennifer@retailstore.net",
        phone: "+1 (555) 852-9637",
        date: "2025-03-27T13:15:00",
        subject: "Email marketing campaign",
        message: "We're planning a seasonal promotion and need help with email marketing. We'd like to create a series of emails to engage our customers and drive sales. Do you have experience with email campaigns for retail?",
        status: "new"
    },
    {
        id: "INQ-007",
        name: "Robert Wilson",
        email: "robert@techfirm.co",
        phone: "+1 (555) 741-8520",
        date: "2025-03-26T10:05:00",
        subject: "SEO optimization services",
        message: "Our website's organic traffic has been declining, and we need help with SEO optimization. We're particularly interested in improving our local search rankings. Could you explain your approach to SEO?",
        status: "completed"
    },
    {
        id: "INQ-008",
        name: "Lisa Martinez",
        email: "lisa@healthcare.org",
        phone: "+1 (555) 369-2584",
        date: "2025-03-25T15:40:00",
        subject: "Content marketing strategy",
        message: "We're a healthcare provider looking to develop a content marketing strategy to position ourselves as thought leaders in our field. We need help creating valuable content that resonates with our audience. What would this process look like?",
        status: "in-progress"
    }
]

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([])
    const [filteredInquiries, setFilteredInquiries] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedInquiry, setSelectedInquiry] = useState(null)
    const [responseText, setResponseText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    // Fetch inquiries from API
    useEffect(() => {
        // Redirect if not authenticated
        // if (!loading && !isAuthenticated) {
        //     router.push('/login')
        //     return
        // }

        const fetchInquiries = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/inquiries');
                if (response.ok) {
                    const data = await response.json();
                    const inquiriesData = data.inquiries || data; // Handle both response formats
                    setInquiries(inquiriesData);
                    setFilteredInquiries(inquiriesData);
                } else {
                    console.error('Failed to fetch inquiries:', response.statusText);
                    // Fallback to mock data if API fails
                    setInquiries(mockInquiries);
                    setFilteredInquiries(mockInquiries);
                }
            } catch (error) {
                console.error('Failed to fetch inquiries:', error);
                // Fallback to mock data if API fails
                setInquiries(mockInquiries);
                setFilteredInquiries(mockInquiries);
            } finally {
                setIsLoading(false)
            }
        }

        // if (isAuthenticated) {
        fetchInquiries()
        // }
    }, [isAuthenticated, loading, router])

    // Handle filtering and searching
    useEffect(() => {
        let result = [...inquiries]

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(inquiry => inquiry.status === statusFilter)
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(inquiry =>
                inquiry.name.toLowerCase().includes(term) ||
                inquiry.email.toLowerCase().includes(term) ||
                inquiry.subject.toLowerCase().includes(term) ||
                inquiry.message.toLowerCase().includes(term)
            )
        }

        setFilteredInquiries(result)
    }, [inquiries, statusFilter, searchTerm])

    // Handle view inquiry details
    const handleViewInquiry = (inquiry) => {
        setSelectedInquiry(inquiry)
        setOpenDialog(true)
        setResponseText("") // Reset response text
    }

    // Handle sending a response
    const handleSendResponse = async () => {
        if (!responseText.trim()) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/inquiries/${selectedInquiry.id}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    response: responseText,
                    respondedBy: 'Admin'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update inquiry status in our local state
                const updatedInquiries = inquiries.map(inq =>
                    inq.id === selectedInquiry.id
                        ? { ...inq, status: "completed", response: responseText, responseDate: new Date().toISOString() }
                        : inq
                )
                setInquiries(updatedInquiries)

                alert(data.emailError ?
                    'Response saved but email failed to send. Please contact customer manually.' :
                    'Response sent successfully!'
                );
            } else {
                throw new Error(data.error || 'Failed to send response');
            }

            setOpenDialog(false)
        } catch (error) {
            console.error("Failed to send response:", error)
            alert(`Failed to send response: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle status update
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus,
                    updatedBy: 'Admin'
                }),
            });

            if (response.ok) {
                const updatedInquiry = await response.json();
                // Update inquiry status in our local state
                const updatedInquiries = inquiries.map(inq =>
                    inq.id === id ? updatedInquiry : inq
                )
                setInquiries(updatedInquiries)
                console.log(`Status updated to ${newStatus} successfully!`)
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }
        } catch (error) {
            console.error("Failed to update status:", error)
            alert(`Failed to update status: ${error.message}`)
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Handle refresh
    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/inquiries');
            if (response.ok) {
                const data = await response.json();
                const inquiriesData = data.inquiries || data; // Handle both response formats
                setInquiries(inquiriesData);
                setFilteredInquiries(inquiriesData);
            } else {
                console.error('Failed to refresh inquiries:', response.statusText);
                // Keep existing data if refresh fails
            }
        } catch (error) {
            console.error('Failed to refresh inquiries:', error);
            // Keep existing data if refresh fails
        } finally {
            setIsLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Inquiries</h1>
                    <p className="text-muted-foreground">Manage and respond to customer messages</p>
                </div>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search inquiries..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" className="hidden sm:flex">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Inquiries Table */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Recent Inquiries</CardTitle>
                    <CardDescription>
                        You have {filteredInquiries.length} total inquiries
                        {statusFilter !== "all" && ` (filtered by ${statusFilter})`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredInquiries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No inquiries found</p>
                            {(searchTerm || statusFilter !== "all") && (
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearchTerm("")
                                        setStatusFilter("all")
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Name</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Subject</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Status</th>
                                        <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{inquiry.id}</td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-sm">{inquiry.name}</p>
                                                    <p className="text-xs text-gray-500">{inquiry.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">{inquiry.subject}</td>
                                            <td className="py-3 px-4 text-sm">{formatDate(inquiry.date)}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                            inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'}`}
                                                >
                                                    {inquiry.status === 'new' ? 'New' :
                                                        inquiry.status === 'in-progress' ? 'In Progress' :
                                                            'Completed'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewInquiry(inquiry)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {inquiry.status === 'new' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleStatusUpdate(inquiry.id, 'in-progress')}
                                                        >
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {inquiry.status === 'in-progress' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleStatusUpdate(inquiry.id, 'completed')}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View/Reply Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Inquiry Details</DialogTitle>
                        <DialogDescription>
                            View inquiry details and send a response
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">From</p>
                                    <p className="font-medium">{selectedInquiry.name}</p>
                                    <p className="text-sm">{selectedInquiry.email}</p>
                                    <p className="text-sm">{selectedInquiry.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Received</p>
                                    <p className="text-sm">{formatDate(selectedInquiry.date)}</p>
                                    <p className="text-sm font-medium text-gray-500 mt-2 mb-1">Status</p>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${selectedInquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                selectedInquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'}`}
                                    >
                                        {selectedInquiry.status === 'new' ? 'New' :
                                            selectedInquiry.status === 'in-progress' ? 'In Progress' :
                                                'Completed'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Subject</p>
                                <p className="font-medium">{selectedInquiry.subject}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
                                <div className="p-4 border rounded-md bg-gray-50 text-sm">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Your Response</p>
                                <Textarea
                                    placeholder="Type your response here..."
                                    className="min-h-32"
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendResponse}
                            disabled={!responseText.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Response"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}