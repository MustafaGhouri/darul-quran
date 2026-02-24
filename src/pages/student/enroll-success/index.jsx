import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Button, Spinner } from "@heroui/react";
import { CheckCircle, XCircle } from "lucide-react";

const EnrollSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const session_id = searchParams.get('session_id');
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    // useEffect(() => {
    //     if (session_id) {
    //         verifyPayment();
    //     } else {
    //         setStatus('error');
    //     }
    // }, [session_id]);

    const verifyPayment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment/verify-session?session_id=${session_id}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow min-h-[50vh] flex flex-col items-center justify-center text-center">
            {status === 'verifying' && (
                <>
                    <Spinner size="lg" color="primary" />
                    <p className="mt-4 text-lg">Verifying your payment...</p>
                </>
            )}
            {status === 'success' && (
                <>
                    <CheckCircle size={64} className="text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                    <p className="mb-6 text-gray-600">You have been enrolled in the course.</p>
                    <Button color="primary" onPress={() => navigate('/student/dashboard')}>
                        Go to Dashboard
                    </Button>
                </>
            )}
            {status === 'error' && (
                <>
                    <XCircle size={64} className="text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
                    <p className="mb-6 text-gray-600">We couldn't verify your payment. Please contact support.</p>
                    <Button variant="bordered" onPress={() => navigate('/student/browse-courses')}>
                        Back to Courses
                    </Button>
                </>
            )}
        </div>
    );
};

export default EnrollSuccess;
