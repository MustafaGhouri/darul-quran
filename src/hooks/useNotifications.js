import { useState, useEffect } from "react";
import {
    useGetVapidPublicKeyQuery,
    useSubscribeMutation,
    useUnsubscribeMutation,
} from "../redux/api/notifications";

/**
 * Custom hook for managing push notifications
 */
export const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);

    const { data: vapidData } = useGetVapidPublicKeyQuery();
    const [subscribe] = useSubscribeMutation();
    const [unsubscribe] = useUnsubscribeMutation();

    // Check if push notifications are supported
    const isSupported = () => {
        return (
            "serviceWorker" in navigator &&
            "PushManager" in window &&
            "Notification" in window
        );
    };

    // Convert VAPID key from base64 to Uint8Array
    const urlBase64ToUint8Array = (base64String) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    // Check current subscription status
    const checkSubscription = async () => {
        if (!isSupported()) return false;

        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();

            if (existingSubscription) {
                setSubscription(existingSubscription);
                setIsSubscribed(true);
                return true;
            } else {
                setIsSubscribed(false);
                return false;
            }
        } catch (error) {
            console.error("Error checking subscription:", error);
            return false;
        }
    };

    // Request notification permission
    const requestPermission = async () => {
        if (!isSupported()) {
            throw new Error("Push notifications are not supported in this browser");
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        } catch (error) {
            console.error("Error requesting permission:", error);
            throw error;
        }
    };

    // Subscribe to push notifications
    const subscribeToPush = async () => {
        if (!isSupported()) {
            throw new Error("Push notifications are not supported");
        }

        if (permission !== "granted") {
            const newPermission = await requestPermission();
            if (newPermission !== "granted") {
                throw new Error("Notification permission denied");
            }
        }

        if (!vapidData?.publicKey) {
            throw new Error("VAPID public key not available");
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push notifications
            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
            });

            // Get device info
            const deviceInfo = `${navigator.userAgent} - ${navigator.platform}`;

            // Send subscription to backend
            const response = await subscribe({
                subscription: pushSubscription.toJSON(),
                deviceInfo,
            }).unwrap();

            setSubscription(pushSubscription);
            setIsSubscribed(true);

            return response;
        } catch (error) {
            console.error("Error subscribing to push notifications:", error);
            throw error;
        }
    };

    // Unsubscribe from push notifications
    const unsubscribeFromPush = async () => {
        if (!subscription) {
            throw new Error("No active subscription found");
        }

        try {
            // Unsubscribe from push manager
            await subscription.unsubscribe();

            // Notify backend
            await unsubscribe({
                endpoint: subscription.endpoint,
            }).unwrap();

            setSubscription(null);
            setIsSubscribed(false);

            return true;
        } catch (error) {
            console.error("Error unsubscribing from push notifications:", error);
            throw error;
        }
    };

    // Check subscription on mount
    useEffect(() => {
        if (isSupported()) {
            checkSubscription();
        }
    }, []);

    // Update permission state when it changes
    useEffect(() => {
        if (!isSupported()) return;

        const handlePermissionChange = () => {
            setPermission(Notification.permission);
        };

        // Note: permission change events are not widely supported
        // This is a fallback check
        const interval = setInterval(() => {
            if (Notification.permission !== permission) {
                handlePermissionChange();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [permission]);

    return {
        isSupported: isSupported(),
        permission,
        isSubscribed,
        subscription,
        requestPermission,
        subscribeToPush,
        unsubscribeFromPush,
        checkSubscription,
    };
};
