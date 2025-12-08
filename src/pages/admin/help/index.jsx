import { useState } from "react";
import { Edit, Search } from "lucide-react";
import ChatInterface from "../../../components/chat/ChatInterface";
import { mockUser } from "../../../lib/constants";


export default function HelpMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState({});

  const filteredChats = mockUser.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      <div className="hidden md:flex md:flex-col md:w-80 xl:w-96 border-r border-gray-200 h-screen overflow-hidden">
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

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`
                flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200 
                ${chat.id === selectedUser.id ? "bg-[#EBD4C9] border-l-4 border-l-teal-accent" : ''}`
                }
                onClick={() => setSelectedUser(chat)}
              >
                <div className="shrink-0"><div
                  className={
                    " w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold "
                  }
                  style={{
                    backgroundColor: chat.role === 'student' ? "#FBF4EC" : "#8bc0b956",
                    color: chat.role === 'student' ? '#D28E3D' : '#06574C'
                  }}
                >
                  {chat.role === 'teacher' ?
                    <img src="/icons/teacher_icon.png" alt="teacher" />
                    :
                    <img src="/icons/student_icon.png" alt="student" />
                  }
                </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-gray-800">{chat.name}</h3>
                    <span
                      className={
                        "text-xs capitalize font-medium px-2 py-1 rounded-md"
                      }
                      style={{
                        backgroundColor: chat.role === 'student' ? "#FBF4EC" : "#8bc0b956",
                        color: chat.role === 'student' ? '#D28E3D' : '#06574C'
                      }}
                    >
                      {chat.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.message}</p>
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

      {selectedUser.id ? <ChatInterface user={selectedUser} />
       :
      <div className="flex flex-col flex-1 justify-center items-center h-screen bg-[#95c4be48]">
        <p className="text-gray-500 text-lg font-semibold">
          👋 Select a chat from the sidebar to view the conversation.
        </p>
      </div>
      }
    </div>
  );
}


