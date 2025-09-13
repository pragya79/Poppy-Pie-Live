'use client'
import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error Boundary caught an error:', error, errorInfo);

        // You can also log the error to an error reporting service here
        this.setState({
            error: error,
            errorInfo: errorInfo,
            eventId: Date.now().toString() // Simple error ID for reference
        });

        // Report to analytics or error tracking service
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            const { error, errorInfo, eventId } = this.state;
            const isDevelopment = process.env.NODE_ENV === 'development';

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <motion.div
                        className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600">
                                We encountered an unexpected error. Our team has been notified and we&apos;re working on a fix.
                            </p>
                        </div>

                        {/* Error ID for reference */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-500 mb-1">Error Reference ID:</p>
                            <p className="text-sm font-mono text-gray-700">{eventId}</p>
                        </div>

                        {/* Development error details */}
                        {isDevelopment && error && (
                            <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                                    Development Error Details
                                </summary>
                                <div className="text-xs text-red-700">
                                    <p className="font-semibold mb-2">Error:</p>
                                    <pre className="whitespace-pre-wrap mb-4 bg-white p-2 rounded border">
                                        {error.toString()}
                                    </pre>
                                    {errorInfo && (
                                        <>
                                            <p className="font-semibold mb-2">Component Stack:</p>
                                            <pre className="whitespace-pre-wrap bg-white p-2 rounded border">
                                                {errorInfo.componentStack}
                                            </pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <motion.button
                                onClick={this.handleRetry}
                                className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Try Again
                            </motion.button>
                            <motion.button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </motion.button>
                        </div>

                        {/* Help text */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                If this problem persists, please contact us at{' '}
                                <a
                                    href="mailto:contact@poppypie.com"
                                    className="text-black hover:underline font-medium"
                                >
                                    contact@poppypie.com
                                </a>
                                {eventId && (
                                    <span className="block mt-1">
                                        Please include the error reference ID above.
                                    </span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;