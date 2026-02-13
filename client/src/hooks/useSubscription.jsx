import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSubscriptionStatus } from '../services/subscriptionService';
import { useAppSelector } from './useRedux'; // Assuming this exists, based on previous file views

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAppSelector((state) => state.auth || {}); // Simple check if auth exists in Redux

    const fetchSubscription = useCallback(async () => {
        // Only fetch if authenticated
        // Note: usage of Redux inside here might depend on where Provider is placed. 
        // If placed in App.jsx inside Provider, it works.
        try {
            setIsLoading(true);
            const data = await getSubscriptionStatus();
            setSubscription(data.data);
        } catch (error) {
            console.error('Error fetching subscription status:', error);
            // Don't clear subscription on error to avoid UI flashing if it's just a network blip, 
            // but maybe set error state if needed.
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        if (isAuthenticated) {
            fetchSubscription();
        } else {
            setSubscription(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchSubscription]);

    // Check limit helper
    // type: 'companies' | 'receipts'
    const checkLimit = useCallback((type) => {
        if (!subscription) return false; // Fail safe or assume allowed? 
        // If no subscription loaded yet, maybe block?

        const usageItem = subscription.usage[type];
        if (!usageItem) return true; // Unknown type, allow?

        if (usageItem.isUnlimited) return true;
        return usageItem.used < usageItem.limit;
    }, [subscription]);

    const value = {
        plan: subscription?.plan,
        usage: subscription?.usage,
        isLoading,
        checkLimit,
        refreshSubscription: fetchSubscription
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
