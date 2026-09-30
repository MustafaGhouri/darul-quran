/** 1:1 website listings — enquiry/form only, not free portal enrollment */
export function isEnquiryCourse(course) {
  return course?.type === "one_to_one";
}

export function getCourseBadgeLabel(course) {
  if (isEnquiryCourse(course)) return "Enquiry";
  if (course?.isFree) return "Free";
  return "Paid";
}

export function getCoursePriceLabel(course) {
  if (isEnquiryCourse(course)) return "Enquiry";
  const price = Number(course?.coursePrice ?? 0);
  if (course?.isFree || !Number.isFinite(price) || price <= 0) return "Free";
  return `£${course.coursePrice}`;
}

export function getCourseTypeLabel(type) {
  if (type === "one_to_one") return "1:1 / Enquiry";
  if (type === "one_time") return "One time";
  if (type === "in_person") return "In person";
  if (type === "live") return "Live";
  return String(type || "").replaceAll("_", " ");
}
