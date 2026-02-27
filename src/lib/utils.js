import { errorMessage } from "./toast.config";

export const parseDateForArray = (input) => {
  console.log("INPUT:", input, typeof input);
      const [month, day, year] = input.split(/[-/]/);

      const fullYear = year.length === 2 ? `20${year}` : year;

      return new Date(`${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    };

export const dateFormatter = (date, isTime = false) => {
  if (!date) return '';
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
  const [num, unit] = interval.split(" ");
  return {
    number: Number(num),
    unit: unit?.toLowerCase()?.replace("s", ""),
  };
};