import { useState } from "react";
import { Edit, Search } from "lucide-react";
import ChatInterface from "../../../components/chat/ChatInterface";
import { mockChatRooms } from "../../../lib/constants";



export default function TeacherAndStudentChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState({});

  const filteredChats = mockChatRooms.filter((chat) =>
    chat.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      <div className="flex flex-col md:w-80 xl:w-96 border-r border-gray-200 h-screen overflow-hidden">
        <div className="shrink-0 border-b border-gray-100 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">Messages</h1>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                29
              </span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full border border-teal-200 hover:bg-gray-50 transition-colors">
              <Edit size={20} className="text-teal-700" />
            </button>
          </div>

          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 no-scrollbar overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`
                flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200 
                ${chat.id === selectedChat?.id ? "bg-[#EBD4C9] border-l-4 border-l-[#D28E3D]" : ''}`
                }
                onClick={() => setSelectedChat(chat)}
              >

                <div className="shrink-0">
                  <div
                    className={
                      " w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold "
                    }
                    style={{
                      backgroundColor: "#eff6ff ",
                    }}
                  >
                    <img src="/icons/group-user.png" alt="group uuer" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-gray-800">{chat.student_name}</h3>
                    <span
                      className={
                        "text-xs capitalize font-medium px-2 py-1 rounded-md"
                      }
                      style={{
                        backgroundColor: "#FBF4EC",
                        color: '#D28E3D'
                      }}
                    >
                      {'Student'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-gray-800">{chat.teacher_name}</h3>
                    <span
                      className={
                        "text-xs capitalize font-medium px-2 py-1 rounded-md"
                      }
                      style={{
                        backgroundColor: "#8bc0b956",
                        color: '#06574C'
                      }}
                    >
                      {'Teacher'}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-xs text-gray-400">{chat.time}</div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages found
            </div>
          )}
        </div>
      </div>

      {selectedChat?.id ?
        <ChatInterface isTeacherAndStudent chat={selectedChat} setSelectedData={setSelectedChat} showInput={false} />
        :
        <div className="flex max-md:hidden flex-col flex-1 justify-center items-center h-screen bg-[#95c4be48]">
          <p className="text-gray-500 text-lg font-semibold">
            👋 Select a chat from the sidebar to view the conversation.
          </p>
        </div>
      }
    </div>
  );
}
