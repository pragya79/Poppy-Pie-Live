'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from "../../components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const validateToken = async () => {
            try {
                const res = await fetch('/api/validate-reset-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, token }),
                });

                if (res.ok) {
                    setTokenValid(true);
                } else {
                    const data = await res.json();
                    setError(data.message || 'Invalid or expired reset link.');
                }
            } catch (err) {
                setError('An unexpected error occurred. Please try again.');
            }
        };

        if (email && token) {
            validateToken();
        } else {
            setError('Invalid reset link.');
        }
    }, [email, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!password || !confirmPassword) {
            setError('Both password fields are required');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Password reset successfully. Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const buttonVariants = {
        hover: { scale: 1.03, backgroundColor: "#333", transition: { type: "spring", stiffness: 400, damping: 10 } },
        tap: { scale: 0.97 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (!tokenValid) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">Error</h2>
                    <p className="text-sm text-gray-600 text-center">{error}</p>
                    <div className="text-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
                </motion.div>

                <motion.form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="space-y-4" variants={containerVariants}>
                        {error && (
                            <motion.div
                                className="p-3 text-sm text-red-700 bg-red-100 rounded-md"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                className="p-3 text-sm text-green-700 bg-green-100 rounded-md"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {success}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <LabelInputContainer>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password:
                                </Label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </LabelInputContainer>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <LabelInputContainer>
                                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password:
                                </Label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </LabelInputContainer>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 group/btn relative"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                            <BottomGradient />
                        </motion.button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Back to Login
                        </button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-60" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-0 blur-sm transition duration-300 group-hover/btn:opacity-40" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

export default ResetPassword;