import { useState, useEffect, useRef, useCallback } from "react";
import {
    useGetVapidPublicKeyQuery,
    useSubscribeMutation,
    useUnsubscribeMutation,
} from "../redux/api/notifications";

const getDeviceInfo = () =>
    `${navigator.userAgent} - ${navigator.platform}`;

/**
 * Custom hook for managing push notifications
 */
export const useNotifications = () => {
    const [permission, setPermission] = useState(() =>
        typeof window !== "undefined" && "Notification" in window
            ? Notification.permission
            : "default"
    );
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [subscriptionChecked, setSubscriptionChecked] = useState(false);
    const subscribingRef = useRef(false);

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

    const syncSubscriptionToBackend = useCallback(
        async (pushSubscription) => {
            const response = await subscribe({
                subscription: pushSubscription.toJSON(),
                deviceInfo: getDeviceInfo(),
            }).unwrap();

            setSubscription(pushSubscription);
            setIsSubscribed(true);
            return response;
        },
        [subscribe]
    );

    // Check current subscription status
    const checkSubscription = useCallback(async () => {
        if (!isSupported()) {
            setSubscriptionChecked(true);
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();

            if (existingSubscription) {
                setSubscription(existingSubscription);
                setIsSubscribed(true);
                return true;
            }

            setIsSubscribed(false);
            return false;
        } catch (error) {
            console.error("Error checking subscription:", error);
            return false;
        } finally {
            setSubscriptionChecked(true);
        }
    }, []);

    // Request notification permission
    const requestPermission = useCallback(async () => {
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
    }, []);

    // Subscribe to push notifications
    const subscribeToPush = useCallback(async () => {
        if (subscribingRef.current) return;

        if (!isSupported()) {
            throw new Error("Push notifications are not supported");
        }

        subscribingRef.current = true;

        try {
            let currentPermission = permission;
            if (currentPermission !== "granted") {
                currentPermission = await Notification.requestPermission();
                setPermission(currentPermission);
                if (currentPermission !== "granted") {
                    throw new Error("Notification permission denied");
                }
            }

            if (!vapidData?.publicKey) {
                throw new Error("VAPID public key not available");
            }

            const registration = await navigator.serviceWorker.ready;

            // Reuse existing browser subscription — don't create a new one
            let pushSubscription = await registration.pushManager.getSubscription();
            if (!pushSubscription) {
                pushSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
                });
            }

            return await syncSubscriptionToBackend(pushSubscription);
        } catch (error) {
            console.error("Error subscribing to push notifications:", error);
            throw error;
        } finally {
            subscribingRef.current = false;
        }
    }, [permission, vapidData?.publicKey, syncSubscriptionToBackend]);

    const getBrowserSubscription = useCallback(async () => {
        if (!isSupported()) return null;
        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.getSubscription();
    }, []);

    // Logout: deactivate on server only — keep browser subscription for re-login
    const deactivatePushOnLogout = useCallback(async () => {
        if (!isSupported()) return false;

        try {
            const browserSubscription = await getBrowserSubscription();
            if (!browserSubscription) return false;

            await unsubscribe({
                endpoint: browserSubscription.endpoint,
            }).unwrap();

            setIsSubscribed(false);
            return true;
        } catch (error) {
            console.error("Error deactivating push on logout:", error);
            throw error;
        }
    }, [getBrowserSubscription, unsubscribe]);

    // Re-login: re-sync existing browser subscription to backend
    const reactivatePushOnLogin = useCallback(async () => {
        if (!isSupported()) return false;

        let perm = Notification.permission;
        if (perm !== "granted") {
            perm = await requestPermission();
            if (perm !== "granted") return false;
        }

        const browserSubscription = await getBrowserSubscription();
        if (browserSubscription) {
            await syncSubscriptionToBackend(browserSubscription);
            return true;
        }

        await subscribeToPush();
        return true;
    }, [getBrowserSubscription, syncSubscriptionToBackend, subscribeToPush, requestPermission]);

    // Full unsubscribe (user turns off notifications in settings)
    const unsubscribeFromPush = useCallback(async () => {
        try {
            const browserSubscription =
                subscription || (await getBrowserSubscription());

            if (!browserSubscription) {
                throw new Error("No active subscription found");
            }

            await browserSubscription.unsubscribe();

            await unsubscribe({
                endpoint: browserSubscription.endpoint,
            }).unwrap();

            setSubscription(null);
            setIsSubscribed(false);

            return true;
        } catch (error) {
            console.error("Error unsubscribing from push notifications:", error);
            throw error;
        }
    }, [subscription, getBrowserSubscription, unsubscribe]);

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
        subscriptionChecked,
        subscription,
        requestPermission,
        subscribeToPush,
        unsubscribeFromPush,
        deactivatePushOnLogout,
        reactivatePushOnLogin,
        checkSubscription,
    };
};
