import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Download, Trash2, Eye, Clock, Menu, Edit, ClipboardListIcon, List, Loader } from "lucide-react";
import FileDropzone from "../dropzone";
import { Button, Image, Select, SelectItem } from "@heroui/react";
import { PiFile, PiFilePdf } from "react-icons/pi";
import { UploadDropzone, useUploadThing } from "../../../lib/uploadthing";

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
];

const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
};

const getVideoDuration = (file) => {
    return new Promise((resolve) => {
        try {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = function () {
                resolve(0);
            };
            video.src = URL.createObjectURL(file);
        } catch (e) {
            resolve(0);
        }
    });
};

export default function Videos({ videos = [], setVideos, onSave, courseId, setLoadingAction, setPendingAction }) {
    const { startUpload, isUploading } = useUploadThing("videoUploader");
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleContentSave = async (field, contentData) => {
        if (!courseId) return;
        try {
            const payload = { [field]: contentData };
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/updateCourse/${courseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                toast.success("Saved to database");
            } else {
                console.error("Auto-save failed");
            }
        } catch (error) { console.error(error); }
    };

    // Calculate Total Duration
    const totalDurationSeconds = videos.reduce((acc, curr) => {
        const parts = (curr.duration || "").toString().split(" ");
        let sec = 0;
        parts.forEach(p => {
            if (p.endsWith("h")) sec += parseInt(p) * 3600;
            else if (p.endsWith("m")) sec += parseInt(p) * 60;
            else if (p.endsWith("s")) sec += parseInt(p);
        });
        return acc + sec;
    }, 0);

    const displayTotalDuration = formatTime(totalDurationSeconds);

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploadProgress(0);

        const filesWithMeta = await Promise.all(files.map(async (file) => {
            const d = await getVideoDuration(file);
            return { file, duration: formatTime(d) };
        }));

        // Simulated Progress since native callback is not reliable
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 500);

        try {
            const res = await startUpload(filesWithMeta.map(f => f.file));

            clearInterval(interval);
            setUploadProgress(100);

            if (res) {
                const newItems = res.map((r, i) => ({
                    id: Date.now() + i + Math.random(),
                    title: r.name,
                    thumbnail: r.url,
                    duration: filesWithMeta[i].duration,
                    views: 0,
                    status: "Draft",
                    releaseDate: "0"
                }));
                const updatedList = [...videos, ...newItems];
                setVideos(updatedList);
                if (onSave) onSave(updatedList);
                toast.success("Videos uploaded");
            }
        } catch (e) {
            toast.error("Upload error");
        } finally {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const updateLesson = (id, field, value) => {
        const updatedList = videos.map((lesson) =>
            lesson.id === id ? { ...lesson, [field]: value } : lesson
        );
        setVideos(updatedList);
        if (onSave) onSave(updatedList);
    };

    const deleteLesson = (id) => {
        setVideos(videos.filter((lesson) => lesson.id !== id));
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
                                    Total Lessons: {videos.length}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1">Total Duration: {displayTotalDuration}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                radius="sm"
                                variant="bordered"
                                className={`border-[#06574C] border-2 text-[#06574C] ${hideBtn}`}
                                startContent={<Download className="h-4 w-4" />}
                                onPress={() => {
                                    if (videos.length === 0) {
                                        toast.error("No videos to download");
                                        return;
                                    }
                                    videos.forEach((v) => {
                                        if (v.thumbnail) window.open(v.thumbnail, "_blank");
                                    });
                                }}
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {videos.map((lesson) => (
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
                                        {lesson.thumbnail && (lesson.thumbnail.includes("utfs.io") || lesson.thumbnail.match(/\.(mp4|webm|ogg)$/i)) ? (
                                            <video
                                                src={lesson.thumbnail}
                                                className="h-24 w-full rounded-lg border border-gray-300 object-cover sm:h-28 sm:w-48"
                                                autoPlay
                                                controls
                                                muted
                                                loop
                                            // playsInline
                                            // onMouseEnter={(e) => e.target.play()}
                                            // onMouseLeave={(e) => {
                                            //     e.target.pause();
                                            //     e.target.currentTime = 0;
                                            // }}
                                            // onLoadedData={(e) => {
                                            //     e.target.play();
                                            // }}
                                            />
                                        ) : (
                                            <img
                                                src={lesson.thumbnail}
                                                alt={lesson.title}
                                                className="h-24 w-full rounded-lg border border-gray-300 object-cover sm:h-28 sm:w-48"
                                            />
                                        )}
                                        {/* <div className="absolute inset-0 flex items-center justify-center rounded-lg">
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
                                        </div> */}
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
                                        selectedKeys={[lesson.releaseDate]}
                                        onSelectionChange={(keys) => updateLesson(lesson.id, "releaseDate", Array.from(keys)[0])}
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
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Video</h3>
                    {isUploading ? (
                        <div className="w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4">
                            <Loader className="animate-spin h-8 w-8 text-[#06574C] mb-2" />
                            <div className="w-full max-w-md flex justify-between text-gray-600 mb-1 text-sm font-medium">
                                <span>Uploading videos...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#06574C] transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <FileDropzone
                            files={[]}
                            setFiles={handleUpload}
                            label="Drag & Drop Videos"
                            text="or click to upload. Supports multiple files."
                            height="300px"
                            isMultiple={true}
                        />
                    )}
                </div>
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

export function PdfAndNotes({ pdfs = [], setPdfs, onSave }) {
    const { startUpload } = useUploadThing("pdfUploader");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const updateDocument = (id, field, value) => {
        const updatedList = pdfs.map((doc) =>
            doc.id === id ? { ...doc, [field]: value } : doc
        );
        setPdfs(updatedList);
        if (onSave) onSave(updatedList);
    };

    const deleteDocument = (id) => {
        const updatedList = pdfs.filter((document) => document.id !== id);
        setPdfs(updatedList);
        if (onSave) onSave(updatedList);
    };

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(0);

        // Simulated Progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 500);

        try {
            const res = await startUpload(files);

            clearInterval(interval);
            setUploadProgress(100);

            if (res) {
                const newDocs = res.map((r, i) => ({
                    id: Date.now() + i + Math.random(),
                    title: r.name,
                    size: (r.size / 1024 / 1024).toFixed(2) + " MB",
                    pages: 0,
                    url: r.url,
                    status: "Draft",
                    releaseDate: "0",
                    doc_type: 'pdf'
                }));
                const updatedList = [...pdfs, ...newDocs];
                setPdfs(updatedList);
                if (onSave) onSave(updatedList);
                toast.success("PDF(s) Uploaded");
            }
        } catch (e) {
            toast.error("Upload error");
        } finally {
            clearInterval(interval);
            setTimeout(() => {
                setUploadProgress(0);
                setIsUploading(false);
            }, 1000);
        }
    };

    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    // const AtachOrNot = [
    //     { key: "true", label: "Attach To Lesson" },
    //     { key: "false", label: "Deattach To Lesson" },
    // ];

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
                            className="bg-white text-[#06574C] border border-[#06574C]"
                            startContent={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {pdfs.map((document) => (
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
                                        selectedKeys={[document.releaseDate]}
                                        onSelectionChange={(keys) => updateDocument(document.id, "releaseDate", Array.from(keys)[0])}
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

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF/Notes</h3>
                    {isUploading ? (
                        <div className="w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4">
                            <Loader className="animate-spin h-8 w-8 text-[#06574C] mb-2" />
                            <div className="w-full max-w-md flex justify-between text-gray-600 mb-1 text-sm font-medium">
                                <span>Uploading files...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#06574C] transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <FileDropzone
                            files={[]}
                            setFiles={handleUpload}
                            label="Drag & Drop PDF/Notes"
                            text="or click to upload. Supports multiple files."
                            height="300px"
                            isMultiple={true}
                        />
                    )}
                </div>
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
export function Assignments({ assignments = [], setAssignments, onSave }) {
    const { startUpload } = useUploadThing("pdfUploader");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const updateAssignment = (id, field, value) => {
        const updatedList = assignments.map((assign) =>
            assign.id === id ? { ...assign, [field]: value } : assign
        );
        setAssignments(updatedList);
        if (onSave) onSave(updatedList);
    };

    const deleteAssignment = (id) => {
        const updatedList = assignments.filter((assign) => assign.id !== id);
        setAssignments(updatedList);
        if (onSave) onSave(updatedList);
    };

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(0);

        // Simulated Progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 500);

        try {
            const res = await startUpload(files);

            clearInterval(interval);
            setUploadProgress(100);

            if (res) {
                const newAssigns = res.map((r, i) => ({
                    id: Date.now() + i + Math.random(),
                    title: r.name,
                    title2: r.name,
                    description: "Uploaded File",
                    due: "7 days",
                    thumbnail: r.url, // storing URL
                    status: "Draft",
                    releaseDate: "0"
                }));
                const updatedList = [...assignments, ...newAssigns];
                setAssignments(updatedList);
                if (onSave) onSave(updatedList);
                toast.success("Assignment(s) Uploaded");
            }
        } catch (e) {
            toast.error("Upload error");
        } finally {
            clearInterval(interval);
            setTimeout(() => {
                setUploadProgress(0);
                setIsUploading(false);
            }, 1000);
        }
    };

    const Interval = [
        { key: "0", label: "Release Immediately" },
        { key: "1", label: "After 1 Days" },
        { key: "3", label: "After 3 Days" },
    ];
    // const AtachOrNot = [
    //     { key: "true", label: "Attach To Lesson" },
    //     { key: "false", label: "Deattach To Lesson" },
    // ];

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
                            className="bg-white text-[#06574C] border border-[#06574C]"
                            startContent={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-2 pb-3 sm:px-4">
                <div className="space-y-4 my-4">
                    {assignments.map((asignment) => (
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
                                        selectedKeys={[asignment.releaseDate]}
                                        onSelectionChange={(keys) => updateAssignment(asignment.id, "releaseDate", Array.from(keys)[0])}
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
                                            onPress={() => deleteAssignment(asignment.id)}
                                        >
                                            <Trash2 color="#fb2c36" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Assignment</h3>
                    {isUploading ? (
                        <div className="w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4">
                            <Loader className="animate-spin h-8 w-8 text-[#06574C] mb-2" />
                            <div className="w-full max-w-md flex justify-between text-gray-600 mb-1 text-sm font-medium">
                                <span>Uploading files...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#06574C] transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <FileDropzone
                            files={[]}
                            setFiles={handleUpload}
                            label="Drag & Drop Assignment Files"
                            text="or click to upload. Supports multiple files."
                            height="300px"
                            isMultiple={true}
                        />
                    )}
                </div>
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
export function Quizzes({ quizzes = [], setQuizzes, onSave }) {
    const { startUpload } = useUploadThing("pdfUploader");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const updateQuiz = (id, field, value) => {
        const updatedList = quizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, [field]: value } : quiz
        );
        setQuizzes(updatedList);
        if (onSave) onSave(updatedList);
    };

    const deleteQuiz = (id) => {
        const updatedList = quizzes.filter((quiz) => quiz.id !== id);
        setQuizzes(updatedList);
        if (onSave) onSave(updatedList);
    };

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(0);

        // Simulated Progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 500);

        try {
            const res = await startUpload(files);

            clearInterval(interval);
            setUploadProgress(100);

            if (res) {
                const newQs = res.map((r, i) => ({
                    id: Date.now() + i + Math.random(),
                    title: r.name,
                    description: "Uploaded Quiz File",
                    duration: "15",
                    question: 0,
                    thumbnail: r.url,
                    status: "Draft",
                    passing: 70,
                    is_attached: false,
                    releaseDate: "0"
                }));
                const updatedList = [...quizzes, ...newQs];
                setQuizzes(updatedList);
                if (onSave) onSave(updatedList);
                toast.success("Quiz(s) Uploaded");
            }
        } catch (e) {
            toast.error("Upload error");
        } finally {
            clearInterval(interval);
            setTimeout(() => {
                setUploadProgress(0);
                setIsUploading(false);
            }, 1000);
        }
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
                            className="bg-white text-[#06574C] border border-[#06574C]"
                            startContent={<Download className="h-4 w-4" />}
                        >
                            Download
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
                                            {// quiz.question might be number, so toLocaleString safe if number
                                                Number(quiz.question || 0).toLocaleString()
                                            } Questions
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
                                        selectedKeys={[`${quiz.is_attached}`]}
                                        onSelectionChange={(keys) => updateQuiz(quiz.id, "is_attached", Array.from(keys)[0] === 'true')}
                                        placeholder="Attach?"
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

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Quiz</h3>
                    {isUploading ? (
                        <div className="w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4">
                            <Loader className="animate-spin h-8 w-8 text-[#06574C] mb-2" />
                            <div className="w-full max-w-md flex justify-between text-gray-600 mb-1 text-sm font-medium">
                                <span>Uploading files...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div
                                className="h-full bg-[#06574C] transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    ) : (
                        <FileDropzone
                            files={[]}
                            setFiles={handleUpload}
                            label="Drag & Drop Quiz Files"
                            text="or click to upload. Supports multiple files."
                            height="300px"
                            isMultiple={true}
                        />
                    )}
                </div>
            </div>


        </div>
    );
}
