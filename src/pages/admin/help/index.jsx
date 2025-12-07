import { useState } from "react";
import { Edit, Search } from "lucide-react";
import ChatItem from "../../../components/chat/ChatItem";
import { FiMoreVertical, FiPaperclip, FiSend } from 'react-icons/fi';
import { HiDocument } from 'react-icons/hi';

const mockChats = [
  {
    id: 1,
    name: "X-AE-A-13b",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "X",
    bgColor: "bg-orange-100",
  },
  {
    id: 2,
    name: "Jerome White",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "JW",
    bgColor: "bg-orange-100",
  },
  {
    id: 3,
    name: "Madagascar Silver",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "MS",
    bgColor: "bg-orange-100",
  },
  {
    id: 4,
    name: "Pippins McGray",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "PM",
    bgColor: "bg-orange-100",
  },
  {
    id: 5,
    name: "McKinsey Vermillion",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: true,
    initials: "MV",
    bgColor: "bg-orange-100",
  },
  {
    id: 6,
    name: "Dorian F. Gray",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "DG",
    bgColor: "bg-orange-100",
  },
  {
    id: 7,
    name: "Benedict Comber",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "BC",
    bgColor: "bg-orange-100",
  },
  {
    id: 8,
    name: "Kaori D. Miyazono",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "KM",
    bgColor: "bg-orange-100",
  },
  {
    id: 9,
    name: "Saylor Twift",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "ST",
    bgColor: "bg-orange-100",
  },
  {
    id: 10,
    name: "Miranda Blue",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "MB",
    bgColor: "bg-orange-100",
  },
  {
    id: 11,
    name: "Esmeralda Gray",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "EG",
    bgColor: "bg-orange-100",
  },
  {
    id: 12,
    name: "Oarack Babama",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
    initials: "OB",
    bgColor: "bg-orange-100",
  },
];


export function UserAvatar({
  initials,
  bgColor = "bg-orange-100",
  className,
  icon,
}) {
  return (
    <div
      className={
        bgColor + " w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold " +
        className
      }
    >
      {icon ? icon : <span className="text-orange-primary">{initials}</span>}
    </div>
  );
}
const messages = [
  {
    id: 1,
    sender: 'user',
    text: "Hello my dear Sir, I'm here to deliver the design requirement document for our next project.",
    time: '11:29 AM',
    hasAttachment: true,
    attachment: {
      name: 'Design__project__2025.docx',
      size: '2 page • docx'
    }
  },
  {
    id: 2,
    sender: 'assistant',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
    time: '11:29 AM'
  },
  {
    id: 3,
    sender: 'user',
    text: 'Do eiusmod truly dream of electric cheeps?',
    time: '12:41 AM'
  },
  {
    id: 4,
    sender: 'assistant',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exer',
    time: '11:29 AM'
  },
  {
    id: 5,
    sender: 'user',
    text: "Hello my dear Sir, I'm here to deliver the design requirement document for our next project.",
    time: '11:29 AM'
  },
  {
    id: 6,
    sender: 'assistant',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
    time: '11:29 AM'
  }
];
export default function HelpMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState('');

  const filteredChats = mockChats.filter((chat) =>
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
              <ChatItem
                key={chat.id}
                avatar={<UserAvatar initials={chat.initials} bgColor={chat.bgColor} />}
                name={chat.name}
                role={chat.role}
                message={chat.message}
                time={chat.time}
                isActive={chat.isActive}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages found
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 h-screen bg-[#95c4be48]">
        <div className=" border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-sm font-medium">👤</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">X-AE-A-13b</h2>
              <span className="text-xs text-orange-500">Session 1</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800">
              View Profile
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-900">
              <FiMoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="text-center py-3">
          <span className="text-xs text-gray-400">28 August</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id}>
              {msg.sender === 'user' ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="text-sm flex-col flex justify-end bg-white p-3 rounded-md mb-1">
                      {msg.text}<br />
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-xs text-gray-400">{msg.time}</span>
                        <span className="text-xs text-teal-600">✓✓</span>
                      </div>
                    </div>
                    {msg.hasAttachment && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2 flex items-start gap-3">
                        <HiDocument className="text-teal-700 flex-shrink-0" size={24} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {msg.attachment.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {msg.attachment.size}
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="max-w-[85%]">
                    <div className="text-sm text-white flex-col flex justify-end bg-teal-700 p-3 rounded-md mb-1">
                      {msg.text}<br />
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-xs text-gray-400">{msg.time}</span>
                        <span className="text-xs text-teal-600">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {index === 1 && (
                <div className="text-center py-3">
                  <span className="text-xs text-gray-400">Today</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 flex justify-center">
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-2xl">...</span>
          </button>
        </div>

        <div className=" border-t border-gray-200 px-4 py-3 shrink-0">
          <div className="flex bg-white p-3 rounded-xl items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 shrink-0">
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400 min-w-0"
            />
            <button className="px-4 py-2 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800 flex items-center gap-2 shrink-0">
              Send
              <FiSend className='rotate-45' size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function ChatInterface() {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'user',
      text: "Hello my dear Sir, I'm here to deliver the design requirement document for our next project.",
      time: '11:29 AM',
      hasAttachment: true,
      attachment: {
        name: 'Design__project__2025.docx',
        size: '2 page • docx'
      }
    },
    {
      id: 2,
      sender: 'assistant',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
      time: '11:29 AM'
    },
    {
      id: 3,
      sender: 'user',
      text: 'Do eiusmod truly dream of electric cheeps?',
      time: '12:41 AM'
    },
    {
      id: 4,
      sender: 'assistant',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exer',
      time: '11:29 AM'
    },
    {
      id: 5,
      sender: 'user',
      text: "Hello my dear Sir, I'm here to deliver the design requirement document for our next project.",
      time: '11:29 AM'
    },
    {
      id: 6,
      sender: 'assistant',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
      time: '11:29 AM'
    }
  ];

  return (
    <div className="flex flex-col dh-screen bg-gray-50 maxxxmx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 text-sm font-medium">👤</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">X-AE-A-13b</h2>
            <span className="text-xs text-orange-500">Session 1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800">
            View Profile
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-900">
            <FiMoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Date separator */}
      <div className="text-center py-3">
        <span className="text-xs text-gray-400">28 August</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id}>
            {msg.sender === 'user' ? (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <p className="text-xs text-gray-500 mb-1">{msg.text}</p>
                  {msg.hasAttachment && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2 flex items-start gap-3">
                      <HiDocument className="text-teal-700 flex-shrink-0" size={24} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {msg.attachment.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {msg.attachment.size}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[85%]">
                  <div className="bg-teal-700 text-white rounded-lg px-4 py-3">
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs text-gray-400">{msg.time}</span>
                    <span className="text-xs text-teal-600">✓✓ Sent</span>
                  </div>
                </div>
              </div>
            )}
            {index === 1 && (
              <div className="text-center py-3">
                <span className="text-xs text-gray-400">Today</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Three dots menu */}
      <div className="px-4 py-2 flex justify-center">
        <button className="text-gray-400 hover:text-gray-600">
          <span className="text-2xl">...</span>
        </button>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FiPaperclip size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400"
          />
          <button className="px-4 py-2 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800 flex items-center gap-2">
            Send
            <FiSend size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}