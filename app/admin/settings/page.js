"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Lock, Mail, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Form validation schemas
const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name must not be longer than 50 characters." }),
    email: z
        .string()
        .email({ message: "Please enter a valid email address." })
});

const passwordFormSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, { message: "Current password is required" }),
        newPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z
            .string()
            .min(8, { message: "Please confirm your new password." }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords don't match",
        path: ["confirmPassword"],
    });

export default function SettingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Profile form
    const profileForm = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "Admin User",
            email: "contact@poppypie.com",
        },
    });

    // Password form
    const passwordForm = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Handle profile update
    const onProfileSubmit = async (data) => {
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            // Send profile data to API
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Profile updated successfully!");
                setSuccessMessage("Profile updated successfully!");
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle password update
    const onPasswordSubmit = async (data) => {
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            // Send password update to API
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (response.ok) {
                // Reset form after successful submission
                passwordForm.reset({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                toast.success("Password updated successfully!");
                setSuccessMessage("Password updated successfully!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update password');
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error(error.message || "Failed to update password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Success</AlertTitle>
                    <AlertDescription className="text-green-600">
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                <CardTitle>Profile Information</CardTitle>
                            </div>
                            <CardDescription>
                                Update your personal information and email address
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is the name that will be displayed on your profile.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This email will be used for account notifications.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-blue-500" />
                                <CardTitle>Password</CardTitle>
                            </div>
                            <CardDescription>
                                Update your password to maintain account security
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator className="my-4" />

                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Password must be at least 8 characters long.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Updating..." : "Update Password"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}