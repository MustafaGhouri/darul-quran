import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomCalendar = ({ 
    selectedDates = [], 
    onDateClick,
    className = "" 
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            let year, month, day;
            
            if (parts[0].length === 4) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                day = parseInt(parts[2], 10);
            } else {
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                year = parseInt(parts[2], 10);
                if (year < 100) year += 2000;
            }
            
            const parsed = new Date(year, month, day);
            return isNaN(parsed.getTime()) ? null : parsed;
        }
        
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const normalizeDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
    };

    const isSelected = useMemo(() => {
        const normalizedSelected = selectedDates.map(d => {
            const parsed = parseDate(d);
            return parsed ? normalizeDate(parsed) : null;
        }).filter(Boolean);
        
        return (date) => {
            return normalizedSelected.includes(normalizeDate(date));
        };
    }, [selectedDates]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        return { daysInMonth, startingDay };
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className={`bg-[#FBF4EC]  rounded-2xl shadow-lg p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-[#95C4BE33] rounded-full transition-colors text-gray-600 hover:text-[#06574C]"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-[#06574C]">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                </div>
                <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-[#95C4BE33] rounded-full transition-colors text-gray-600 hover:text-[#06574C]"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="flex justify-center mb-3">
                <button
                    onClick={goToToday}
                    className="text-sm cursor-pointer text-[#06574C] hover:underline font-medium"
                >
                    Go to Today
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="py-3"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const selected = isSelected(date);
                    const isToday = normalizeDate(new Date()) === normalizeDate(date);

                    return (
                        <button
                            key={day}
                            onClick={() => onDateClick(date)}
                            className={`
                                size-8 shrink-0 cursor-pointer rounded-md text-sm font-medium
                                transition-all duration-200
                                hover:bg-[#95C4BE33] hover:text-[#06574C]
                                ${selected 
                                    ? 'bg-[#06574C] text-white font-semibold shadow-md' 
                                    : 'text-gray-700'
                                }
                                ${isToday && !selected 
                                    ? 'border-2 border-[#06574C] text-[#06574C]' 
                                    : ''
                                }
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#06574C]"></div>
                        <span className="text-gray-600">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-[#06574C]"></div>
                        <span className="text-gray-600">Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomCalendar;
