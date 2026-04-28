import React, { useState } from "react";
import { Button, Divider } from "@heroui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashHeading } from "../dashboard-components/DashHeading";

/**
 * Reusable component to display schedules grouped by date
 * @param {Object} groupedSchedules - { upcoming: {}, previous: {} }
 * @param {Function} renderCard - Function to render the specific schedule card
 */
const SchedulesByDateList = ({ groupedSchedules, renderCard }) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const { upcoming = {}, previous = {} } = groupedSchedules;

    const upcomingDates = Object.keys(upcoming).sort();
    const previousDates = Object.keys(previous).sort(); // Sort ascending to maintain chronological order

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const renderDateGroup = (dateKey, schedules) => (
        <div key={dateKey} className="mb-6">
            <DashHeading
                title={formatDate(dateKey)}
                desc={`${schedules.length} ${schedules.length === 1 ? "class" : "classes"} scheduled`}
            />
            <div className="mt-3">
                {schedules.map((schedule) => renderCard(schedule))}
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Show Previous Toggle & Past Schedules (at the top) */}
            {previousDates.length > 0 && (
                <>
                    {showPrevious && previousDates.map((dateKey) => renderDateGroup(dateKey, previous[dateKey]))}
                    
                    <div className="flex flex-col items-center gap-4 mt-2 mb-8">
                        <Button
                            variant="flat"
                            color="success"
                            onPress={() => setShowPrevious(!showPrevious)}
                            startContent={showPrevious ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            className="font-medium"
                        >
                            {showPrevious ? "Hide Previous Schedules" : "View Previous Schedules"}
                        </Button>
                        <Divider className="max-w-md" />
                    </div>
                </>
            )}

            {/* Upcoming Schedules */}
            {upcomingDates.length > 0 ? (
                upcomingDates.map((dateKey) => renderDateGroup(dateKey, upcoming[dateKey]))
            ) : !showPrevious && (
                <div className="bg-white rounded-lg p-8 text-center mb-6">
                    <p className="text-gray-500">No upcoming classes scheduled</p>
                </div>
            )}
        </div>
    );
};

export default SchedulesByDateList;
