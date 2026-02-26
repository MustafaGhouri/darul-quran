import React from 'react';
import { Button, Card, CardBody } from "@heroui/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console instead of crashing
        console.error('Error Boundary caught an error:', error);
        console.error('Error Info:', errorInfo);

        this.setState({
            error: error
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen  bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full bg-white dark:bg-[#121212] shadow-xl border border-gray-200 dark:border-gray-700">
                        <CardBody className="px-4 sm:px-8 py-4 text-center">
                            <div className="text-[#06574C] self-center dark:text-[#95C4BE] text-5xl ">
                                <img className='size-36' src="/icons/darul-quran-logo.svg" alt="Darul Quran" />
                            </div>

                            <h2 className="text-2xl font-semibold text-[#3F3F44] dark:text-white mb-3">
                                Something went wrong
                            </h2>

                            <p className="text-[#3F3F44] dark:text-gray-300 mb-8 text-sm leading-relaxed">
                                Don't worry, we've logged the error. Please try refreshing the page.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    color="success"
                                    variant="solid"
                                    size="lg"
                                    className="w-full font-medium"
                                >
                                    Refresh Page
                                </Button>

                                <Button
                                    onClick={() => window.location.href = '/'}
                                    variant="bordered"
                                    size="lg"
                                    className="w-full font-medium text-[#3F3F44] dark:text-white border-[#06574C] dark:border-gray-600 hover:bg-[#06574C] hover:text-white dark:hover:bg-gray-800"
                                >
                                    Go to Home
                                </Button>
                            </div>

                            {/* Show error details in development only */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-6 text-left">
                                    <summary className="cursor-pointer text-[#06574C] dark:text-[#95C4BE] hover:text-[#054a3f] dark:hover:text-[#95C4BE] text-xs font-medium">
                                        Error Details (Dev Only)
                                    </summary>
                                    <div className="mt-2 p-3 bg-[#E9E0D6] dark:bg-gray-900 rounded-md text-xs text-red-500 dark:text-red-300 overflow-auto max-h-40 border border-gray-200 dark:border-gray-700">
                                        <pre className="whitespace-pre-wrap break-all">{this.state.error.toString()}</pre>
                                    </div>
                                </details>
                            )}
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;