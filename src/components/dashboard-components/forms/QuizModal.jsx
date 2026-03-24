import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Form } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import CourseSelect from "../../select/CourseSelect"; // Import CourseSelect
import { IntervalInput } from "../../../components/dashboard-components/forms/IntervalInput";

export default function QuizModal({
    isOpen,
    setIsOpen,
    courseId: initialCourseId,
    editingQuiz,
    onSaveSuccess,
    handleUpdateFile, // passed from ContentUpload if editing is supported
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || "");

    const [quizData, setQuizData] = useState({
        title: "",
        duration: "",
        description: "",
        passingScore: 70,
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]
    });

    // Sync editingQuiz to state when modal opens or editingQuiz changes
    useEffect(() => {
        if (isOpen) {
            if (editingQuiz) {
                setQuizData({
                    title: editingQuiz.title,
                    duration: editingQuiz.duration || "",
                    description: editingQuiz.description || "",
                    passingScore: editingQuiz.passingScore || 70,
                    questions: Array.isArray(editingQuiz.questions) ? editingQuiz.questions : [{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]
                });
            } else {
                resetForm();
            }
            if (initialCourseId) {
                setSelectedCourseId(initialCourseId);
            }
        }
    }, [isOpen, editingQuiz, initialCourseId]);

    const handleAddQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQs = quizData.questions.filter((_, i) => i !== index);
        setQuizData({ ...quizData, questions: newQs });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQs = [...quizData.questions];
        newQs[index][field] = value;
        setQuizData({ ...quizData, questions: newQs });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQs = [...quizData.questions];
        newQs[qIndex].options[oIndex] = value;
        setQuizData({ ...quizData, questions: newQs });
    };

    const resetForm = () => {
        setQuizData({
            title: "",
            duration: "",
            description: "",
            passingScore: 70,
            questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]
        });
        if (!initialCourseId) {
            setSelectedCourseId("");
        }
    };

    const handleSaveQuiz = async (e) => {
        e.preventDefault();
        if (!quizData.title || quizData.questions.length === 0) {
            errorMessage("Title and at least one question are required");
            return;
        }

        const effectiveCourseId = initialCourseId || selectedCourseId;

        if (!effectiveCourseId && !editingQuiz) {
            errorMessage("Please select a course for the quiz");
            return;
        }

        setIsSaving(true);
        try {
            if (editingQuiz && handleUpdateFile) {
                const res = await handleUpdateFile(editingQuiz.id, {
                    title: quizData.title,
                    duration: quizData.duration,
                    description: quizData.description,
                    passingScore: quizData.passingScore,
                    questions: quizData.questions,
                    totalQuestions: quizData.questions.length
                });
                successMessage("Quiz updated successfully");
                if (onSaveSuccess) onSaveSuccess(res, true); // true indicates it was an update
            } else {
                const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/course-files`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        courseId: effectiveCourseId,
                        title: quizData.title,
                        duration: quizData.duration,
                        description: quizData.description,
                        fileType: "quiz",
                        passingScore: quizData.passingScore,
                        questions: quizData.questions,
                        totalQuestions: quizData.questions.length
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    successMessage("Quiz created successfully");
                    if (onSaveSuccess) onSaveSuccess(data.file, false); // false indicates a new creation
                } else {
                    throw new Error(data.message || "Failed to create quiz");
                }
            }
            setIsOpen(false);
            resetForm();
        } catch (err) {
            errorMessage(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</ModalHeader>
                        <ModalBody className="w-full p-0 m-0">
                            <Form onSubmit={handleSaveQuiz} className="w-full px-3 sm:p-5">
                                <div className="space-y-4 w-full ">
                                    {!initialCourseId && !editingQuiz && (
                                        <div className="mb-4">
                                            <CourseSelect
                                                label="Select Course"
                                                value={selectedCourseId}
                                                onChange={(val) => setSelectedCourseId(val)}
                                            />
                                        </div>
                                    )}

                                    <div >
                                        <IntervalInput
                                            className="w-full "
                                            initialValue={quizData?.releasedAt}
                                            onUpdate={(interval) => setQuizData({ ...quizData, releasedAt: interval })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Duration (minutes)"
                                            type="number"
                                            value={quizData?.duration}
                                            onValueChange={(val) => setQuizData({ ...quizData, duration: val })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Quiz Title"
                                            value={quizData.title}
                                            onValueChange={(val) => setQuizData({ ...quizData, title: val })}
                                        />
                                        <Input
                                            label="Passing Score (%)"
                                            type="number"
                                            value={quizData.passingScore}
                                            onValueChange={(val) => setQuizData({ ...quizData, passingScore: val })}
                                        />
                                    </div>
                                    <Textarea
                                        label="Description"
                                        value={quizData.description}
                                        maxLength={500}
                                        onValueChange={(val) => setQuizData({ ...quizData, description: val })}
                                    />

                                    <div className="space-y-6 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Questions</h3>
                                            <Button size="sm" color="success" onPress={handleAddQuestion}>Add Question</Button>
                                        </div>

                                        {quizData.questions.map((q, qIndex) => (
                                            <div key={qIndex} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    className="absolute top-2 right-2"
                                                    onPress={() => handleRemoveQuestion(qIndex)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                                <Input
                                                    label={`Question ${qIndex + 1}`}
                                                    value={q.questionText}
                                                    classNames={{ label: 'z-0' }}
                                                    onValueChange={(val) => handleQuestionChange(qIndex, "questionText", val)}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIndex}`}
                                                                checked={q.correctAnswer === oIndex}
                                                                onChange={() => handleQuestionChange(qIndex, "correctAnswer", oIndex)}
                                                            />
                                                            <Input
                                                                variant="underlined"
                                                                size="sm"
                                                                placeholder={`Option ${oIndex + 1}`}
                                                                value={option}
                                                                className="flex-1"
                                                                onValueChange={(val) => handleOptionChange(qIndex, oIndex, val)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex w-full  sticky bottom-0 rounded-b-xl bg-white p-2 justify-end gap-2">
                                    <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                                    <Button className="bg-[#06574C] text-white" type="submit" isLoading={isSaving}>
                                        {editingQuiz ? "Update Quiz" : "Save Quiz"}
                                    </Button>
                                </div>
                            </Form>
                        </ModalBody>
                        {/* <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                                <Button className="bg-[#06574C] text-white" type="submit" isLoading={isSaving}>
                                    {editingQuiz ? "Update Quiz" : "Save Quiz"}
                                </Button>
                            </ModalFooter> */}
                    </>
                )}
                {/* </Form> */}
            </ModalContent>
        </Modal >
    );
}
