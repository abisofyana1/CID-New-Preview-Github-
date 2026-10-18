import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const NavigationLogger = () => {
    const location = useLocation();

    // Move hooks to top level, not inside other functions
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = '/api/activity';

    const checkPerformance = () => {
        if (performance && performance.memory) {
            // Determine if heap size is critical (e.g. > 80% used of limit) - Chrome Only
            const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
            if (usedJSHeapSize > jsHeapSizeLimit * 0.9) {
                return 'Browser Cache Full / Slow App';
            }
        }
        return 'Normal';
    };

    const logToBackend = async (status, description, recommendation) => {
        // Prevent flood of logs for same error
        const lastLog = sessionStorage.getItem('last_error_log');
        const now = Date.now();
        if (lastLog && now - parseInt(lastLog) < 5000) return; // Debounce 5s

        sessionStorage.setItem('last_error_log', now.toString());

        try {
            await axios.post(`${API_URL}/app`, {
                status: status, // Map to: Normal, Down, Bug, Error
                description: description,
                recommendation: recommendation,
                iduser: user?.id
            });

            // Notify User via Float Popup
            if (status !== 'Normal') {
                window.dispatchEvent(new CustomEvent('app-performance-warning', { detail: status }));
            }
        } catch (err) {
            console.error("Failed to log system error to server", err);
        }
    };

    // 1. Navigation & Memory Check (Existing)
    useEffect(() => {
        if (location.pathname !== '/login') {
            const perfStatus = checkPerformance();
            if (perfStatus !== 'Normal') {
                logToBackend('Bug', `Memory Issue: ${perfStatus} at ${location.pathname}`, 'Clear browser cache');
            }
        }
    }, [location]);

    // 2. Global Error Monitoring
    useEffect(() => {
        const handleGlobalError = (event) => {
            logToBackend('Error', `Script Error: ${event.message} at ${event.filename}:${event.lineno}`, 'Contact Developer');
        };

        const handlePromiseRejection = (event) => {
            const reason = event.reason;
            let message = 'Unknown Async Error';

            if (reason?.message) message = reason.message;
            if (reason?.response?.status) message = `API Error ${reason.response.status}: ${reason.response.statusText}`;
            if (reason?.code === 'ERR_NETWORK') message = 'Network Connection Failed';

            logToBackend('Down', `Async Failure: ${message}`, 'Check Network or Server Status');
        };

        const handleOffline = () => {
            logToBackend('Down', 'System Offline: Internet Connection Lost', 'Check Internet Connection');
        };

        window.addEventListener('error', handleGlobalError);
        window.addEventListener('unhandledrejection', handlePromiseRejection);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('error', handleGlobalError);
            window.removeEventListener('unhandledrejection', handlePromiseRejection);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return null;
};

export default NavigationLogger;
