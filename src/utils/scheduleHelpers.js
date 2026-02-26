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
 * Check if a class is currently live (between start and end time)
 * @param {Object} schedule - Schedule object with date, startTime, endTime
 * @returns {boolean}
 */
export const isClassLive = (schedule) => {
    if (!schedule) return false;
    const now = new Date();
    
    // Try parsing DD-M-YY format first, fallback to standard date parsing
    let classDate = parseDateFromDB(schedule.date);
    if (!classDate) {
        classDate = new Date(schedule.date || schedule.createdAt || new Date());
    }

    const startTimeStr = schedule.startTime || schedule.start_time;
    const endTimeStr = schedule.endTime || schedule.end_time;

    if (!startTimeStr || !endTimeStr) return false;

    const [startHour, startMin] = startTimeStr.split(':');
    const [endHour, endMin] = endTimeStr.split(':');

    const startTime = new Date(classDate);
    startTime.setHours(parseInt(startHour), parseInt(startMin), 0);

    const endTime = new Date(classDate);
    endTime.setHours(parseInt(endHour), parseInt(endMin), 0);

    return now >= startTime && now <= endTime;
};

/**
 * Check if a class has ended
 * @param {Object} schedule - Schedule object with date, endTime
 * @returns {boolean}
 */
export const isClassExpired = (schedule) => {
    if (!schedule) return false;
    const now = new Date();
    
    // Try parsing DD-M-YY format first, fallback to standard date parsing
    let classDate = parseDateFromDB(schedule.date);
    if (!classDate) {
        classDate = new Date(schedule.date || schedule.createdAt || new Date());
    }

    const endTimeStr = schedule.endTime || schedule.end_time;
    if (!endTimeStr) return false;

    const [endHour, endMin] = endTimeStr.split(':');

    const endTime = new Date(classDate);
    endTime.setHours(parseInt(endHour), parseInt(endMin), 0);

    return now > endTime;
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
 * Get status text for display
 * @param {Object} schedule - Schedule object
 * @returns {string} Status text
 */
export const getStatusText = (schedule) => {
    const scheduleDates = schedule.scheduleDates || [];
    if (!scheduleDates.length) return "completed";

    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA"); 

    const [startHour, startMin] = schedule.startTime.split(":").map(Number);
    const [endHour, endMin] = schedule.endTime.split(":").map(Number);

    const lastDateStr = scheduleDates[scheduleDates.length - 1];

    if (scheduleDates.includes(todayStr)) {
        const startTime = new Date(todayStr);
        startTime.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(todayStr);
        endTime.setHours(endHour, endMin, 0, 0);

        if (now >= startTime && now <= endTime) {
            return "live";
        }

        if (now < startTime) {
            return "upcoming";
        }
    }

    if (todayStr < lastDateStr) {
        return "upcoming";
    }

    return "completed";
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
