import { useState, useEffect } from 'react';

export const useAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/analytics');

            if (!response.ok) {
                throw new Error(`Failed to fetch analytics: ${response.status}`);
            }

            const data = await response.json();
            setAnalytics(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics
    };
};

export default useAnalytics;