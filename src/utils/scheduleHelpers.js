/**
 * Schedule Helper Utilities - Reusable across all dashboards
 */

/**
 * Parse date from string (supports YYYY-MM-DD and DD-M-YY formats)
 * @param {string} dateStr - Date string 
 * @returns {Date|null} Parsed Date object or null if invalid
 */
const parseDateFromDB = (dateStr) => {
    if (!dateStr) return null;

    // Try YYYY-MM-DD format first (from PostgreSQL date array)
    if (dateStr.includes('-') && dateStr.length === 10) {
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Try DD-M-YY format (e.g., "26-2-5")
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        let year = parseInt(parts[2], 10);
        // Handle 2-digit years (assume 20xx for years < 100)
        if (year < 100) year += 2000;
        const parsed = new Date(year, month, day);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Fallback to standard Date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Convert 24-hour time to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format (h:MM AM/PM)
 */
export const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    const [hours, minutes] = parts;
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Get today's date string in YYYY-MM-DD format (local time)
 * @returns {string} Today's date string
 */
const getTodayStr = () => {
    const now = new Date();
    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
};

/**
 * Check if today is in the schedule dates
 * @param {string[]} scheduleDates - Array of date strings
 * @returns {boolean}
 */
const isTodayInSchedule = (scheduleDates) => {
    if (!Array.isArray(scheduleDates)) return false;
    const todayStr = getTodayStr();
    return scheduleDates.includes(todayStr);
};

/**
 * Get the next upcoming date from scheduleDates that is today or in the future
 * @param {string[]} scheduleDates - Array of date strings
 * @returns {string|null} Next upcoming date or null
 */
const getNextScheduleDate = (scheduleDates) => {
    if (!Array.isArray(scheduleDates) || scheduleDates.length === 0) return null;
    const todayStr = getTodayStr();
    const upcomingDates = scheduleDates.filter(d => d >= todayStr);
    if (upcomingDates.length === 0) return null;
    return upcomingDates.sort()[0];
};

/**
 * Check if a class is currently live (between start and end time)
 * @param {Object} schedule - Schedule object with scheduleDates, startTime, endTime
 * @returns {boolean}
 */
export const isClassLive = (schedule, type = 'multiple') => {
    if (!schedule) return false;
    if (type === 'multiple') {
        let scheduleDates = schedule.scheduleDates || schedule.schedule_dates;

        // If no scheduleDates array, check if there's a single date field
        if (!scheduleDates || scheduleDates.length === 0) {
            const singleDate = schedule.date;
            if (singleDate) {
                // Convert ISO date or YYYY-MM-DD to date string
                const dateStr = singleDate.includes('T') ? singleDate.split('T')[0] : singleDate;
                scheduleDates = [dateStr];
            } else {
                return false;
            }
        }

        if (!isTodayInSchedule(scheduleDates)) return false;

        const startTimeStr = schedule.startTime || schedule.start_time;
        const endTimeStr = schedule.endTime || schedule.end_time;

        if (!startTimeStr || !endTimeStr) return false;

        const today = getTodayStr();

        const [startHour, startMin] = startTimeStr.split(":");
        const [endHour, endMin] = endTimeStr.split(":");

        const startTime = new Date(`${today}T${startHour}:${startMin}:00`);
        const endTime = new Date(`${today}T${endHour}:${endMin}:00`);

        const now = new Date();
        return now >= startTime && now <= endTime;
    } else {
        if (!schedule) return false;

        // If schedule has a specific date property (for grouped schedules), use that
        if (schedule.date) {
            const todayStr = getTodayStr();
            // Normalize the schedule date to YYYY-MM-DD format
            const scheduleDateStr = schedule.date.includes('T') ? schedule.date.split('T')[0] : schedule.date;

            // If the schedule date is not today, it can't be live
            if (scheduleDateStr !== todayStr) return false;
        }

        let scheduleDates = schedule.scheduleDates || schedule.schedule_dates;

        // If no scheduleDates array, check if there's a single date field
        if (!scheduleDates || scheduleDates.length === 0) {
            const singleDate = schedule.date;
            if (singleDate) {
                // Convert ISO date or YYYY-MM-DD to date string
                const dateStr = singleDate.includes('T') ? singleDate.split('T')[0] : singleDate;
                scheduleDates = [dateStr];
            } else {
                return false;
            }
        }

        if (!isTodayInSchedule(scheduleDates)) return false;

        const startTimeStr = schedule.startTime || schedule.start_time;
        const endTimeStr = schedule.endTime || schedule.end_time;

        if (!startTimeStr || !endTimeStr) return false;

        const today = getTodayStr();

        const [startHour, startMin] = startTimeStr.split(":");
        const [endHour, endMin] = endTimeStr.split(":");

        // Create date objects using the actual schedule date (today) and the time
        const [year, month, day] = today.split("-").map(Number);
        const startTime = new Date(year, month - 1, day, parseInt(startHour), parseInt(startMin));
        const endTime = new Date(year, month - 1, day, parseInt(endHour), parseInt(endMin));

        const now = new Date();
        return now >= startTime && now <= endTime;
    }
};

/**
 * Check if a class has ended (all dates are in the past or today's class time has passed)
 * @param {Object} schedule - Schedule object with scheduleDates, endTime
 * @returns {boolean}
 */
export const isClassExpired = (schedule) => {
    if (!schedule) return false;

    let scheduleDates = schedule.scheduleDates || schedule.schedule_dates;

    // If no scheduleDates array, check if there's a single date field
    if (!scheduleDates || scheduleDates.length === 0) {
        const singleDate = schedule.date;
        if (singleDate) {
            // Convert ISO date or YYYY-MM-DD to date string
            const dateStr = singleDate.includes('T') ? singleDate.split('T')[0] : singleDate;
            scheduleDates = [dateStr];
        } else {
            return true;
        }
    }

    if (!scheduleDates || scheduleDates.length === 0) return true;

    const todayStr = getTodayStr();
    const now = new Date();

    // Check if there are any future dates
    const futureDates = scheduleDates.filter(d => d > todayStr);
    if (futureDates.length > 0) return false; // Has future dates, not expired

    // Only today or past dates remain - check if today's class has ended
    if (scheduleDates.includes(todayStr)) {
        const endTimeStr = schedule.endTime || schedule.end_time;
        if (!endTimeStr) return true;

        const [endHour, endMin] = endTimeStr.split(":");
        const endTime = new Date(`${todayStr}T${endHour}:${endMin}:00`);

        return now > endTime;
    }

    // All dates are in the past
    return true;
};

/**
 * Get status color for chip/badge display
 * @param {Object} schedule - Schedule object
 * @returns {string} HeroUI color name
 */
export const getStatusColor = (schedule) => {
    if (isClassExpired(schedule)) return "default";
    if (isClassLive(schedule)) return "success";
    return "warning";
};

/**
 * Get status text for display (for recurring schedules with scheduleDates array)
 * @param {Object} schedule - Schedule object with scheduleDates, startTime, endTime
 * @returns {string} Status text: "live", "upcoming", or "completed"
 */
export const getStatusText = (schedule) => {
    const scheduleDates = schedule.scheduleDates || schedule.schedule_dates || [];
    if (!scheduleDates.length) return "completed";

    const todayStr = getTodayStr();
    const now = new Date();

    const [startHour, startMin] = (schedule.startTime || "").split(":").map(Number);
    const [endHour, endMin] = (schedule.endTime || "").split(":").map(Number);

    // Check if today is in the schedule
    if (scheduleDates.includes(todayStr)) {
        const [year, month, day] = todayStr.split("-").map(Number);
        const startTime = new Date(year, month - 1, day, startHour, startMin);
        const endTime = new Date(year, month - 1, day, endHour, endMin);

        if (now >= startTime && now <= endTime) {
            return "live";
        }

        if (now < startTime) {
            return "upcoming";
        }
        // Today's class has ended, but check if there are future dates
    }

    // Check if there are any future dates
    const futureDates = scheduleDates.filter(d => d > todayStr);
    if (futureDates.length > 0) {
        return "upcoming";
    }

    return "completed";
};

/**
 * Get status text for single date schedule
 * @param {string} date - "YYYY-MM-DD"
 * @param {string} startTime - "HH:mm"
 * @param {string} endTime - "HH:mm"
 * @return {string}
 */
export const getStatusTextForSingleDate = (date, startTime, endTime) => {
    const now = new Date();
    const todayStr = getTodayStr();

    // If today is not the schedule date
    if (date !== todayStr) {
        return todayStr < date ? "upcoming" : "completed";
    }

    // Parse time
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    // Create LOCAL date objects correctly
    const [year, month, day] = date.split("-").map(Number);

    const start = new Date(year, month - 1, day, startHour, startMin);
    const end = new Date(year, month - 1, day, endHour, endMin);

    if (now >= start && now <= end) {
        return "live";
    }

    if (now < start) {
        return "upcoming";
    }

    return "completed";
};

/**
 * Get hours until class starts for a specific date
 * @param {string} date - "YYYY-MM-DD"
 * @param {string} startTime - "HH:mm"
 * @return {number|null} Hours until class (negative if already started), null if invalid
 */
export const getHoursUntilClass = (date, startTime) => {
    if (!date || !startTime) return null;

    const now = new Date();
    const [year, month, day] = date.split("-").map(Number);
    const [startHour, startMin] = startTime.split(":").map(Number);

    const scheduleStart = new Date(year, month - 1, day, startHour, startMin);
    const hoursUntil = (scheduleStart - now) / (1000 * 60 * 60);

    return hoursUntil;
};

/**
 * Filter schedules to only show upcoming/future classes
 * @param {Array} schedules - Array of schedule objects
 * @returns {Array} Filtered schedules
 */
export const getUpcomingSchedules = (schedules) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return schedules.filter(s => new Date(s.date) >= today);
};
