import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { Video } from "lucide-react";
import { LuClipboardList } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { PiFilePdf } from "react-icons/pi";
import Videos, {
  Assignments,
  PdfAndNotes,
} from "../../../components/dashboard-components/forms/ContentUpload";
import { GoLightBulb, GoRocket } from "react-icons/go";
import { useEffect, useState } from "react";
import CourseSelect from "../../../components/select/CourseSelect";
import { useGetCourseFilesQuery } from "../../../redux/api/courses";
import { useSearchParams } from "react-router-dom";
import QueryError from "../../../components/QueryError";

const UploadMaterial = () => {
  const [searchParams] = useSearchParams();
  const courseIdFromQuery = searchParams.get("courseId");
  const [files, setFiles] = useState([]);
  const [courseId, setCourseId] = useState(courseIdFromQuery || null);
  const { data, error, isLoading, refetch } = useGetCourseFilesQuery({ courseId, page: 1, search: "", includeCourse: false }, { skip: !courseId  });
  useEffect(() => {
    if (data?.results) {
      setFiles(data?.results);
    }
  }, [data?.results]);

  const cardsData = [
    {
      title: "Videos ",
      value: (files?.filter((f) => f.fileType === "lesson_video")).length || 0,
      icon: <Video color="#06574C" size={22} />,
      // changeText: "8%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "PDFs",
      value: (files?.filter((f) => f.fileType === "pdf_notes")).length || 0,
      icon: <PiFilePdf color="#06574C" size={22} />,
      // changeText: "5%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Quizzes",
      value: 0,
      icon: <GoLightBulb color="#06574C" size={22} />,
      // changeText: "12%",
      changeColor: "text-[#E8505B]",
    },
    {
      title: "Assignment",
      value: (files?.filter((f) => f.fileType === "assignments")).length || 0,
      icon: <LuClipboardList color="#06574C" size={22} />,
      // changeText: "-0%",
      changeColor: "text-[#9A9A9A]",
    },
  ];

  if (error) {
    return <QueryError
      height="300px"
      error={error}
      onRetry={refetch}
      showLogo={false}
    />
  }

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"Upload Materials"}
        desc={"Manage all your teaching materials easily from here"}
      />
      <div className="pb-4 gap-5  overflow-x-auto grid grid-cols-1 sm:grid-cols-4">
        {cardsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#F1E0D9] sm:bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4"
          >
            <h1 className="font-semibold text-[#333333]">{item.title}</h1>

            <div className="flex items-center gap-2 justify-start">
              <div className="rounded-full p-3 bg-[#95C4BE]/20">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className={`${item.changeColor} text-sm`}>
                  {item.changeText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!courseIdFromQuery && <div className="bg-white rounded-lg mb-3 p-4">
        <div className="">
          <h1 className="text-xl font-semibold">Course</h1>
        </div>
        <div className="flex flex-col md:flex-row md gap-3 items-center pt-4">
          <CourseSelect
            onChange={(id) => setCourseId(id)}
          />
        </div>
      </div>}
      <Videos
        courseId={courseId}
        files={files}
        setFiles={setFiles}
      />
      <PdfAndNotes
        courseId={courseId}
        files={files}
        setFiles={setFiles}
      />
      <Assignments
        courseId={courseId}
        files={files}
        setFiles={setFiles}
      />

      <div className="p-5 my-5 bg-[#95C4BE33] rounded-md flex justify-between items-center">
        <div>
          <h1 className="text-[#06574C] font-medium text-lg">
            Ready to publish?
          </h1>
          <h1 className="text-[#06574C] font-medium text-sm">
            Review your materials before making them available to students
          </h1>
        </div>
      </div>
      <div className="p-3 my-5 flex flex-col md:flex-row md:justify-end gap-3">
        <Button
          variant="bordered"
          size="lg"
          radius="sm"
          color="success"
          startContent={<IoEyeOutline size={20} />}
        >
          Preview All
        </Button>
        <Button
          size="lg"
          radius="sm"
          variant="flat"
          className="bg-[#06574C] text-white"
          startContent={<GoRocket size={20} />}
        >
          Pusblish Course
        </Button>
      </div>
    </div>
  );
};

export default UploadMaterial;
