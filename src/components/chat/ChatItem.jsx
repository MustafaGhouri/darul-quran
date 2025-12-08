

export function ChatItem({
    avatar,
    id,
    name,
    role,
    message,
    time,
    isActive = false,
    isUnread = false,
    selectedUserId,
    setSelectedUserId
}) {
    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200 
                ${id === selectedUserId ? "bg-[#EBD4C9] border-l-4 border-l-teal-accent" : ''}`
            }
            onClick={() => setSelectedUserId(id)}
        >
            <div className="shrink-0">{avatar}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-gray-800">{name}</h3>
                    <span
                        className={
                            "text-xs capitalize font-medium px-2 py-1 rounded-md"
                        }
                        style={{
                            backgroundColor: role === 'student' ? "#FBF4EC" : "#8bc0b956",
                            color: role === 'student' ? '#D28E3D' : '#06574C'
                        }}
                    >
                        {role}
                    </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{message}</p>
            </div>
            <div className="shrink-0 text-xs text-gray-400">{time}</div>
        </div>
    );
}

export function ChatItem2({
    id,
    studentName,
    teacherName,
    time,
    isActive = false,
    isUnread = false,
    selectedChatId,
    setSelectedChatId,
}) {
    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200 
                ${id === selectedChatId ? "bg-[#EBD4C9] border-l-4 border-l-teal-accent" : ''}`
            }
            onClick={() => setSelectedChatId(id)}
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
                    <h3 className="font-bold text-sm text-gray-800">{studentName}</h3>
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
                    <h3 className="font-bold text-sm text-gray-800">{teacherName}</h3>
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
            <div className="shrink-0 text-xs text-gray-400">{time}</div>
        </div>
    );
}
