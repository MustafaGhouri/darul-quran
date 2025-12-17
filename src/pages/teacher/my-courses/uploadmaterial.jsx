import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { Clock, Download, MapPin, Plus, UsersRound, Video } from "lucide-react";
import { AiOutlineBook, AiOutlineCheck, AiOutlineLineChart } from "react-icons/ai";
import { LuClipboardList, LuSquareArrowOutUpRight } from "react-icons/lu";
import { RiDeleteBin6Line, RiGroupLine } from "react-icons/ri";
import { IoBulbOutline, IoEyeOutline } from "react-icons/io5";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { PiFilePdf, PiFilePdfDuotone } from "react-icons/pi";
import { FaClipboardList, FaRegLightbulb } from "react-icons/fa";
import Videos, {
  Assignments,
  PdfAndNotes,
  Quizzes,
} from "../../../components/dashboard-components/forms/ContentUpload";
import { GoLightBulb, GoRocket } from "react-icons/go";

const UploadMaterial = () => {
  const cardsData = [
    {
      title: "Videos ",
      value: "10",
      icon: <Video color="#06574C" size={22} />,
      // changeText: "8%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "PDFs",
      value: "10",
      icon: <PiFilePdf color="#06574C" size={22} />,
      // changeText: "5%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Quizzes",
      value: "20",
      icon: <GoLightBulb color="#06574C" size={22} />,
      // changeText: "12%",
      changeColor: "text-[#E8505B]",
    },
    {
      title: "Assignment",
      value: "15",
      icon: <LuClipboardList color="#06574C" size={22} />,
      // changeText: "-0%",
      changeColor: "text-[#9A9A9A]",
    },
  ];

  const courses = [
    { key: "Web Development", label: "Web Development" },
    { key: "React", label: "React js" },
    { key: "Next js", label: "Next js" },
  ];

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
      <div className="bg-white rounded-lg mb-3 p-4">
        <div className="">
          <h1 className="text-xl font-semibold">Course & Lecture Assignment</h1>
        </div>
        <div className="flex flex-col md:flex-row md gap-3 items-center pt-4">
          <Select
            className="md:min-w-[120px]"
            radius="sm"
            label="Select Course"
            name="Course"
            variant="bordered"
            defaultValue="all"
            labelPlacement="outside"
            placeholder="Select Course"
          >
            {courses.map((item, index) => (
              <SelectItem key={index}>{item.label}</SelectItem>
            ))}
          </Select>
          <Input
            className="w-full"
            radius="sm"
            label="Lecture Number"
            name="Lecture Number"
            variant="bordered"
            defaultValue="1"
            labelPlacement="outside"
            placeholder="Enter Lecture Number"
          />
        </div>
      </div>
      <div className=" bg-white rounded-lg mb-3 py-3 ">
        <Videos />
        <div>
          <Form className="flex flex-col md:flex-row md:justify-between md:items-end max-md:gap-3 items-start w-full px-3">
            <Input
              className="w-full text-lg font-semibold"
              radius="sm"
              label="Or add external video link"
              name="Or add external video link"
              variant="bordered"
              defaultValue="https://youtube.com..."
              labelPlacement="outside"
              placeholder="Enter video link"
            />
            <Button
              variant="solid"
              size="md"
              radius="sm"
              color="success"
              className="max-md:w-full"
              startContent={<Plus />}
            >
              Add Video
            </Button>
          </Form>
        </div>
      </div>
      <div className=" bg-white rounded-lg mb-3 py-3 ">
        <PdfAndNotes />
      </div>
      <div className=" bg-white rounded-lg mb-3 py-3 ">
        <Assignments />
      </div>
      <div className=" bg-white rounded-lg mb-3 py-3 ">
        <Quizzes />
      </div>
        
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
