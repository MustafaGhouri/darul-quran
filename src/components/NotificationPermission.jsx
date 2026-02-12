import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useSendTestNotificationMutation } from "../redux/api/notifications";
import toast from "react-hot-toast";

const NotificationPermission = () => {
    const {
        isSupported,
        permission,
        isSubscribed,
        subscribeToPush,
        unsubscribeFromPush,
    } = useNotifications();

    const [sendTestNotification] = useSendTestNotificationMutation();
    const [loading, setLoading] = useState(false);

    // Don't show if notifications are not supported
    if (!isSupported) {
        return null;
    }

    // Don't show if already granted and subscribed
    if (permission === "granted" && isSubscribed) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={<BellRing size={16} />}
                    onPress={handleTestNotification}
                >
                    Test Notification
                </Button>
                <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<BellOff size={16} />}
                    onPress={handleUnsubscribe}
                >
                    Disable Notifications
                </Button>
            </div>
        );
    }

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            await subscribeToPush();
            toast.success("Successfully subscribed to notifications!");
        } catch (error) {
            console.error("Error subscribing:", error);
            toast.error(error.message || "Failed to subscribe to notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setLoading(true);
        try {
            await unsubscribeFromPush();
            toast.success("Successfully unsubscribed from notifications");
        } catch (error) {
            console.error("Error unsubscribing:", error);
            toast.error("Failed to unsubscribe from notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleTestNotification = async () => {
        try {
            await sendTestNotification().unwrap();
            toast.success("Test notification sent! Check your notifications.");
        } catch (error) {
            console.error("Error sending test notification:", error);
            toast.error("Failed to send test notification");
        }
    };

    // Show subscribe button if not subscribed
    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<Bell size={16} />}
                onPress={handleSubscribe}
                isLoading={loading}
            >
                Enable Notifications
            </Button>
        </div>
    );
};

export default NotificationPermission;
