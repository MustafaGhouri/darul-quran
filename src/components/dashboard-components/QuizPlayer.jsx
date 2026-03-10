import React, { useState, useEffect, useRef } from "react";
import { Button, RadioGroup, Radio, Card, CardBody, CardHeader, Progress, Divider } from "@heroui/react";
import { Timer, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useSubmitQuizMutation } from "../../redux/api/courses";
import { successMessage, errorMessage } from "../../lib/toast.config";

const QuizPlayer = ({ quiz, courseId, onComplete }) => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState((quiz.duration || 15) * 60);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quizCancelled, setQuizCancelled] = useState(false);
     
    useEffect(() => {
        if (!isQuizStarted || isSubmitted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isQuizStarted, isSubmitted, timeLeft]);

    // Fullscreen exit detection
    useEffect(() => {
        if (!isQuizStarted || isSubmitted || quizCancelled) return;

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isFullscreen) {
                // Fullscreen was exited
                setIsFullscreen(false);
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Fullscreen Exited!',
                    html: `
                        <div style="text-align: center;">
                            <p style="margin-bottom: 15px;">You have exited fullscreen mode.</p>
                            <p style="color: #e74c3c; font-weight: bold;">If you continue, your quiz will be cancelled and you will have to try again.</p>
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonColor: '#06574C',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Continue Quiz (Go Back to Fullscreen)',
                    cancelButtonText: 'Cancel Quiz',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // User wants to continue quiz - re-enter fullscreen
                        containerRef.current?.requestFullscreen().catch(() => {
                            errorMessage('Please enable fullscreen manually to continue');
                        });
                        setIsFullscreen(true);
                    } else {
                        // User cancelled the quiz
                        setQuizCancelled(true);
                        setIsQuizStarted(false);
                        setIsFullscreen(false);
                        errorMessage('Quiz cancelled. Please try again.');
                    }
                });
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isQuizStarted, isSubmitted, quizCancelled, isFullscreen]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleAnswerChange = (value) => {
        setAnswers({ ...answers, [currentQuestionIndex]: parseInt(value) });
    };

    const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

    const handleSubmit = async () => {
        if (isSubmitted) return;
        
        // Prepare answers for backend (index to answer)
        const submissionAnswers = quiz.questions.map((q, idx) => ({
            questionIndex: idx,
            selectedOption: answers[idx] !== undefined ? answers[idx] : null
        }));

        try {
            const res = await submitQuiz({
                courseId,
                quizId: quiz.id,
                answers: submissionAnswers
            }).unwrap();

            if (res.success) {
                setResult(res.attempt);
                setIsSubmitted(true);
                successMessage(res.attempt.passed ? "Congratulations! You passed the quiz." : "You didn't pass this time.");
                if (onComplete) onComplete(res.attempt);
            }
        } catch (err) {
            errorMessage(err?.data?.message || "Failed to submit quiz");
        }
    };

    const currentQuestion = quiz.questions && quiz.questions.length > 0 ? quiz.questions[currentQuestionIndex] : null;
    const isLastQuestion = quiz.questions ? currentQuestionIndex === quiz.questions.length - 1 : true;

    const renderContent = () => {
        if (!currentQuestion) {
            return (
                <div className="max-w-3xl mx-auto my-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-700">No Questions Found</h2>
                    <p className="text-gray-500 mt-2">This quiz does not have any questions available yet.</p>
                </div>
            );
        }

        if (!isQuizStarted) {
            return quizCancelled ? (
                <div className="max-w-3xl w-full mx-auto my-6 px-4">
                    <Card className="shadow-md">
                        <CardHeader className="p-6 bg-red-50 border-b flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
                            <p className="text-red-600 mt-2 text-center font-semibold">Quiz Cancelled</p>
                        </CardHeader>
                        <CardBody className="p-8 flex flex-col items-center">
                            <XCircle className="text-red-500 mb-4" size={64} />
                            <p className="text-gray-600 mt-2 text-center mb-6">The quiz was cancelled. You can try again when you're ready.</p>
                            <Button
                                className="bg-[#06574C] text-white px-8 py-3"
                                onPress={() => {
                                    setQuizCancelled(false);
                                    setIsQuizStarted(true);
                                    toggleFullscreen();
                                }}
                            >
                                Try Again
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            ) : (
                <div className="max-w-3xl w-full mx-auto my-6 px-4">
                    <Card className="shadow-md">
                        <CardHeader className="p-6 bg-gray-50 border-b flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
                            {quiz.description && <p className="text-gray-600 mt-2 text-center">{quiz.description}</p>}
                        </CardHeader>
                        <CardBody className="p-8 flex flex-col items-center">
                            <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-blue-600 font-semibold mb-1">Duration</p>
                                    <p className="text-xl font-bold text-blue-900">{quiz.duration || 15} mins</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-green-600 font-semibold mb-1">Passing Score</p>
                                    <p className="text-xl font-bold text-green-900">{quiz.passingScore}%</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center col-span-2">
                                    <p className="text-sm text-purple-600 font-semibold mb-1">Total Questions</p>
                                    <p className="text-xl font-bold text-purple-900">{quiz.questions?.length || 0}</p>
                                </div>
                            </div>
                            <Button
                                className="bg-[#06574C] text-white px-8 py-6 text-lg font-semibold w-full max-w-sm shadow-lg hover:shadow-xl transition-all"
                                onPress={async () => {
                                    setIsQuizStarted(true);
                                    await toggleFullscreen();
                                }}
                            >
                                Start Quiz
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        if (isSubmitted && result) {
            return (
                <Card className="max-w-2xl mx-auto my-8">
                    <CardHeader className="flex flex-col items-center p-6 gap-2">
                        {result.passed ? (
                            <CheckCircle size={64} className="text-green-500" />
                        ) : (
                            <XCircle size={64} className="text-red-500" />
                        )}
                        <h2 className="text-2xl font-bold">{result.passed ? "Quiz Passed!" : "Quiz Failed"}</h2>
                        <p className="text-gray-600">You scored {result.score}% ({result.correctCount} out of {result.totalQuestions})</p>
                    </CardHeader>
                    <CardBody className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span>Passing Score: {quiz.passingScore}%</span>
                                <span className={result.passed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    Your Score: {result.score}%
                                </span>
                            </div>
                            <Progress 
                                value={result.score} 
                                color={result.passed ? "success" : "danger"} 
                                className="h-2"
                            />
                            <Divider />
                            <div className="pt-4 flex justify-center">
                                <Button 
                                    className="bg-[#06574C] text-white"
                                    onPress={() => window.location.reload()}
                                >
                                    Continue Course
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            );
        }

        return (
            <div className="max-w-3xl w-full mx-auto my-6 px-4">
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{quiz.title}</h2>
                        <p className="text-xs text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}`}>
                        <Timer size={18} />
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <Card className="shadow-md">
                    <CardHeader className="p-6">
                        <h3 className="text-xl font-semibold leading-tight">{currentQuestion.questionText}</h3>
                    </CardHeader>
                    <CardBody className="p-6 pt-0">
                        <RadioGroup
                            value={answers[currentQuestionIndex]?.toString()}
                            onValueChange={handleAnswerChange}
                            className="gap-4"
                        >
                            {currentQuestion.options.map((option, idx) => (
                                <Radio
                                    key={idx}
                                    value={idx.toString()}
                                    className="max-w-full w-full border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                >
                                    {option}
                                </Radio>
                            ))}
                        </RadioGroup>
                    </CardBody>
                    <Divider />
                    <div className="p-4 flex justify-between items-center bg-gray-50">
                        <Button
                            variant="flat"
                            isDisabled={currentQuestionIndex === 0}
                            onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        >
                            Previous
                        </Button>
                        {isLastQuestion ? (
                            <Button
                                className="bg-[#06574C] text-white"
                                onPress={handleSubmit}
                                isLoading={isSubmitting}
                                isDisabled={answers[currentQuestionIndex] === undefined}
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                isDisabled={answers[currentQuestionIndex] === undefined}
                            >
                                Next Question
                            </Button>
                        )}
                    </div>
                </Card>
                
                <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-sm text-orange-700">
                        <p className="font-semibold">Note:</p>
                        <p>You need a score of {quiz.passingScore}% or higher to pass this quiz and unlock the next lesson. Your progress will be saved automatically upon completion.</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div 
            ref={containerRef} 
            className={`w-full ${isFullscreen ? 'bg-gray-50 flex items-center justify-center min-h-screen py-10 overflow-y-auto' : ''}`}
        >
            {renderContent()}
        </div>
    );
};

export default QuizPlayer;
