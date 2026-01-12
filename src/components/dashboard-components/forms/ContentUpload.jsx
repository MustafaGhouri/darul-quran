import { useState, useRef } from "react";
import { Plus, Download, Trash2, Eye, Clock, Menu, Edit, ClipboardListIcon, List } from "lucide-react";
import FileDropzone from "../dropzone";
import { Button, Image, Select, SelectItem } from "@heroui/react";
import { PiFile, PiFilePdf } from "react-icons/pi";
import { UploadDropzone } from "../../../lib/uploadthing";

const LESSONS = [
    {
        id: 1,
        title: "1. Introduction to HTML Basics",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        duration: "45:30",
        views: 12234,
        thumbnail: "/images/lesson-example.png",
        status: "immediate",
        releaseDate: "0",
    },
    {
        id: 2,
        title: "1. Introduction to HTML Basics",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        duration: "45:30",
        views: 12234,
        thumbnail: "/images/lesson-example.png",
        status: "scheduled",
        releaseDate: "3",
    },
];

export default function Videos({ videoUrl, setVideoUrl }) {
    const [lessons, setLessons] = useState(LESSONS);
    const [lessonsFiles, setLessonsFiles] = useState([]);

    const deleteLesson = (id) => {
        setLessons(lessons.filter((lesson) => lesson.id !== id));
    };
    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    const AtachOrNot = [
        { key: "true", label: "Attach To Lesson" },
        { key: "false", label: "Deattach To Lesson" },
    ];
    const hideBtn = window.location.pathname === "/teacher/courses/upload-material" ? "hidden" : "";
    return (
        <div className=" bg-white rounded-lg my-2 w-full">
            {/* Header */}
            <div className="">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Lesson Videos</h1>
                            <div className="mt-2 flex flex-col gap-2 text-md font-semibold text-gray-600 sm:flex-row sm:items-center sm:gap-2">
                                <span className="flex items-center gap-1">
                                    <Menu />
                                    Total Lessons: 48
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1">Total Duration: 40h 15m</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                radius="sm"
                                variant="bordered"
                                className={`border-[#06574C] border-2 text-[#06574C] ${hideBtn}`}
                                startContent={<Download className="h-4 w-4" />}
                            >
                                Download
                            </Button>
                            <Button
                                radius="sm"
                                variant="solid"
                                className="bg-[#06574C] text-white"
                                startContent={<Plus className="h-4 w-4" />}
                            >
                                Upload Video
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className={`rounded-lg p-4 sm:p-6 transition-all ${lesson.status === "scheduled"
                                ? "bg-[#F5E3DA]"
                                : "bg-[#95C4BE33] "
                                }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                <div className="shrink-0">
                                    <div className="relative">
                                        <img
                                            src={lesson.thumbnail}
                                            alt={lesson.title}
                                            className="h-24 w-full rounded-lg border border-gray-300 object-cover sm:h-28 sm:w-48"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                            <svg
                                                className="h-12 w-12 hover:opacity-65 duration-300 cursor-pointer sm:h-14 sm:w-14"
                                                viewBox="0 0 57 57"
                                                fill="none"
                                            >
                                                <circle cx="28.5" cy="28.5" r="28.5" fill="#62a39b" fillOpacity="0.77" />
                                                <path
                                                    d="M41.8124 31.8938C42.182 31.6109 42.4812 31.2481 42.6871 30.8331C42.893 30.4182 43 29.9622 43 29.5C43 29.0378 42.893 28.5818 42.6871 28.1669C42.4812 27.7519 42.182 27.3891 41.8124 27.1062C37.0251 23.4448 31.6802 20.5582 25.9773 18.5543L24.9345 18.188C22.9415 17.4885 20.8352 18.8212 20.5653 20.8565C19.8116 26.5947 19.8116 32.4053 20.5653 38.1435C20.8368 40.1788 22.9415 41.5115 24.9345 40.812L25.9773 40.4457C31.6802 38.4418 37.0251 35.5552 41.8124 31.8938Z"
                                                    fill="#06574C"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col justify-between gap-3">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{lesson.title}</h3>
                                        <p className="text-sm text-gray-600 sm:text-base">{lesson.description}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {lesson.duration}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {lesson.views.toLocaleString()} views
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <Select
                                        radius="sm"
                                        className="w-50"
                                        variant="bordered"
                                        defaultSelectedKeys={[lesson.releaseDate]}
                                        placeholder="Select Schedule"
                                    >
                                        {Interval.map((filter) => (
                                            <SelectItem key={filter.key}>{filter.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            color="default"
                                            isIconOnly
                                            className="bg-white"
                                        >
                                            <Edit color="#06574C" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            isIconOnly
                                            color="danger"
                                            onPress={() => deleteLesson(lesson.id)}
                                        >
                                            <Trash2 color="#fb2c36" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <FileDropzone
                    label="Drag & Drop Your Files Here"
                    text="or click to browse and select files"
                    files={lessonsFiles}
                    uploadBgColor="#ffff"
                    setFiles={setLessonsFiles}
                /> */}
                {videoUrl ? (
                          <div className="relative w-full  overflow-hidden rounded-lg">
                            <video
                              removeWrapper
                              className="w-full h-full aspect-16/7 object-cover"
                              src={videoUrl}
                              controls
                              autoPlay
                              loop
                              alt="Video Preview"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-red-500 text-white z-10"
                              onPress={() => setVideoUrl("")}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 relative"
                            endpoint="videoUploader"
                            appearance={{
                              container: {
                                width: "100%",
                                height: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                              },
                              button: {
                                position: "absolute",
                                bottom: "3rem",
                                background: "#06574C",
                                color: "white",
                                marginTop: "1rem", // Add spacing if needed
                              },
                              label: {
                                color: "#06574C",
                              },
                            }}
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              if (res && res.length > 0) {
                                setVideoUrl(res[0].url);
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
                              // Do something with the error.
                              toast.error("ERROR! " + error.message);
                            }}
                          />
                        )}
            </div>


        </div>
    );
}


const DOCUMENTS = [
    {
        id: 1,
        title: "HTML Cheat Sheet",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        size: "2.4 MB",
        pages: 8,
        url: "/example.pdf",
        status: "immediate",
        releaseDate: "0",
        doc_type: 'pdf'
    },
    {
        id: 2,
        title: "HTML Cheat Sheet",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        size: "2.4 MB",
        pages: 8,
        url: "/example.csv",
        status: "scheduled",
        releaseDate: "3",
        doc_type: 'note'
    },
];

export function PdfAndNotes({ pdfUrl, setPdfUrl }) {
    const [documents, setDocuments] = useState(DOCUMENTS);
    const [documentsFiles, setDocumentsFiles] = useState([]);

    const deleteDocument = (id) => {
        setDocuments(documents.filter((document) => document.id !== id));
    };
    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    const AtachOrNot = [
        { key: "true", label: "Attach To Lesson" },
        { key: "false", label: "Deattach To Lesson" },
    ];
    return (
        <div className=" bg-white rounded-lg my-2 w-full">
            <div className="">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">PDFs & Notes</h1>

                        </div>

                        <Button
                            radius="sm"
                            variant="solid"
                            className="bg-[#06574C] text-white"
                            startContent={<Plus className="h-4 w-4" />}
                        >
                            Upload PDF/Notes
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {documents.map((document) => (
                        <div
                            key={document.id}
                            className={`rounded-lg p-4 sm:p-6 transition-all ${document.status === "scheduled"
                                ? "bg-[#F5E3DA]"
                                : "bg-[#95C4BE33] "
                                }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                {document.doc_type === 'pdf' ?
                                    <PiFilePdf color="#06574C" className="bg-[#F5F5F5] p-3 rounded-full size-16" />
                                    :
                                    <PiFile color="#06574C" className="bg-[#F5F5F5] p-3 rounded-full size-16" />
                                }

                                <div className="flex flex-1 flex-col justify-betwesen gap-3">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{document.title}</h3>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1">
                                            {/* <Clock className="h-4 w-4" /> */}
                                            {document.size}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {document.pages.toLocaleString()} Pages
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <Select
                                        radius="sm"
                                        className="w-50"
                                        variant="bordered"
                                        defaultSelectedKeys={[document.releaseDate]}
                                        placeholder="Select Schedule"
                                    >
                                        {Interval.map((filter) => (
                                            <SelectItem key={filter.key}>{filter.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            color="default"
                                            isIconOnly
                                            className="bg-white"
                                        >
                                            <Edit color="#06574C" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            isIconOnly
                                            color="danger"
                                            onPress={() => deleteDocument(document.id)}
                                        >
                                            <Trash2 color="#fb2c36" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <FileDropzone
                    label="Drag & Drop Your Files Here"
                    text="or click to browse and select files"
                    files={documentsFiles}
                    uploadBgColor="#ffff"
                    setFiles={setDocumentsFiles}
                /> */}
                {pdfUrl ? (
                          <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                            <iframe
                              removeWrapper
                              className="w-full h-full object-cover"
                              src={pdfUrl}
                              alt="PDF Preview"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-red-500 text-white z-10"
                              onPress={() => setPdfUrl("")}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 relative"
                            endpoint="pdfUploader"
                            appearance={{
                              container: {
                                width: "100%",
                                height: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                              },
                              button: {
                                position: "absolute",
                                bottom: "3rem",
                                background: "#06574C",
                                color: "white",
                                marginTop: "1rem", // Add spacing if needed
                              },
                              label: {
                                color: "#06574C",
                              },
                            }}
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              if (res && res.length > 0) {
                                setPdfUrl(res[0].url);
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
                              // Do something with the error.
                              toast.error("ERROR! " + error.message);
                            }}
                          />
                        )}
            </div>
        </div>
    );
}

const ASSIGNMENTS = [
    {
        id: 1,
        title: "1. Introduction to HTML Basics",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        due: '7 days',
        thumbnail: "/images/lesson-example.png",
        status: "immediate",
        releaseDate: "0",
    },
    {
        id: 2,
        title: "1. Introduction to HTML Basics",
        title2: "Build Your First Webpage",
        description: "Learn the fundamentals of HTML structure and semantic elements",
        due: "7 days",
        thumbnail: "/images/lesson-example.png",
        status: "scheduled",
        releaseDate: "3",
    },
];
export function Assignments({ assignmentUrl, setAssignmentUrl }) {
    const [asignments, setAssignments] = useState(ASSIGNMENTS);
    const [asignmentsFiles, setAsignmentsFiles] = useState([]);

    const deleteAsignment = (id) => {
        setAssignments(asignments.filter((asignment) => asignment.id !== id));
    };
    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    const AtachOrNot = [
        { key: "true", label: "Attach To Lesson" },
        { key: "false", label: "Deattach To Lesson" },
    ];
    
    const changetitle = window.location.pathname === "/teacher/courses/upload-material";
    return (
        <div className=" bg-white rounded-lg my-2 w-full">
            <div className="">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Assignments</h1>
                        </div>


                        <Button
                            radius="sm"
                            variant="solid"
                            className="bg-[#06574C] text-white"
                            startContent={<Plus className="h-4 w-4" />}
                        >
                            Add Assignment
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {asignments.map((asignment) => (
                        <div
                            key={asignment.id}
                            className={`rounded-lg p-4 sm:p-6 transition-all ${asignment.status === "scheduled"
                                ? "bg-[#F5E3DA]"
                                : "bg-[#95C4BE33] "
                                }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                <span className="bg-[#F5F5F5] p-2 flex justify-center items-center rounded-full size-16">
                                    <ClipboardListIcon size={35} color="#06574C" />
                                </span>

                                <div className="flex flex-1 flex-col justify-between gap-3">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{
                                            changetitle ? 
                                            <p>{asignment.title2}</p> 
                                            : <p>{asignment.title} </p> 
                                            }</h3>
                                        <p className="text-sm text-gray-600 sm:text-base">
                                            Due: {asignment.due} After Enrollment
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-wrap items-center">
                                    <Select
                                        radius="sm"
                                        className="w-50"
                                        variant="bordered"
                                        defaultSelectedKeys={[asignment.releaseDate]}
                                        placeholder="Select Schedule"
                                    >
                                        {Interval.map((filter) => (
                                            <SelectItem key={filter.key}>{filter.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            color="default"
                                            isIconOnly
                                            className="bg-white"
                                        >
                                            <Edit color="#06574C" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            isIconOnly
                                            color="danger"
                                            onPress={() => deleteAsignment(asignment.id)}
                                        >
                                            <Trash2 color="#fb2c36" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <FileDropzone
                    label="Drag & Drop Your Files Here"
                    text="or click to browse and select files"
                    files={asignmentsFiles}
                    uploadBgColor="#ffff"
                    setFiles={setAsignmentsFiles}
                /> */}
                {assignmentUrl ? (
                          <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                            <Image
                              removeWrapper
                              className="w-full h-full object-cover"
                              src={assignmentUrl}
                              alt="Assignment Preview"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-red-500 text-white z-10"
                              onPress={() => setAssignmentUrl("")}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 relative"
                            endpoint="imageUploader"
                            appearance={{
                              container: {
                                width: "100%",
                                height: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                              },
                              button: {
                                position: "absolute",
                                bottom: "3rem",
                                background: "#06574C",
                                color: "white",
                                marginTop: "1rem", // Add spacing if needed
                              },
                              label: {
                                color: "#06574C",
                              },
                            }}
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              if (res && res.length > 0) {
                                setAssignmentUrl(res[0].url);
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
                              // Do something with the error.
                              toast.error("ERROR! " + error.message);
                            }}
                          />
                        )}
            </div>


        </div>
    );
}

const QUIZZES = [
    {
        id: 1,
        title: "HTML Basics Quiz",
        description: "Test your understanding of HTML fundamentals",
        duration: "15",
        question: 10,
        thumbnail: "/images/lesson-example.png",
        status: "immediate",
        passing: 70,
        is_attached: false,
    },
    {
        id: 2,
        title: "HTML Basics Quiz",
        description: "Test your understanding of HTML fundamentals",
        duration: "15",
        question: 10,
        thumbnail: "/images/lesson-example.png",
        status: "scheduled",
        passing: 70,
        is_attached: true,
    },
];
export function Quizzes({ quizUrl, setQuizUrl }) {
    const [quizzes, setQuizzes] = useState(QUIZZES);
    const [quizzesFiles, setQuizzesFiles] = useState([]);

    const deleteQuiz = (id) => {
        setQuizzes(quizzesFiles.filter((quizzes) => quizzes.id !== id));
    };
    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    const AtachOrNot = [
        { key: "true", label: "Attach To Lesson" },
        { key: "false", label: "Deattach To Lesson" },
    ];
    return (
        <div className=" bg-white rounded-lg my-2 w-full">
            {/* Header */}
            <div className="">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Course Quizzes</h1>

                        </div>


                        <Button
                            radius="sm"
                            variant="solid"
                            className="bg-[#06574C] text-white"
                            startContent={<Plus className="h-4 w-4" />}
                        >
                            Course Qiuz
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className={`rounded-lg p-4 sm:p-6 transition-all ${quiz.status === "scheduled"
                                ? "bg-[#F5E3DA]"
                                : "bg-[#95C4BE33] "
                                }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                <span className="bg-[#F5F5F5] p-2 flex justify-center items-center rounded-full size-16">
                                    <img src="/icons/quiz-buld.png" title="quiz bulb" alt="quiz bulb" />
                                </span>

                                <div className="flex flex-1 flex-col justify-between gap-3">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{quiz.title}</h3>
                                        <p className="text-sm text-gray-600 sm:text-base">{quiz.description}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1">
                                            <List />
                                            {quiz.question.toLocaleString()} Questions
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {quiz.duration} minutes
                                        </span>
                                        <Button
                                            radius="sm"
                                            size="sm"
                                            className="bg-white text-[#06574C]"
                                        >
                                            Passing {quiz.passing.toLocaleString()}%
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <Select
                                        radius="sm"
                                        className="w-50"
                                        variant="bordered"
                                        defaultSelectedKeys={[`${quiz.is_attached}`]}
                                        placeholder="Select Schedule"
                                    >
                                        {AtachOrNot.map((filter) => (
                                            <SelectItem key={filter.key}>{filter.label}</SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            color="default"
                                            isIconOnly
                                            className="bg-white"
                                        >
                                            <Edit color="#06574C" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            radius="sm"
                                            variant="flat"
                                            isIconOnly
                                            color="danger"
                                            onPress={() => deleteQuiz(quiz.id)}
                                        >
                                            <Trash2 color="#fb2c36" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <FileDropzone
                    label="Drag & Drop Your Files Here"
                    text="or click to browse and select files"
                    files={quizzesFiles}
                    uploadBgColor="#ffff"
                    setFiles={setQuizzesFiles}
                /> */}
                    {quizUrl ? (
                          <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                            <Image
                              removeWrapper
                              className="w-full h-full object-cover"
                              src={quizUrl}
                              alt="Quiz Preview"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-red-500 text-white z-10"
                              onPress={() => setQuizUrl("")}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 relative"
                            endpoint="imageUploader"
                            appearance={{
                              container: {
                                width: "100%",
                                height: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white",
                              },
                              button: {
                                position: "absolute",
                                bottom: "3rem",
                                background: "#06574C",
                                color: "white",
                                marginTop: "1rem", // Add spacing if needed
                              },
                              label: {
                                color: "#06574C",
                              },
                            }}
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              if (res && res.length > 0) {
                                setQuizUrl(res[0].url);
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
                              // Do something with the error.
                              toast.error("ERROR! " + error.message);
                            }}
                          />
                        )}
            </div>


        </div>
    );
}
