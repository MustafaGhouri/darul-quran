import React, { useState } from "react";
import { useGetAllAnnouncementQuery } from "../../../redux/api/announcements";
import { Spinner, Pagination, Card, CardBody, Chip } from "@heroui/react";
import { dateFormatter } from "../../../lib/utils";
import { CiCalendar } from "react-icons/ci";
import { GrAnnounce } from "react-icons/gr";

const StudentAnnouncements = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetAllAnnouncementQuery({
    page,
    limit: 10,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Failed to load announcements
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <div className=" ">
        <h1 className="text-2xl font-bold text-[#06574C] mb-6">
          Announcements Hub
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <Spinner color="success" size="lg" />
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-2">
              <GrAnnounce size={40} className="mx-auto opacity-50" />
            </div>
            <p className="text-gray-500">No announcements right now!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.data.map((item) => (
              <Card
                key={item.id}
                className="w-full border-none shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardBody className="p-5">
                  <div className="flex gap-4 md:gap-6">
                    <div className="hidden sm:flex h-16 w-16 shrink-0 justify-center items-center bg-[#FBF4EC] rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      {item.announcementFile || item.announcement_file ? (
                        <img
                          src={item.announcementFile || item.announcement_file}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : item.createdBy === "teacher" ||
                        item.description?.toLowerCase()?.includes("schedule") ? (
                        <CiCalendar color="#D28E3D" size={28} />
                      ) : (
                        <GrAnnounce color="#06574C" size={28} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <div className="sm:hidden h-8 w-8 shrink-0 flex justify-center items-center bg-[#FBF4EC] rounded-full">
                             {item.createdBy === "teacher" || item.description?.toLowerCase()?.includes("schedule") ? (
                              <CiCalendar color="#D28E3D" size={16} />
                            ) : (
                              <GrAnnounce color="#06574C" size={16} />
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-[#06574C]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">
                          {dateFormatter(item.date)}
                        </span>
                      </div>

                      <p className="text-[#666666] text-sm leading-relaxed whitespace-pre-wrap">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap justify-between items-center pt-2 mt-2 border-t border-gray-100 gap-2">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-semibold text-[#B7721F]">
                            From {item.senderName || "Admin"}
                          </span>
                        </div>
                        
                         {item.courseId && (
                           <Chip size="sm" variant="dot" color="success" className="text-[10px] border-none font-semibold">
                             Course Related
                           </Chip>
                         )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {data?.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              showControls
              variant="ghost"
              initialPage={1}
              page={page}
              onChange={(newPage) => setPage(newPage)}
              total={data.totalPages}
              classNames={{
                item: "rounded-sm hover:bg-bg-[#06574C]/50 text-gray-600",
                cursor: "bg-[#06574C] rounded-sm text-white",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
