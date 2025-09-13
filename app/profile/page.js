'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X, Shield } from 'lucide-react';

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Initialize profile data from session
    useEffect(() => {
        if (session?.user) {
            const userData = {
                firstName: session.user.name?.split(' ')[0] || '',
                lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
                email: session.user.email || '',
                mobile: session.user.mobile || ''
            };
            setProfileData(userData);
            setOriginalData(userData);
        }
    }, [session]);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Here you would typically make an API call to update user profile
            // For now, we'll just simulate a save operation
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOriginalData(profileData);
            setIsEditing(false);
            setMessage('Profile updated successfully!');

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData(originalData);
        setIsEditing(false);
        setMessage('');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {profileData.firstName} {profileData.lastName}
                                    </h1>
                                    <div className="flex items-center text-gray-200 mt-1">
                                        <Shield className="w-4 h-4 mr-2" />
                                        <span className="text-sm capitalize">{session.user.role || 'user'}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Success/Error Message */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-md ${message.includes('success')
                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                            >
                                {message}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        placeholder="Enter your first name"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{profileData.firstName || 'Not set'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        placeholder="Enter your last name"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{profileData.lastName || 'Not set'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900">{profileData.email}</span>
                                    <span className="text-xs text-gray-500 ml-auto">Cannot be changed</span>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profileData.mobile}
                                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        placeholder="Enter your mobile number"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{profileData.mobile || 'Not set'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200"
                            >
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </motion.div>
                        )}

                        {/* Account Information */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Account Type:</span>
                                        <span className="ml-2 font-medium capitalize">{session.user.role || 'user'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">User ID:</span>
                                        <span className="ml-2 font-mono text-xs">{session.user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;