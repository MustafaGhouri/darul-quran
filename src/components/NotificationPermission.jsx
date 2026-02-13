import { useState } from "react";
import { Button } from "@heroui/react";
import { successMessage, errorMessage } from "../lib/toast.config";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useSendTestNotificationMutation } from "../redux/api/notifications";

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
    const handleTestNotification = async () => {
        try {
            await sendTestNotification().unwrap();
            successMessage("Test notification sent! Check your notifications.");
        } catch (error) {
            console.error("Error sending test notification:", error);
            errorMessage("Failed to send test notification");
        }
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            await subscribeToPush();
            successMessage("Successfully subscribed to notifications!");
        } catch (error) {
            console.error("Error subscribing:", error);
            errorMessage(error.message || "Failed to subscribe to notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setLoading(true);
        try {
            await unsubscribeFromPush();
            successMessage("Successfully unsubscribed from notifications");
        } catch (error) {
            console.error("Error unsubscribing:", error);
            errorMessage("Failed to unsubscribe from notifications");
        } finally {
            setLoading(false);
        }
    };


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
