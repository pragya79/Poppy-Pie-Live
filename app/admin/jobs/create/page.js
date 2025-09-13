"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useEffect } from "react"

export default function CreateJob() {
    const router = useRouter()
    const { isAuthenticated, loading, isAdmin } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featuredImage: "",
        category: "",
        tags: [],
        status: "draft",
        author: "Admin",
        location: "",
        employmentType: "Full-time",
        experienceLevel: "Mid Level",
        salaryRange: "",
        applicationDeadline: "",
        department: "",
        remoteWork: false,
        priority: "medium",
        requirements: [],
        responsibilities: [],
        benefits: []
    })

    // Temporary states for adding items to arrays
    const [newRequirement, setNewRequirement] = useState("")
    const [newResponsibility, setNewResponsibility] = useState("")
    const [newBenefit, setNewBenefit] = useState("")
    const [newTag, setNewTag] = useState("")

    // Auth check
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || !isAdmin()) {
                router.push('/login')
            }
        }
    }, [isAuthenticated, loading, isAdmin, router])

    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
    }

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value }

            // Auto-generate slug when title changes
            if (field === 'title' && !prev.slug) {
                updated.slug = generateSlug(value)
            }

            return updated
        })
    }

    // Add item to array field
    const addArrayItem = (field, value, setter) => {
        if (!value.trim()) return

        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }))
        setter("")
    }

    // Remove item from array field
    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.title || !formData.content || !formData.category) {
            alert('Please fill in all required fields (Title, Content, Category)')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Job created successfully:', data)
                router.push('/admin/jobs')
            } else {
                const errorData = await response.json()
                alert(`Failed to create job: ${errorData.error}`)
            }
        } catch (error) {
            console.error('Failed to create job:', error)
            alert('Failed to create job. Please try again.')
        } finally {
            setIsSubmitting(false)
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
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/jobs')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Jobs
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Create New Job</h1>
                    <p className="text-gray-600">Add a new job posting</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g. Senior Software Engineer"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => handleInputChange('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content">Job Description *</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                        placeholder="Detailed job description..."
                                        rows={8}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                                    <Input
                                        id="featuredImage"
                                        type="url"
                                        value={formData.featuredImage}
                                        onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newRequirement}
                                        onChange={(e) => setNewRequirement(e.target.value)}
                                        placeholder="Add a requirement..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addArrayItem('requirements', newRequirement, setNewRequirement)
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addArrayItem('requirements', newRequirement, setNewRequirement)}
                                        size="icon"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm">{req}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeArrayItem('requirements', index)}
                                                className="h-6 w-6"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Responsibilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Responsibilities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newResponsibility}
                                        onChange={(e) => setNewResponsibility(e.target.value)}
                                        placeholder="Add a responsibility..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addArrayItem('responsibilities', newResponsibility, setNewResponsibility)
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addArrayItem('responsibilities', newResponsibility, setNewResponsibility)}
                                        size="icon"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.responsibilities.map((resp, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm">{resp}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeArrayItem('responsibilities', index)}
                                                className="h-6 w-6"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benefits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Benefits</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newBenefit}
                                        onChange={(e) => setNewBenefit(e.target.value)}
                                        placeholder="Add a benefit..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addArrayItem('benefits', newBenefit, setNewBenefit)
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addArrayItem('benefits', newBenefit, setNewBenefit)}
                                        size="icon"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm">{benefit}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeArrayItem('benefits', index)}
                                                className="h-6 w-6"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publication</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => handleInputChange('priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => handleInputChange('author', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Job Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Sales">Sales</SelectItem>
                                            <SelectItem value="Operations">Operations</SelectItem>
                                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="Customer Support">Customer Support</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="e.g. New York, NY"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="employmentType">Employment Type</Label>
                                    <Select
                                        value={formData.employmentType}
                                        onValueChange={(value) => handleInputChange('employmentType', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Freelance">Freelance</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="experienceLevel">Experience Level</Label>
                                    <Select
                                        value={formData.experienceLevel}
                                        onValueChange={(value) => handleInputChange('experienceLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Entry Level">Entry Level</SelectItem>
                                            <SelectItem value="Mid Level">Mid Level</SelectItem>
                                            <SelectItem value="Senior Level">Senior Level</SelectItem>
                                            <SelectItem value="Executive">Executive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={formData.department}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        placeholder="e.g. Technology"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="salaryRange">Salary Range</Label>
                                    <Input
                                        id="salaryRange"
                                        value={formData.salaryRange}
                                        onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                                        placeholder="e.g. $80,000 - $120,000"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                                    <Input
                                        id="applicationDeadline"
                                        type="date"
                                        value={formData.applicationDeadline}
                                        onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remoteWork"
                                        checked={formData.remoteWork}
                                        onCheckedChange={(checked) => handleInputChange('remoteWork', checked)}
                                    />
                                    <Label htmlFor="remoteWork">Remote Work Available</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add a tag..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addArrayItem('tags', newTag, setNewTag)
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addArrayItem('tags', newTag, setNewTag)}
                                        size="icon"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('tags', index)}
                                                className="hover:bg-blue-200 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/jobs')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Create Job
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}