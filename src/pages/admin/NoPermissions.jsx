import { Link } from "react-router-dom";
import { ShieldOff, MessageSquare } from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { errorMessage, successMessage } from "../../lib/toast.config";
import { clearUser } from "../../redux/reducers/user";
import { useDispatch } from "react-redux";

export default function NoPermissions() {
    const dispatch = useDispatch();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogut = async () => {
        setLoggingOut(true);
        try {
            const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data?.message || "Logout failed");

            successMessage(data?.message || "Logout successful");
            dispatch(clearUser());
            // location.reload();
        } catch (error) {
            console.log(error);
            errorMessage(error.message);
        } finally {
            setLoggingOut(false);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <div className="text-center px-4 py-8 max-w-lg">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <ShieldOff className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    No Permissions Assigned
                </h1>

                <p className="text-gray-600 mb-2 text-lg">
                    Your account doesn't have any permissions configured.
                </p>
                <p className="text-gray-500 mb-8">
                    Please contact the system administrator to grant you access to specific features.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        as={Link}
                        to={'mailto:' + import.meta.env.VITE_PUBLIC_SUPPORT_EMAIL}
                        variant="bordered"
                        className="border-[#06574C] text-[#06574C] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#06574C]/5 transition-colors"
                        startContent={<MessageSquare size={18} />}
                    >
                        Contact Support
                    </Button>
                    <Button
                        startContent={
                            loggingOut ? <Spinner color='success' /> : <span className="w-5">
                                <MdLogout size={18} />
                            </span>
                        }
                        color="success"
                        isLoading={loggingOut}
                        onPress={handleLogut}
                        isDisabled={loggingOut}
                    >
                        Logout
                    </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> If you believe this is an error, please reach out to your administrator with your user details.
                    </p>
                </div>
            </div>
        </div>
    );
}
