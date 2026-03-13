import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Initializes Google Analytics 4
 */
export const initGA = () => {
  if (MEASUREMENT_ID && MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    ReactGA.initialize(MEASUREMENT_ID);
    console.log("GA4 Initialized");
  } else {
    console.warn("GA4 Measurement ID missing or placeholder. Analytics disabled.");
  }
};

/**
 * Tracks a page view
 * @param {string} path - The URL path to track
 */
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

/**
 * Tracks a custom event
 * @param {string} category - Event category (e.g., 'Auth', 'Course', 'Payment')
 * @param {string} action - Event action (e.g., 'Login Success', 'Enrollment')
 * @param {string} label - Optional label
 * @param {number} value - Optional numeric value
 */
export const trackEvent = ({ category, action, label, value }) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

/**
 * Predefined Events
 */
export const analyticsEvents = {
  login: (role) => trackEvent({ category: "Auth", action: "Login Success", label: role }),
  enroll: (courseName) => trackEvent({ category: "Course", action: "Enrollment", label: courseName }),
  payment: (amount, course) => trackEvent({ category: "Payment", action: "Successful Payment", label: course, value: amount }),
  attendance: (course) => trackEvent({ category: "Attendance", action: "Marked Attendance", label: course }),
};
