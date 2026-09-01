import React from "react";
import { Badge } from "reactstrap";

export const isShortlistedInterview = (interview = {}) =>
  interview?.interviewStatus === "shortlisted" ||
  interview?.candidate?.interviewStatus === "shortlisted";

export const getInterviewStatusBadgeColor = (status) => {
  if (status === "available") return "light-warning";
  if (status === "scheduled") return "light-info";
  if (status === "rejected") return "light-danger";
  if (status === "hold") return "secondary";
  if (status === "completed") return "light-secondary";
  if (status === "cv shared") return "secondary";
  if (status === "hired") return "light-success";
  if (status === "Not Joined It") return "warning";
  if (status === "Left") return "light-info";
  if (status === "shortlisted") return "info";
  if (status === "trail") return "dark";
  if (status === "reschedule") return "warning";
  return "light-success";
};

export const InterviewStatusCell = ({ row }) => {
  // Job-scoped: without an interview for THIS job, show available
  const status = row?.latestInterview?.id
    ? row?.latestInterview?.interviewStatus ||
      row?.interviewStatus ||
      "scheduled"
    : "available";
  return (
    <Badge
      pill
      color={getInterviewStatusBadgeColor(status)}
      className="column-action d-flex align-items-center"
      style={{ textTransform: "capitalize" }}
    >
      {status}
    </Badge>
  );
};

/** Only count interview linked to this job (latestInterview from match API). */
export const hasExistingInterview = (row) =>
  Boolean(row?.latestInterview?.id);

export const resolveInterviewStatus = (interview, fallback = "scheduled") =>
  interview?.interviewStatus ||
  interview?.candidate?.interviewStatus ||
  fallback;

export const buildInterviewEditState = (
  full,
  candidate,
  jobOpeningId,
  loginUserId
) => {
  const status = resolveInterviewStatus(full, candidate?.interviewStatus || "scheduled");
  return {
    ...full,
    id: full?.id,
    candidateId: full?.candidateId || candidate?.id,
    jobOpeningId: full?.jobOpeningId || jobOpeningId,
    interviewStatus: status,
    userId: full?.userId || loginUserId,
    candidate: {
      ...(full?.candidate || {}),
      firstname: full?.candidate?.firstname || candidate?.firstname,
      lastname: full?.candidate?.lastname || candidate?.lastname,
      interviewStatus: status,
    },
  };
};

export const buildInterviewUpdatePayload = (interview) => {
  const status = resolveInterviewStatus(interview);
  return {
    id: interview?.id,
    candidateId: interview?.candidateId,
    jobOpeningId: interview?.jobOpeningId,
    onBoardingId: interview?.onBoardingId,
    userId: interview?.userId,
    date: interview?.date,
    joiningDate: interview?.joiningDate,
    startingSalary: interview?.startingSalary,
    time: interview?.time,
    link: interview?.link,
    interviewType: interview?.interviewType,
    comments: interview?.comments,
    candidate: { interviewStatus: status },
  };
};

export const fetchJobScopedInterview = async (
  getInterviewAPI,
  candidateId,
  jobOpeningId
) => {
  if (!candidateId || !jobOpeningId) return null;
  try {
    const resp = await getInterviewAPI({
      page: 1,
      perPage: 1,
      skipUserFilter: true,
      filterData: { candidateId, jobOpeningId },
    });
    return resp?.results?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const hasViewedByCurrentUser = (row) =>
  row?.viewedByCurrentUser === true;

export const getInterviewButtonLabel = (row) =>
  hasExistingInterview(row) ? "Edit Interview" : "Interview";

export const getViewProfileButtonLabel = (row, viewedIds = new Set()) => {
  const candidateId = row?.id ? String(row.id) : "";
  if (!candidateId) return "View Profile";
  if (viewedIds.has(candidateId)) return "View Again";
  if (hasViewedByCurrentUser(row)) return "View Again";
  return "View Profile";
};

export const buildBestMatchCsvRows = (candidates = []) =>
  candidates.map((row) => ({
    "First Name": row?.firstname || "-",
    "Last Name": row?.lastname || "-",
    "Match Score":
      row?.matchScore != null ? `${row.matchScore}%` : "-",
    "Profile Completion":
      row?.profileCompleteness != null ? `${row.profileCompleteness}%` : "-",
    Email: row?.email || "-",
    Mobile: row?.mobile || "-",
    Gender: row?.gender || "-",
    City: row?.city || "-",
    Experience: row?.professional?.experienceInyear || "-",
    "Job Category": row?.professional?.jobCategory?.jobCategory || "-",
    Qualification: row?.professional?.highestQualification || "-",
    "Current Salary": row?.professional?.currentSalary || "-",
    "Expected Salary": row?.professional?.expectedsalary || "-",
    "Preferred Location": row?.professional?.preferedJobLocation || "-",
    "Notice Period": row?.professional?.noticePeriod || "-",
    "Currently Working": row?.professional?.currentlyWorking || "-",
    "Interview Status":
      row?.latestInterview?.interviewStatus || row?.interviewStatus || "available",
  }));

const convertArrayOfObjectsToCSV = (array) => {
  if (!array?.length) return "";
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);
  let result = keys.join(columnDelimiter) + lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;
      const val = String(item[key] ?? "").replace(/"/g, '""');
      result += `"${val}"`;
      ctr += 1;
    });
    result += lineDelimiter;
  });

  return result;
};

export const downloadBestMatchCsv = (rows, filename) => {
  const csv = convertArrayOfObjectsToCSV(rows);
  if (!csv) return false;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download === undefined) return false;

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
