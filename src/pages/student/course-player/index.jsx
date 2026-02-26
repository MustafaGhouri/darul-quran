import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Chip, Avatar } from "@heroui/react";
import { ArrowLeft, PlayCircle, CheckCircle, Star } from "lucide-react";
import { useSelector } from "react-redux";

import { errorMessage, successMessage } from "../../../lib/toast.config";
import { useGetCourseFilesQuery, useAddRevieworUpdateMutation } from "../../../redux/api/courses";
import Loader from "../../../components/Loader";
import LessonFileViewer from "../../../components/dashboard-components/LessonViewer";
import RatingStars from "../../../components/RatingStar";
import QueryError from "../../../components/QueryError";

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const courseFromState = location.state || {};
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [isMarking, setIsMarking] = useState(false);
    const [progress, setProgress] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    const { user } = useSelector((state) => state.user);

    const { data, error, isLoading, isError,refetch } = useGetCourseFilesQuery({ courseId: id, page, search, includeCourse: !courseFromState?.id }, { skip: !id });
    const [addReview, { isLoading: isAddingReview }] = useAddRevieworUpdateMutation();

    const course = useMemo(() => {
        if (courseFromState?.id) return courseFromState;
        if (data?.course) return data.course;
        return null;
    }, [courseFromState, data]);
    const courseFiles = data?.results;
    const totalLessons = courseFromState?.totalLesson || data?.course?.totalLesson || 0;

    useEffect(() => {
        if (course?.id) {
            fetchEnrollment();
        }
    }, [course?.id, totalLessons]);


    const fetchEnrollment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/check-enrollment/${id}?checkIfReviewed=true`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.enrollment) {
                let cl = [];
                try {
                    cl = typeof data.enrollment.completedLessons === 'string'
                        ? JSON.parse(data.enrollment.completedLessons)
                        : data.enrollment.completedLessons || [];
                } catch (e) { cl = []; }
                setCompletedLessons(cl);
                const completedCount = data.enrollment.completedLessonsCount;
                const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                setExistingReview(data.review);
                setReviewRating(data.review.rating);
                setReviewDescription(data.review.description || '');
                setProgress(data.enrollment.progressStatus !== "not_started" ? percentage : 0);
            }
        } catch (e) { console.error(e); }
    };
    const handleVideoEnd = async () => {
        if (!currentLesson) return;
        const lid = currentLesson.id;
        setIsMarking(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/mark-complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ courseId: id, lessonId: lid })
            });
            const data = await res.json();
            if (data.success) {
                setCompletedLessons(data.completedLessons);
                const completedCount = data.completedCount;
                const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
                setProgress(percentage);
                successMessage("Lesson Completed!");
            }
        } catch (e) { console.error(e); errorMessage(e.message); }
        finally { setIsMarking(false); }
    };

    const handleReviewSubmit = async () => {
        if (!reviewRating || reviewRating < 1) {
            errorMessage("Please select a rating");
            return;
        }
        if (!reviewDescription || reviewDescription.trim().length < 10) {
            errorMessage("Please write a review (at least 10 characters)");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const userData = user || {};
            const reviewData = {
                description: reviewDescription.trim(),
                rating: reviewRating,
                email: userData.email || '',
                username: `${userData.firstName} ${userData.lastName}`.trim(),
                avatar: userData.avatar || user?.avatar || null,
                oldRating: existingReview?.rating || null,
            };

            const result = await addReview({ courseId: id, data: reviewData }).unwrap();

            if (result.success) {
                successMessage(existingReview ? "Review updated successfully!" : "Review submitted successfully!");
                setIsReviewModalOpen(false);
                setExistingReview({
                    ...existingReview,
                    rating: reviewRating,
                    description: reviewDescription.trim(),
                });
            }
        } catch (err) {
            console.error("Review submission error:", err);
            errorMessage(err?.data?.message || err?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const openReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        // Reset form if no existing review
        if (!existingReview) {
            setReviewRating(0);
            setReviewDescription('');
        }
    };

    if (isLoading && !course?.id) return <Loader />;

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b flex items-center px-4 justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="light" isIconOnly onPress={() => navigate("/student/dashboard")}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold truncate max-w-xl text-[#06574C]">{course?.courseName || 'Course'}</h1>
                        <span className="text-xs text-gray-500">Back to Dashboard</span>
                    </div>
                </div>
                <div>
                    <div className="text-sm font-medium text-[#06574C]">Your Progress: {progress}%</div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#06574C] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col overflow-y-auto bg-black/5">
                    <div className="bg-black w-full aspect-video shrink-0 relative shadow-lg">
                        {currentLesson ? (
                            <LessonFileViewer
                                file={currentLesson}
                                onEnded={handleVideoEnd}
                            />
                        ) : (
                            <LessonFileViewer
                                file={{
                                    url: course?.video,
                                    thumbnailUrl: course?.thumbnail,
                                    fileType: "video/mp4",
                                }}
                                autoPlay={false}
                            // onEnded={handleVideoEnd}
                            />
                        )}

                    </div>

                    <div className="p-6 max-w-4xl mx-auto w-full">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{currentLesson?.title || course?.courseName || 'Course Lesson'}</h2>
                        <div className="prose max-w-none text-gray-600 mb-8 p-4 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">About this {currentLesson?.id ? "lesson" : "course"}</h3>
                            <p className="whitespace-pre-wrap">
                                {currentLesson && currentLesson?.description ? currentLesson?.description : !currentLesson?.id ? course?.description : 'No description available for this lesson.'}</p>
                            {currentLesson?.id &&
                                <Button className="my-3" isLoading={isMarking} size="sm" color="success" onPress={handleVideoEnd}>
                                    {completedLessons.includes(currentLesson?.id) ? "Mark Uncomplete" : " Mark Complete"}
                                </Button>
                            }
                            {/* Review Button */}
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    className="bg-[#06574C] text-white"
                                    size="md"
                                    onPress={openReviewModal}
                                    startContent={<Star size={18} fill="currentColor" />}
                                >
                                    {existingReview ? "Update Your Review" : "Add a Review"}
                                </Button>
                                {existingReview && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Chip size="sm" variant="flat" className="bg-yellow-100 text-yellow-700">
                                            Your Rating: {existingReview.rating}/5
                                        </Chip>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-80 md:w-96 bg-white border-l flex flex-col shrink-0 shadow-lg z-0">
                    <div className="p-4 border-b font-bold text-lg bg-gray-50 text-[#06574C]">Course Content</div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isError &&
                            <QueryError
                                height="300px"
                                error={error}
                                onRetry={refetch}
                                showLogo={false}
                            />
                        }
                        {isLoading &&
                            <div className="text-center text-gray-500 mt-10 p-4">
                                <Spinner color="success" variant="dots" label="Loading Content..." />
                            </div>
                        }
                        {courseFiles?.length > 0 ? (
                            courseFiles.map((lesson, idx) => {
                                const lessonId = lesson.id || lesson.lessonId;
                                const isCompleted = completedLessons.includes(lessonId);
                                const isCurrentById = currentLesson && currentLesson.id === lessonId;
                                const isLocked = !lesson.url;
                                const releaseText = isLocked
                                    ? lesson.releasedAt && lesson.releasedAt !== "release_immediately"
                                        ? `Releases in ${lesson.releasedAt} after enrollment`
                                        : "Locked"
                                    : null;

                                return (
                                    <div
                                        key={lessonId || idx}
                                        onClick={() =>
                                            !isLocked &&
                                            setCurrentLesson(
                                                currentLesson?.id === lessonId ? null : lesson
                                            )
                                        }
                                        className={`p-3 rounded-lg cursor-pointer flex items-start gap-3 transition-all duration-200 border ${isCurrentById
                                            ? "bg-[#06574C]/10 border-[#06574C] shadow-sm transform scale-[1.02]"
                                            : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                                            } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="mt-1 shrink-0">
                                            {isCompleted ? (
                                                <CheckCircle size={18} className="text-green-500 fill-green-100" />
                                            ) : isCurrentById ? (
                                                <PlayCircle size={18} className="text-[#06574C]" />
                                            ) : (
                                                <PlayCircle size={18} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className={`text-sm font-semibold ${isCurrentById ? "text-[#06574C]" : "text-gray-700"
                                                    } ${isCompleted ? "line-through text-gray-400" : ""}`}
                                            >
                                                {lesson.name || lesson.title || `Lesson ${idx + 1}`}
                                            </div>
                                            <div className="flex max-sm:flex-wrap items-center gap-2 text-xs text-gray-400 mt-1">
                                                <span className="capitalize">
                                                    Type: {lesson?.fileType?.replace("_", " ") || "Video Lesson"}
                                                </span>
                                                {lesson?.file?.pages && <span>pages: {lesson.file.pages}</span>}
                                                {lesson?.file?.duration && lesson?.file?.duration !== "0" && (
                                                    <span>duration: {lesson.file.duration} mins</span>
                                                )}
                                            </div>
                                            {isLocked && releaseText && (
                                                <div className="text-xs text-orange-500 mt-1 italic">
                                                    {releaseText}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 mt-10 p-4">
                                {!isLoading && <p>No video lessons available for this course yet.</p>}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t bg-gray-50 text-xs text-center text-gray-400">
                        Darul Quran Online Learning
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isReviewModalOpen}
                onClose={closeReviewModal}
                scrollBehavior="inside"
                size="lg"
                classNames={{
                    base: "rounded-lg",
                    header: "border-b border-gray-200 bg-gradient-to-r from-[#06574C] to-[#0a7a6e]",
                    body: "py-6",
                    footer: "border-t border-gray-200"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">
                                <div className="flex items-center gap-2">
                                    <Star size={24} fill="currentColor" className="text-yellow-400" />
                                    <span>{existingReview ? "Update Your Review" : "Add a Review"}</span>
                                </div>
                                <p className="text-sm font-normal opacity-90">
                                    Share your experience with {course?.courseName || "this course"}
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Overall Rating *
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="transition-transform hover:scale-110 focus:outline-none"
                                                >
                                                    <span
                                                        className={`text-4xl ${star <= reviewRating
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {reviewRating > 0 && (
                                            <span className="text-lg font-medium text-gray-600">
                                                {reviewRating} out of 5
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Write Your Review *
                                    </label>
                                    <Textarea
                                        placeholder="What did you like or dislike about this course? How has it helped you?"
                                        value={reviewDescription}
                                        onChange={(e) => setReviewDescription(e.target.value)}
                                        minRows={5}
                                        maxRows={8}
                                        variant="bordered"
                                        classNames={{
                                            input: "text-base",
                                            innerWrapper: "bg-gray-50 rounded-lg",
                                        }}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">
                                            Minimum 10 characters
                                        </span>
                                        <span className={`text-xs ${reviewDescription.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                                            {reviewDescription.length} characters
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">Your review will be posted as:</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {`${user.firstName} ${user.lastName || ''}`.trim()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user?.email || user?.email || 'student@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="flex gap-2">
                                <Button
                                    variant="bordered"
                                    size="md"
                                    onPress={closeReviewModal}
                                    className="border-gray-300 text-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#06574C] text-white"
                                    size="md"
                                    onPress={handleReviewSubmit}
                                    isLoading={isSubmittingReview || isAddingReview}
                                    isDisabled={reviewRating < 1 || reviewDescription.trim().length < 10}
                                >
                                    {existingReview ? "Update Review" : "Submit Review"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CoursePlayer;