"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Search,
    Briefcase,
    MapPin,
    Calendar,
    Users,
    Eye,
    Edit,
    Trash2,
    Filter
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
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"

export default function JobsManagement() {
    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [deleteJobId, setDeleteJobId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const { isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/jobs?includeStats=true')
                if (response.ok) {
                    const data = await response.json()
                    setJobs(data.jobs || [])
                    setFilteredJobs(data.jobs || [])
                } else {
                    console.error('Failed to fetch jobs:', response.statusText)
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (!loading && isAuthenticated && isAdmin()) {
            fetchJobs()
        } else if (!loading && (!isAuthenticated || !isAdmin())) {
            router.push('/login')
        }
    }, [isAuthenticated, loading, isAdmin, router])

    // Filter jobs
    useEffect(() => {
        let result = [...jobs]

        if (statusFilter !== "all") {
            result = result.filter(job => job.status === statusFilter)
        }

        if (categoryFilter !== "all") {
            result = result.filter(job => job.category === categoryFilter)
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(job =>
                job.title.toLowerCase().includes(term) ||
                job.category.toLowerCase().includes(term) ||
                job.location.toLowerCase().includes(term) ||
                job.employmentType.toLowerCase().includes(term)
            )
        }

        setFilteredJobs(result)
    }, [jobs, statusFilter, categoryFilter, searchTerm])

    // Handle job deletion
    const handleDeleteJob = async () => {
        if (!deleteJobId) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/jobs/${deleteJobId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setJobs(prev => prev.filter(job => job.id !== deleteJobId))
                console.log('Job deleted successfully')
            } else {
                const data = await response.json()
                alert(`Failed to delete job: ${data.error}`)
            }
        } catch (error) {
            console.error('Failed to delete job:', error)
            alert('Failed to delete job')
        } finally {
            setIsDeleting(false)
            setDeleteJobId(null)
        }
    }

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800'
            case 'draft':
                return 'bg-yellow-100 text-yellow-800'
            case 'archived':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set'
        return new Date(dateString).toLocaleDateString()
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
                    <h1 className="text-2xl font-bold">Jobs Management</h1>
                    <p className="text-gray-600">Manage job postings and applications</p>
                </div>
                <Button onClick={() => router.push('/admin/jobs/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search jobs..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Jobs List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredJobs.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No jobs found</p>
                        {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setCategoryFilter("all")
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadge(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location || 'Remote'}</span>
                                        <span>•</span>
                                        <span>{job.employmentType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="h-4 w-4" />
                                        <span>{job.applicationCount || 0} applications</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Category: {job.category}
                                    </p>
                                </div>

                                <div className="flex justify-end items-center gap-2 mt-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.push(`/admin/jobs/${job.id}/applications`)}
                                        title="View Applications"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.push(`/admin/jobs/edit/${job.id}`)}
                                        title="Edit Job"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteJobId(job.id)}
                                        title="Delete Job"
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Job</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this job? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteJobId(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteJob}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
