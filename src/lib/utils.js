import { errorMessage } from "./toast.config";

export const parseDateForArray = (input) => {
  console.log("INPUT:", input, typeof input);
  const [month, day, year] = input.split(/[-/]/);

  const fullYear = year.length === 2 ? `20${year}` : year;

  return new Date(`${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
};

export const getAllowedPaths = (menu) => {
  const paths = [];

  const traverse = (items) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
      if (item.link) {
        paths.push(item.link);
      }
    });
  };

  traverse(menu);
  return paths;
};

export const dateFormatter = (date, isTime = false) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    console.warn("Invalid date passed:", date);
    return date;
  }

  const formatterUS = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: isTime ? 'numeric' : undefined,
    minute: isTime ? 'numeric' : undefined
  });
  return formatterUS.format(new Date(date))
}
export const pageTitle = (title = '') => {
  return title
    .replace(/\//g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
export const convertTo12hrsFormat = (time) => {
  if (!time) return '';
  const hr = time.split(':');
  const hours = parseInt(hr[0]);
  const minutes = hr[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
export const limits = [
  { key: "6", label: "6" },
  { key: "10", label: "10" },
  { key: "20", label: "20" },
  { key: "30", label: "30" },
  { key: "40", label: "40" },
  { key: "50", label: "50" },
];
export const uploadFilesToServer = async (filesArray, removeUrls) => {
  if (!filesArray || filesArray.length === 0) return [];

  const formData = new FormData();

  filesArray?.forEach((fileObj) => {
    formData.append('files', fileObj.file);
  });
  removeUrls?.forEach((i) => {
    formData.append('removeImageUrls', i);
  });
  try {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/uploadImages`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const result = await response.json();

    if (result.success && result.uploaded) {
      return result.uploaded;
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    errorMessage('Failed to upload files: ' + error.message);
    return [];
  }
};

export const formatForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

let debounceTimer;

export function debounce(callback, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(callback, delay);
}

export const parseInterval = (interval) => {
  if (!interval) return { number: "", unit: "" };
  if (interval === "released_immediately") {
    return { number: "", unit: "released_immediately" };
  }
  if (interval.includes(":")) {
    const hour = interval.split(":")[0];
    return { number: Number(hour), unit: "hour" };
  }

  const parts = interval.toLowerCase().split(/\s+/);
  const result = { number: "", unit: "" };

  const unitMap = {
    'year': 'year', 'years': 'year', 'yr': 'year', 'yrs': 'year',
    'mon': 'month', 'mons': 'month', 'month': 'month', 'months': 'month',
    'day': 'day', 'days': 'day', 'd': 'day',
    'hour': 'hour', 'hours': 'hour', 'hr': 'hour', 'hrs': 'hour', 'h': 'hour',
    'minute': 'minute', 'minutes': 'minute', 'min': 'minute', 'mins': 'minute', 'm': 'minute',
    'second': 'second', 'seconds': 'second', 'sec': 'second', 'secs': 'second', 's': 'second'
  };

  for (let i = 0; i < parts.length; i += 2) {
    const num = parts[i];
    const rawUnit = parts[i + 1];

    if (!num || !rawUnit) continue;

    const unit = unitMap[rawUnit] || rawUnit.replace("s", "");

    if (!unit) continue;

    if (unit === 'year' && !result.number) {
      result.number = Number(num);
      result.unit = 'year';
    } else if (unit === 'month' && !result.number) {
      result.number = Number(num);
      result.unit = 'month';
    } else if (unit === 'day' && !result.number) {
      result.number = Number(num);
      result.unit = 'day';
    } else if (unit === 'hour' && !result.number) {
      result.number = Number(num);
      result.unit = 'hour';
    } else if (unit === 'minute' && !result.number) {
      result.number = Number(num);
      result.unit = 'minute';
    }
  }

  if (!result.number) {
    const [num, rawUnit] = interval.split(" ");
    const unit = unitMap[rawUnit?.toLowerCase()] || rawUnit?.toLowerCase()?.replace("s", "");
    result.number = Number(num);
    result.unit = unit;
  }

  return result;
};

export const getScheduleDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

export const isEditable = (dateStr, startTime, endTime) => {
  const scheduleDateTime = getScheduleDateTime(dateStr, startTime);
  const scheduleEndDateTime = getScheduleDateTime(dateStr, endTime);

  const now = new Date();

  const hoursUntil = (scheduleDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  const isLive = now >= scheduleDateTime && now <= scheduleEndDateTime;

  if (isLive) return false;

  return hoursUntil < 0 || hoursUntil > 4;
};

export const canReschedule = (schedule) => {
  return schedule.scheduleDates.every(dateStr => isEditable(dateStr, schedule.startTime, schedule.endTime));
};

export const validateSchedule = (formData) => {
  const {
    title,
    startTime,
    endTime,
    scheduleType,
    date,
    startDate,
    endDate,
    repeatInterval,
    weeklyDays,
    teacherId,
    courseId
  } = formData;

  // Required fields
  if (!title || !title.trim()) {
    return { valid: false, message: "Session title is required" };
  }
  if (!startTime || !endTime) {
    return { valid: false, message: "Start time and end time are required" };
  }
  // if (!teacherId) {
  //     return { valid: false, message: "Please select a teacher" };
  // }

  // Time validation
  const now = new Date();
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  // if (now >= start) {
  //   return { valid: false, message: "Cannot schedule a session in the past" };
  // }
  if (end <= start) {
    return { valid: false, message: "End time must be after start time" };
  }

  if (scheduleType === "once") {
    if (!date) {
      return { valid: false, message: "Please select a date for one-time session" };
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { valid: false, message: "Cannot schedule a session in the past" };
    }
  }

  if (scheduleType === "daily" || scheduleType === "weekly") {
    if (!startDate) {
      return { valid: false, message: "Start date is required" };
    }
    if (end) {
      const maxRangeDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      if (maxRangeDays > 28) {
        return {
          valid: false,
          message: "Schedule cannot exceed 28 days. Please select a shorter date range."
        };
      }
    }
    const start = new Date(startDate);
    const end = endDate && new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return { valid: false, message: "Start date cannot be in the past" };
    }
    if (end && end < start) {
      return { valid: false, message: "End date must be after start date" };
    }

    const dateRangeDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (scheduleType === "daily") {
      const interval = repeatInterval && repeatInterval > 0 ? repeatInterval : 1;
      const maxSessions = Math.ceil(dateRangeDays / interval);

      if (maxSessions > 365) {
        return {
          valid: false,
          message: `This schedule would create ${maxSessions} sessions. Please reduce the date range or increase the repeat interval to avoid excessive sessions.`
        };
      }

      if (dateRangeDays > 365 && interval === 1) {
        return { valid: false, message: "Daily schedules cannot exceed 1 year. Please reduce the date range." };
      }
    }

    if (scheduleType === "weekly") {
      if (!weeklyDays || weeklyDays.length === 0) {
        return { valid: false, message: "Please select at least one day of the week" };
      }

      const interval = repeatInterval && repeatInterval > 0 ? repeatInterval : 1;

      const weeksRange = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));

      if (interval > weeksRange && weeksRange > 0) {
        return {
          valid: false,
          message: `Repeat interval (${interval} weeks) is longer than your date range (${weeksRange} week(s)). This will create only 1 session. Please adjust your dates or interval.`
        };
      }

      const estimatedSessions = Math.ceil(weeksRange / interval) * weeklyDays.length;

      if (estimatedSessions > 200) {
        return {
          valid: false,
          message: `This schedule would create approximately ${estimatedSessions} sessions. Please reduce the date range, decrease selected days, or increase the repeat interval.`
        };
      }

      if (estimatedSessions === 0) {
        return {
          valid: false,
          message: "No valid session dates will be generated. Please check your selected days and date range."
        };
      }

      if (interval >= 4 && weeksRange < 8) {
        return {
          valid: false,
          message: `With a ${interval}-week interval and only ${weeksRange} weeks range, you'll get very few sessions. Consider reducing the interval or extending the date range.`
        };
      }
    }
  }

  return { valid: true, message: "" };
};