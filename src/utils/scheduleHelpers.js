/**
 * Schedule Helper Utilities - Reusable across all dashboards
 */

/**
 * Convert 24-hour time to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format (h:MM AM/PM)
 */
export const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
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
    const now = new Date();
    const classDate = new Date(schedule.date);
    const [startHour, startMin] = schedule.startTime.split(':');
    const [endHour, endMin] = schedule.endTime.split(':');

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
    const now = new Date();
    const classDate = new Date(schedule.date);
    const [endHour, endMin] = schedule.endTime.split(':');

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
    if (isClassExpired(schedule)) return "Completed";
    if (isClassLive(schedule)) return "Live Now";
    return "Upcoming";
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
